import { getAccessToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getHeaders() {
  const token = getAccessToken();
  return { Authorization: `Bearer ${token}` };
}

export interface Archivo {
  id: number;
  nombre: string;
  estado: boolean;
  ruta_almacenamiento: string;
  tamaño_bytes: number;
  fecha_carga: string;
  proyecto_id: number;
}

export async function listarArchivos(proyectoId: number): Promise<{ total: number; archivos: Archivo[] }> {
  const res = await fetch(`${API_URL}/proyectos/${proyectoId}/archivos`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Error al obtener archivos');
  return res.json();
}

export async function eliminarArchivo(proyectoId: number, archivoId: number): Promise<void> {
  const res = await fetch(`${API_URL}/proyectos/${proyectoId}/archivos/${archivoId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar archivo');
}
