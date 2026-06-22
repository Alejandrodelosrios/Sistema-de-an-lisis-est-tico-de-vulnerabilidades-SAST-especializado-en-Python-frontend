import { getAccessToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getHeaders() {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export interface Recommendation {
  id: number;
  titulo: string;
  explicacion_riesgo: string;
  codigo_corregido_ejemplo: string;
}

export interface Vulnerability {
  id: number;
  tipo_owasp: string;
  severidad: 'critica' | 'alta' | 'media' | 'baja';
  score_cvss: number;
  codigo_vulnerable: string;
  linea_codigo: number;
  fragmento_codigo: string | null;
  archivo_id: number;
  nombre_archivo: string | null;
  recomendaciones?: Recommendation[];
}

export interface Analysis {
  id: number;
  score_seguridad: number;
  fecha_ejecucion: string;
  proyecto_id: number;
  vulnerabilidades?: Vulnerability[];
}

export interface AnalysisListResponse {
  total: number;
  analisis: Analysis[];
}

export interface SeverityCount {
  critica: number;
  alta: number;
  media: number;
  baja: number;
  total: number;
}

export interface AnalysisHistoryItem {
  id: number;
  fecha_ejecucion: string;
  score_seguridad: number;
  vulnerabilidades_por_severidad: SeverityCount;
}

export interface AnalysisHistoryResponse {
  total: number;
  historial: AnalysisHistoryItem[];
}

export async function ejecutarAnalisis(proyectoId: number): Promise<Analysis> {
  const res = await fetch(`${API_URL}/proyectos/${proyectoId}/analisis/`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Error al ejecutar análisis');
  }
  return res.json();
}

export async function listarAnalisis(proyectoId: number): Promise<AnalysisListResponse> {
  const res = await fetch(`${API_URL}/proyectos/${proyectoId}/analisis`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Error al obtener análisis');
  return res.json();
}

export async function getAnalisis(proyectoId: number, analisisId: number): Promise<Analysis> {
  const res = await fetch(`${API_URL}/proyectos/${proyectoId}/analisis/${analisisId}/`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Error al obtener análisis');
  return res.json();
}

export async function getProjectHistory(proyectoId: number): Promise<AnalysisHistoryResponse> {
  const res = await fetch(`${API_URL}/proyectos/${proyectoId}/history/`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Error al obtener el historial del proyecto');
  return res.json();
}
