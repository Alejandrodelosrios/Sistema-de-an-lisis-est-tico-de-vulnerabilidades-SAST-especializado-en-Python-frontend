"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminService } from "@/services/adminService";
import { MetricCard } from "@/components/admin/MetricCard";
import type { MetricasEncuestaResponse } from "@/lib/types/admin";

const COLOR_BARRA = "#6366f1";

export function SurveyMetricsPanel() {
  const [metricas, setMetricas] = useState<MetricasEncuestaResponse | null>(
    null
  );
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    adminService
      .getMetricasEncuestas()
      .then((data) => {
        if (activo) setMetricas(data);
      })
      .catch(() => {
        if (activo)
          setError("No se pudieron cargar las métricas de la encuesta.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando métricas de la encuesta...
      </div>
    );
  }

  if (error || !metricas) {
    return (
      <p className="py-8 text-center text-sm text-red-600">
        {error ?? "Sin datos."}
      </p>
    );
  }

  if (metricas.total_respuestas === 0) {
    return (
      <p className="py-16 text-center text-sm text-slate-500">
        Todavía no hay respuestas a la encuesta.
      </p>
    );
  }

  const datosGrafica = [
    {
      pregunta: "Facilidad de carga",
      promedio: metricas.promedio_facilidad_carga,
    },
    {
      pregunta: "Relevancia vulnerabilidades",
      promedio: metricas.promedio_relevancia_vulnerabilidades,
    },
    {
      pregunta: "Claridad explicaciones",
      promedio: metricas.promedio_claridad_explicaciones,
    },
    {
      pregunta: "Claridad recomendaciones",
      promedio: metricas.promedio_claridad_recomendaciones,
    },
    {
      pregunta: "Intuitividad dashboard",
      promedio: metricas.promedio_intuitividad_dashboard,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          label="Respuestas totales"
          value={metricas.total_respuestas}
          color="blue"
        />
        <MetricCard
          label="NPS promedio"
          value={`${metricas.promedio_nps.toFixed(1)} / 10`}
          color={metricas.promedio_nps >= 7 ? "green" : "amber"}
        />
        <MetricCard
          label="Aprendió algo nuevo"
          value={`${metricas.porcentaje_aprendio_algo_nuevo.toFixed(0)}%`}
          color="green"
        />
        <MetricCard
          label="Intuitividad dashboard"
          value={`${metricas.promedio_intuitividad_dashboard.toFixed(1)} / 5`}
          color="default"
        />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
        <h3 className="mb-4 text-sm font-medium text-slate-400">
          Promedios por pregunta (escala 1-5)
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={datosGrafica}
            layout="vertical"
            margin={{ left: 24, right: 24 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
            <XAxis
              type="number"
              domain={[0, 5]}
              tickCount={6}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="pregunta"
              width={170}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: 8,
                color: "#e2e8f0",
              }}
              labelStyle={{ color: "#e2e8f0" }}
              formatter={(value) => [
                typeof value === "number" ? value.toFixed(2) : String(value ?? "—"),
                "Promedio",
              ]}
            />
            <Bar dataKey="promedio" radius={[0, 6, 6, 0]}>
              {datosGrafica.map((_, i) => (
                <Cell key={i} fill={COLOR_BARRA} fillOpacity={0.75 + i * 0.05} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SurveyMetricsPanel;