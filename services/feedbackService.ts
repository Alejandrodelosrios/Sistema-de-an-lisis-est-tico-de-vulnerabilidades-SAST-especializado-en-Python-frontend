import api from '@/lib/api';

export interface OpinionData {
  categoria: 'bug' | 'sugerencia' | 'felicitacion' | 'otro'; // ← coincide con el Enum del backend
  calificacion?: number;
  comentario: string;
  proyecto_id?: number|null;
}

export interface EncuestaData {
  proyecto_id: number;
  facilidad_carga: number;
  relevancia_vulnerabilidades: number;
  tiempo_analisis_adecuado: "si" | "masomenos" | "no";
  claridad_explicaciones: number;
  aprendio_algo_nuevo: "si" | "no";
  comentario_aprendizaje?: string;
  claridad_recomendaciones: number;
  intuitividad_dashboard: number;
  comentario_mejora?: string;
  nps: number;
}

export const feedbackService = {
  enviarOpinion: async (data: OpinionData) => {
    return await api.post('/opiniones/', data);
  },

  enviarEncuesta: async (data: EncuestaData) => {
    return await api.post('/encuestas/', data);
  }
};