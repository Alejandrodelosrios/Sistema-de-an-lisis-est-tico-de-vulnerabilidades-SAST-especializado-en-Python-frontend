'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProjectHistory, AnalysisHistoryResponse } from '@/services/analysisService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function HistoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const proyectoId = Number(id);

  const [historial, setHistorial] = useState<AnalysisHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarHistorial();
  }, [proyectoId]);

  async function cargarHistorial() {
    try {
      const data = await getProjectHistory(proyectoId);
      setHistorial(data);
    } catch (e: any) {
      setError(e.message || 'Error al obtener el historial');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-sm">Cargando historial...</p>
      </div>
    );
  }

  if (!historial) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-sm">Error al cargar el historial</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  // Si no hay análisis
  if (historial.total === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-sm">
          Aún no hay análisis registrados para este proyecto.
        </p>
      </div>
    );
  }

  // Si hay solo 1 análisis
  if (historial.total === 1) {
    const item = historial.historial[0];
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <button
          onClick={() => router.push(`/project/${proyectoId}`)}
          className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1">
          ← Volver al proyecto
        </button>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <p className="text-sm font-medium text-slate-200">Análisis #{item.id}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(item.fecha_ejecucion).toLocaleString('es-ES')}
          </p>
          <p className="text-3xl font-bold text-blue-400 mt-4">{item.score_seguridad}/100</p>
        </div>
        <p className="text-center text-gray-400 text-sm">
          Se necesitan al menos 2 análisis para mostrar una tendencia.
        </p>
      </div>
    );
  }

  // Si hay 2 o más análisis
  const reversedHistorial = [...historial.historial].reverse();

  const chartData = reversedHistorial.map((item) => ({
    fecha_ejecucion: new Date(item.fecha_ejecucion).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    }),
    score_seguridad: item.score_seguridad,
  }));

  function severityBgColor(severity: string) {
    switch (severity) {
      case 'critica':
        return 'bg-red-100 text-red-700';
      case 'alta':
        return 'bg-orange-100 text-orange-700';
      case 'media':
        return 'bg-yellow-100 text-yellow-700';
      case 'baja':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Botón volver */}
      <button
        onClick={() => router.push(`/project/${proyectoId}`)}
        className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1">
        ← Volver al proyecto
      </button>

      {/* Título */}
      <h1 className="text-2xl font-bold text-white">Evolución de Seguridad</h1>

      {/* Gráfico */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="fecha_ejecucion"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Line
              type="monotone"
              dataKey="score_seguridad"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Lista de análisis */}
      <div className="space-y-4">
        {historial.historial.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-700 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-200">Análisis #{item.id}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.fecha_ejecucion).toLocaleString('es-ES')}
                </p>
              </div>
              <p className="text-3xl font-bold text-blue-400">{item.score_seguridad}/100</p>
            </div>

            {/* Badges de severidad */}
            <div className="flex gap-2 mt-4 flex-wrap">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${severityBgColor(
                  'critica'
                )}`}>
                Crítica: {item.vulnerabilidades_por_severidad.critica}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${severityBgColor(
                  'alta'
                )}`}>
                Alta: {item.vulnerabilidades_por_severidad.alta}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${severityBgColor(
                  'media'
                )}`}>
                Media: {item.vulnerabilidades_por_severidad.media}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${severityBgColor(
                  'baja'
                )}`}>
                Baja: {item.vulnerabilidades_por_severidad.baja}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
