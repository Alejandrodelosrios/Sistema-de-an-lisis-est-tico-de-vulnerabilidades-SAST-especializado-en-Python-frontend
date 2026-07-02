/**
 * Tipos espejo de los schemas Pydantic del backend (app/schemas/feedback.py
 * y app/schemas/activity_log.py). Mantenerlos sincronizados si el backend cambia.
 */

// ---------------------------------------------------------------------------
// OPINIONES
// ---------------------------------------------------------------------------
export type CategoriaOpinion = "bug" | "sugerencia" | "felicitacion" | "otro";

export interface OpinionResponse {
  id: number;
  usuario_id: number;
  proyecto_id: number | null;
  categoria: CategoriaOpinion;
  calificacion: number | null; // 1-5, puede venir null
  comentario: string;
  revisada: 0 | 1;
  creado_en: string; // ISO datetime
}

export interface OpinionListResponse {
  total: number;
  opiniones: OpinionResponse[];
}

export interface MetricasOpinionesResponse {
  total_opiniones: number;
  promedio_calificacion: number;
  pendientes: number;
  revisadas: number;
  por_categoria: Record<string, number>;
}

// ---------------------------------------------------------------------------
// ENCUESTA
// ---------------------------------------------------------------------------
export interface EncuestaResponse {
  id: number;
  usuario_id: number;
  proyecto_id: number | null;
  facilidad_carga: number;
  relevancia_vulnerabilidades: number;
  tiempo_analisis_adecuado: "si" | "masomenos" | "no";
  claridad_explicaciones: number;
  aprendio_algo_nuevo: "si" | "no";
  comentario_aprendizaje: string | null;
  claridad_recomendaciones: number;
  intuitividad_dashboard: number;
  comentario_mejora: string | null;
  nps: number;
  creado_en: string;
}

export interface EncuestaListResponse {
  total: number;
  respuestas: EncuestaResponse[];
}

export interface MetricasEncuestaResponse {
  total_respuestas: number;
  promedio_facilidad_carga: number;
  promedio_relevancia_vulnerabilidades: number;
  promedio_claridad_explicaciones: number;
  promedio_claridad_recomendaciones: number;
  promedio_intuitividad_dashboard: number;
  promedio_nps: number; // 0-10
  porcentaje_aprendio_algo_nuevo: number; // 0-100
}

// ---------------------------------------------------------------------------
// ACTIVIDAD (tabla de usuarios + timeline)
// ---------------------------------------------------------------------------
export interface ResumenActividadUsuario {
  usuario_id: number;
  nombre_completo: string;
  correo: string;
  fecha_registro: string;
  ultimo_login: string | null;
  total_proyectos: number;
  total_analisis: number;
  dejo_opinion: boolean;
}

export interface ResumenActividadListResponse {
  total: number;
  usuarios: ResumenActividadUsuario[];
}

export type AccionEnum =
  | "registro"
  | "login"
  | "logout"
  | "proyecto_creado"
  | "proyecto_eliminado"
  | "proyecto_actualizado"
  | "archivo_subido"
  | "analisis_ejecutado"
  | "reporte_descargado"
  | "opinion_enviada"
  | "encuesta_respondida";

export interface TimelineEvento {
  accion: AccionEnum;
  detalle: string | null;
  proyecto_id: number | null;
  fecha: string;
}

export interface TimelineUsuarioResponse {
  usuario_id: number;
  eventos: TimelineEvento[];
}