"use client";

import { useEffect, useMemo, useState, type ReactElement } from "react";
import {
  Bug,
  Loader2,
  MessageSquare,
  PartyPopper,
  Star,
  Lightbulb,
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { MetricCard } from "@/components/admin/MetricCard";
import type {
  CategoriaOpinion,
  MetricasOpinionesResponse,
  OpinionResponse,
} from "@/lib/types/admin";

type FiltroCategoria = "todas" | CategoriaOpinion;
type FiltroEstado = "todas" | "pendiente" | "revisada";

const categoriaIcono: Record<CategoriaOpinion, ReactElement> = {
  bug: <Bug className="h-3.5 w-3.5" />,
  sugerencia: <Lightbulb className="h-3.5 w-3.5" />,
  felicitacion: <PartyPopper className="h-3.5 w-3.5" />,
  otro: <MessageSquare className="h-3.5 w-3.5" />,
};

const categoriaLabel: Record<CategoriaOpinion, string> = {
  bug: "Bug",
  sugerencia: "Sugerencia",
  felicitacion: "Felicitación",
  otro: "Otro",
};

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function OpinionsPanel() {
  const [opiniones, setOpiniones] = useState<OpinionResponse[]>([]);
  const [metricas, setMetricas] = useState<MetricasOpinionesResponse | null>(
    null
  );
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] =
    useState<FiltroCategoria>("todas");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todas");
  const [actualizandoId, setActualizandoId] = useState<number | null>(null);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [opinionesRes, metricasRes] = await Promise.all([
        adminService.getOpiniones(),
        adminService.getMetricasOpiniones(),
      ]);
      setOpiniones(opinionesRes.opiniones);
      setMetricas(metricasRes);
      setError(null);
    } catch {
      setError("No se pudieron cargar las opiniones.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const opinionesFiltradas = useMemo(() => {
    return opiniones.filter((o) => {
      const pasaCategoria =
        filtroCategoria === "todas" || o.categoria === filtroCategoria;
      const pasaEstado =
        filtroEstado === "todas" ||
        (filtroEstado === "pendiente" && o.revisada === 0) ||
        (filtroEstado === "revisada" && o.revisada === 1);
      return pasaCategoria && pasaEstado;
    });
  }, [opiniones, filtroCategoria, filtroEstado]);

  const alternarEstado = async (opinion: OpinionResponse) => {
    const nuevoEstado: 0 | 1 = opinion.revisada === 1 ? 0 : 1;
    setActualizandoId(opinion.id);
    // actualización optimista
    setOpiniones((prev) =>
      prev.map((o) =>
        o.id === opinion.id ? { ...o, revisada: nuevoEstado } : o
      )
    );
    try {
      await adminService.actualizarEstadoOpinion(opinion.id, nuevoEstado);
      // refrescamos métricas (pendientes/revisadas cambiaron)
      const metricasRes = await adminService.getMetricasOpiniones();
      setMetricas(metricasRes);
    } catch {
      // revertir en caso de error
      setOpiniones((prev) =>
        prev.map((o) =>
          o.id === opinion.id ? { ...o, revisada: opinion.revisada } : o
        )
      );
      setError("No se pudo actualizar el estado de la opinión.");
    } finally {
      setActualizandoId(null);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando opiniones...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {metricas && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard
            label="Total opiniones"
            value={metricas.total_opiniones}
            icon={MessageSquare}
            color="blue"
          />
          <MetricCard
            label="Calificación promedio"
            value={metricas.promedio_calificacion.toFixed(1)}
            icon={Star}
            color="amber"
          />
          <MetricCard
            label="Pendientes"
            value={metricas.pendientes}
            color="red"
          />
          <MetricCard
            label="Revisadas"
            value={metricas.revisadas}
            color="green"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filtroCategoria}
          onChange={(e) =>
            setFiltroCategoria(e.target.value as FiltroCategoria)
          }
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200"
        >
          <option value="todas">Todas las categorías</option>
          <option value="bug">Bug</option>
          <option value="sugerencia">Sugerencia</option>
          <option value="felicitacion">Felicitación</option>
          <option value="otro">Otro</option>
        </select>

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as FiltroEstado)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200"
        >
          <option value="todas">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="revisada">Revisadas</option>
        </select>

        <span className="ml-auto text-sm text-slate-500">
          {opinionesFiltradas.length} de {opiniones.length}
        </span>
      </div>

      <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900/30">
        {opinionesFiltradas.map((o) => (
          <div key={o.id} className="flex items-start gap-4 p-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
                  {categoriaIcono[o.categoria]}
                  {categoriaLabel[o.categoria]}
                </span>
                {o.calificacion !== null && (
                  <span className="inline-flex items-center gap-0.5 text-xs text-amber-400">
                    <Star className="h-3 w-3 fill-current" />
                    {o.calificacion}/5
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  usuario #{o.usuario_id} · {formatearFecha(o.creado_en)}
                </span>
              </div>
              <p className="text-sm text-slate-200">{o.comentario}</p>
            </div>

            <button
              onClick={() => alternarEstado(o)}
              disabled={actualizandoId === o.id}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                o.revisada === 1
                  ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                  : "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
              }`}
            >
              {actualizandoId === o.id
                ? "..."
                : o.revisada === 1
                  ? "Revisada"
                  : "Pendiente"}
            </button>
          </div>
        ))}

        {opinionesFiltradas.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-slate-500">
            No hay opiniones que coincidan con el filtro.
          </p>
        )}
      </div>
    </div>
  );
}

export default OpinionsPanel;