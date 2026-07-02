"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, FolderKanban, MessageSquare, Users } from "lucide-react";
import { getRol } from "@/lib/auth";
import { adminService } from "@/services/adminService";
import { AdminTabs, type AdminView } from "@/components/admin/AdminTabs";
import { MetricCard } from "@/components/admin/MetricCard";
import { UserActivityTable } from "@/components/admin/UserActivityTable";
import { OpinionsPanel } from "@/components/admin/OpinionsPanel";
import { SurveyMetricsPanel } from "@/components/admin/SurveyMetricsPanel";
import type { ResumenActividadUsuario } from "@/lib/types/admin";

interface KpisGenerales {
  totalUsuarios: number;
  totalProyectos: number;
  totalAnalisis: number;
  totalOpiniones: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [view, setView] = useState<AdminView>("usuarios");
  const [kpis, setKpis] = useState<KpisGenerales | null>(null);

  // --- Protección de ruta ------------------------------------------------
  // Nota: reemplazar por la lógica exacta que ya tenías en app/admin/page.tsx
  // si difiere de esta (getRol() ya existe en lib/auth.ts según el plan).
  useEffect(() => {
    const rol = getRol();
    if (!rol) {
      router.replace("/login");
      return;
    }
    if (rol !== "superadmin") {
      router.replace("/dashboard");
      return;
    }
    setAutorizado(true);
  }, [router]);

  // --- KPIs generales (derivados: no existe GET /auth/admin/dashboard) ---
  useEffect(() => {
    if (!autorizado) return;
    Promise.all([
      adminService.getResumenUsuarios(),
      adminService.getMetricasOpiniones(),
    ])
      .then(([resumen, opiniones]) => {
        const totalProyectos = resumen.usuarios.reduce(
          (acc: number, u: ResumenActividadUsuario) => acc + u.total_proyectos,
          0
        );
        const totalAnalisis = resumen.usuarios.reduce(
          (acc: number, u: ResumenActividadUsuario) => acc + u.total_analisis,
          0
        );
        setKpis({
          totalUsuarios: resumen.total,
          totalProyectos,
          totalAnalisis,
          totalOpiniones: opiniones.total_opiniones,
        });
      })
      .catch(() => {
        // los paneles individuales ya muestran su propio error si esto falla
      });
  }, [autorizado]);

  if (!autorizado) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">
          Panel de Superadmin
        </h1>
        <p className="text-sm text-slate-400">
          PyGuardian — actividad de usuarios, opiniones y encuesta de
          validación.
        </p>
      </header>

      {kpis && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard
            label="Usuarios registrados"
            value={kpis.totalUsuarios}
            icon={Users}
            color="blue"
          />
          <MetricCard
            label="Proyectos creados"
            value={kpis.totalProyectos}
            icon={FolderKanban}
            color="default"
          />
          <MetricCard
            label="Análisis ejecutados"
            value={kpis.totalAnalisis}
            icon={ClipboardCheck}
            color="green"
          />
          <MetricCard
            label="Opiniones recibidas"
            value={kpis.totalOpiniones}
            icon={MessageSquare}
            color="amber"
          />
        </div>
      )}

      <AdminTabs view={view} onChange={setView} />

      <section>
        {view === "usuarios" && <UserActivityTable />}
        {view === "opiniones" && <OpinionsPanel />}
        {view === "encuesta" && <SurveyMetricsPanel />}
      </section>
    </div>
  );
}