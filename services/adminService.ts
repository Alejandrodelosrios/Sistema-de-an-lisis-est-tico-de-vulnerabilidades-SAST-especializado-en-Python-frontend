import api from "@/lib/api";
import type {
  OpinionListResponse,
  MetricasOpinionesResponse,
  EncuestaListResponse,
  MetricasEncuestaResponse,
  ResumenActividadListResponse,
  TimelineUsuarioResponse,
} from "@/lib/types/admin";

export const adminService = {
  // --- Usuarios / actividad -------------------------------------------
  getResumenUsuarios: async (): Promise<ResumenActividadListResponse> => {
    const response = await api.get("/admin/actividad/usuarios");
    return response.data;
  },

  getTimelineUsuario: async (
    usuarioId: number
  ): Promise<TimelineUsuarioResponse> => {
    const response = await api.get(
      `/admin/actividad/usuarios/${usuarioId}/timeline`
    );
    return response.data;
  },

  // --- Opiniones ---------------------------------------------------------
  getOpiniones: async (): Promise<OpinionListResponse> => {
    const response = await api.get("/opiniones/");
    return response.data;
  },

  getMetricasOpiniones: async (): Promise<MetricasOpinionesResponse> => {
    const response = await api.get("/opiniones/metricas");
    return response.data;
  },

  /**
   * CORREGIDO: el backend espera OpinionUpdateEstado -> { revisada: 0 | 1 },
   * no { estado: string }. Ver app/schemas/feedback.py::OpinionUpdateEstado.
   */
  actualizarEstadoOpinion: async (id: number, revisada: 0 | 1) => {
    const response = await api.patch(`/opiniones/${id}/estado`, { revisada });
    return response.data;
  },

  // --- Encuesta ------------------------------------------------------------
  getEncuestas: async (): Promise<EncuestaListResponse> => {
    const response = await api.get("/encuestas/");
    return response.data;
  },

  getMetricasEncuestas: async (): Promise<MetricasEncuestaResponse> => {
    const response = await api.get("/encuestas/metricas");
    return response.data;
  },

  // NOTA: NO existe todavía GET /auth/admin/dashboard en el backend
  // (no está en app/routers/auth.py ni hay servicio para eso).
  // Los KPIs generales del header se derivan en el frontend combinando
  // getResumenUsuarios() + getMetricasOpiniones() + getMetricasEncuestas().
};

export default adminService;