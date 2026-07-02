"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MinusCircle } from "lucide-react";
import { adminService } from "@/services/adminService";
import type { ResumenActividadUsuario } from "@/lib/types/admin";
import { UserTimelinePanel } from "@/components/admin/UserTimelinePanel";

function formatearFecha(fecha: string | null) {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function UserActivityTable() {
  const [usuarios, setUsuarios] = useState<ResumenActividadUsuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<
    number | null
  >(null);
  const [panelAbierto, setPanelAbierto] = useState(false);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    adminService
      .getResumenUsuarios()
      .then((data) => {
        if (activo) setUsuarios(data.usuarios);
      })
      .catch(() => {
        if (activo) setError("No se pudo cargar la actividad de usuarios.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  const abrirTimeline = (u: ResumenActividadUsuario) => {
    setUsuarioSeleccionado(u.usuario_id);
    setPanelAbierto(true);
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando usuarios...
      </div>
    );
  }

  if (error) {
    return <p className="py-8 text-center text-sm text-red-400">{error}</p>;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/60 text-left text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Correo</th>
              <th className="px-4 py-3 font-medium">Registro</th>
              <th className="px-4 py-3 font-medium">Último login</th>
              <th className="px-4 py-3 text-right font-medium">Proyectos</th>
              <th className="px-4 py-3 text-right font-medium">Análisis</th>
              <th className="px-4 py-3 text-center font-medium">Opinión</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr
                key={u.usuario_id}
                onClick={() => abrirTimeline(u)}
                className="cursor-pointer border-t border-slate-800 transition-colors hover:bg-slate-800/40"
              >
                <td className="px-4 py-3 font-medium text-slate-200">
                  {u.nombre_completo}
                </td>
                <td className="px-4 py-3 text-slate-400">{u.correo}</td>
                <td className="px-4 py-3 text-slate-300">
                  {formatearFecha(u.fecha_registro)}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {formatearFecha(u.ultimo_login)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-300">
                  {u.total_proyectos}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-300">
                  {u.total_analisis}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    {u.dejo_opinion ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <MinusCircle className="h-4 w-4 text-slate-600" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  Todavía no hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserTimelinePanel
        isOpen={panelAbierto}
        usuarioId={usuarioSeleccionado}
        onClose={() => setPanelAbierto(false)}
      />
    </>
  );
}

export default UserActivityTable;