import api from '@/lib/api';

export const adminService = {
  // --- OPINIONES ---
  getOpiniones: async () => {
    const response = await api.get('/opiniones/');
    return response.data;
  },
  actualizarEstadoOpinion: async (id: number, estado: string) => {
    const response = await api.patch(`/opiniones/${id}/estado`, { estado });
    return response.data;
  },
  getMetricasOpiniones: async () => {
    const response = await api.get('/opiniones/metricas');
    return response.data;
  },

  // --- ENCUESTAS ---
  getEncuestas: async () => {
    const response = await api.get('/encuestas/');
    return response.data;
  },
  getMetricasEncuestas: async () => {
    const response = await api.get('/encuestas/metricas');
    return response.data;
  },

  // --- USUARIOS ---
  getResumenUsuarios: async () => {
    const response = await api.get('/admin/actividad/usuarios');
    return response.data;
  },
  getTimelineUsuario: async (usuarioId: number) => {
    const response = await api.get(`/admin/actividad/usuarios/${usuarioId}/timeline`);
    return response.data;
  }
};