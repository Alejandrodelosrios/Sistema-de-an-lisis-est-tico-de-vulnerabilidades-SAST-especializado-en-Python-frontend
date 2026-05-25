'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Archivo,listarArchivos,eliminarArchivo  } from '@/services/fileService';
import { Analysis, ejecutarAnalisis, listarAnalisis } from '@/services/analysisService';

interface Proyecto {
  id: number;
  nombre: string;
  origen: 'github' | 'carga_directa';
  url_github: string | null;
  fecha_carga: string;
}

export default function DetalleProyectoPage() {
  const { id } = useParams();
  const router = useRouter();
  const proyectoId = Number(id);

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [analisis, setAnalisis] = useState<Analysis[]>([]);
  const [ejecutando, setEjecutando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [proyectoId]);

  async function cargarDatos() {
    try {
      const [resProyecto, resArchivos, resAnalisis] = await Promise.all([
        api.get(`/proyectos/${proyectoId}`),
        listarArchivos(proyectoId),
        listarAnalisis(proyectoId),
      ]);
      setProyecto(resProyecto.data);
      setArchivos(resArchivos.archivos);
      setAnalisis(resAnalisis.analisis);
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleEjecutarAnalisis() {
    setEjecutando(true);
    setError(null);
    try {
      const resultado = await ejecutarAnalisis(proyectoId);
      router.push(`/project/${proyectoId}/analysis/${resultado.id}`);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Error al ejecutar el análisis');
      setEjecutando(false);
    }
  }

  async function handleEliminarArchivo(archivoId: number) {
    try {
      await eliminarArchivo(proyectoId, archivoId);
      setArchivos(prev => prev.filter(a => a.id !== archivoId));
    } catch {
      setError('Error al eliminar el archivo');
    }
  }

  function scoreColor(score: number) {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-500';
    if (score >= 25) return 'text-orange-500';
    return 'text-red-600';
  }

  function scoreBg(score: number) {
    if (score >= 75) return 'bg-green-50 border-green-200';
    if (score >= 50) return 'bg-yellow-50 border-yellow-200';
    if (score >= 25) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400 text-sm">Cargando proyecto...</p>
    </div>
  );

  if (!proyecto) return null;

  const ultimoAnalisis = analisis[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* Encabezado */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1">
            ← Volver
          </button>
          <h1 className="text-2xl font-bold text-white">{proyecto.nombre}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              proyecto.origen === 'github'
                ? 'bg-gray-900 text-white'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {proyecto.origen === 'github' ? '⌥ GitHub' : '📁 Carga directa'}
            </span>
            <span className="text-sm text-gray-400">
              {new Date(proyecto.fecha_carga).toLocaleDateString('es-ES', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
          {proyecto.url_github && (
            <a
              href={proyecto.url_github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline mt-1 block truncate max-w-sm">
              {proyecto.url_github}
            </a>
          )}
        </div>
        <button
          onClick={() => router.push(`/dashboard?edit=${proyectoId}`)}
          className="shrink-0 text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">
          Editar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Archivos</p>
          <p className="text-2xl font-bold text-white mt-1">{archivos.length}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Análisis</p>
          <p className="text-2xl font-bold text-white mt-1">{analisis.length}</p>
        </div>
        <div className={`border rounded-xl p-4 ${ultimoAnalisis ? scoreBg(ultimoAnalisis.score_seguridad) : 'bg-slate-800 border-slate-700'}`}>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Último score</p>
          <p className={`text-2xl font-bold mt-1 ${ultimoAnalisis ? scoreColor(ultimoAnalisis.score_seguridad) : 'text-gray-300'}`}>
            {ultimoAnalisis ? `${ultimoAnalisis.score_seguridad}/100` : '—'}
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Último análisis</p>
          <p className="text-sm font-medium text-slate-200 mt-1">
            {ultimoAnalisis
              ? new Date(ultimoAnalisis.fecha_ejecucion).toLocaleDateString('es-ES')
              : '—'}
          </p>
        </div>
      </div>

      {/* Archivos */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="font-semibold text-slate-200">Archivos</h2>
          <span className="text-sm text-gray-400">{archivos.length} archivo{archivos.length !== 1 ? 's' : ''}</span>
        </div>
        {archivos.length === 0 ? (
          <p className="px-6 py-5 text-sm text-gray-400">No hay archivos en este proyecto.</p>
        ) : (
          <ul className="divide-y divide-slate-700">
            {archivos.map(archivo => (
              <li key={archivo.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-200">{archivo.nombre}</p>
                  <p className="text-xs text-gray-400">
                    {archivo.tamaño_bytes
                      ? `${(archivo.tamaño_bytes / 1024).toFixed(1)} KB`
                      : 'Tamaño desconocido'}
                  </p>
                </div>
                {proyecto.origen === 'carga_directa' && (
                  <button
                    onClick={() => handleEliminarArchivo(archivo.id)}
                    className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-2.5 py-1 rounded transition-colors">
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botón ejecutar análisis */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleEjecutarAnalisis}
          disabled={ejecutando || archivos.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold px-10 py-3 rounded-xl text-sm transition-colors shadow-sm">
          {ejecutando ? '⏳ Analizando...' : '🔍 Ejecutar análisis de seguridad'}
        </button>
        {archivos.length === 0 && (
          <p className="text-xs text-gray-400">Agrega archivos al proyecto para poder analizarlo</p>
        )}
      </div>

      {/* Historial de análisis */}
      {analisis.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="font-semibold text-slate-200">Historial de análisis</h2>
          </div>
          <ul className="divide-y divide-slate-700">
            {analisis.map((a, index) => (
              <li
                key={a.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-700 cursor-pointer transition-colors"
                onClick={() => router.push(`/project/${proyectoId}/analysis/${a.id}`)}>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Análisis #{analisis.length - index}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.fecha_ejecucion).toLocaleString('es-ES')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${scoreColor(a.score_seguridad)}`}>
                    {a.score_seguridad}/100
                  </span>
                  <span className="text-gray-300 text-sm">→</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
