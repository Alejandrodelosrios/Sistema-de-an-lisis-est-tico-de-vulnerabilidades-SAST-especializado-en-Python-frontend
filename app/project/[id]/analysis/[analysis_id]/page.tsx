'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAnalisis, listarAnalisis, Analysis, Vulnerability } from '@/services/analysisService';

const SEVERIDAD_CONFIG = {
  critica: { label: 'Crítica', badge: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  alta:    { label: 'Alta',    badge: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  media:   { label: 'Media',   badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  baja:    { label: 'Baja',    badge: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
} as const;

export default function ResultadoAnalisisPage() {
  const { id, analysis_id } = useParams();
  const router = useRouter();
  const proyectoId = Number(id);
  const analisisId = Number(analysis_id);

  const [analisis, setAnalisis] = useState<Analysis | null>(null);
  const [expandida, setExpandida] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<string>('todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalisis(proyectoId, analisisId)
      .then(setAnalisis)
      .catch(() => router.push(`/project/${proyectoId}`))
      .finally(() => setLoading(false));
  }, [proyectoId, analisisId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400 text-sm">Cargando resultados...</p>
    </div>
  );

  if (!analisis) return null;

  const vulns = analisis.vulnerabilidades || [];
  const conteos = {
    critica: vulns.filter(v => v.severidad === 'critica').length,
    alta:    vulns.filter(v => v.severidad === 'alta').length,
    media:   vulns.filter(v => v.severidad === 'media').length,
    baja:    vulns.filter(v => v.severidad === 'baja').length,
  };
  const vulnsFiltradas = filtro === 'todas' ? vulns : vulns.filter(v => v.severidad === filtro);

  function scoreColor(score: number) {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-500';
    if (score >= 25) return 'text-orange-500';
    return 'text-red-600';
  }

  function scoreLabel(score: number) {
    if (score >= 75) return { text: 'Seguro', cls: 'bg-green-100 text-green-700' };
    if (score >= 50) return { text: 'Moderado', cls: 'bg-yellow-100 text-yellow-700' };
    if (score >= 25) return { text: 'Vulnerable', cls: 'bg-orange-100 text-orange-700' };
    return { text: 'Crítico', cls: 'bg-red-100 text-red-700' };
  }

  const label = scoreLabel(analisis.score_seguridad);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* Encabezado */}
      <div>
        <button
          onClick={() => router.push(`/project/${proyectoId}`)}
          className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
          ← Volver al proyecto
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Resultado del análisis</h1>
            <p className="text-sm text-gray-400 mt-1">
              {new Date(analisis.fecha_ejecucion).toLocaleString('es-ES', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>

          {/* Score */}
          <div className="text-center shrink-0">
            <p className={`text-5xl font-black leading-none ${scoreColor(analisis.score_seguridad)}`}>
              {analisis.score_seguridad}
            </p>
            <p className="text-xs text-gray-400 mt-1">de 100</p>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full mt-2 inline-block ${label.cls}`}>
              {label.text}
            </span>
          </div>
        </div>
      </div>

      {/* Cards severidad — clickeables para filtrar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['critica', 'alta', 'media', 'baja'] as const).map(sev => (
          <button
            key={sev}
            onClick={() => setFiltro(filtro === sev ? 'todas' : sev)}
            className={`border rounded-xl p-4 text-left transition-all ${
              filtro === sev
                ? SEVERIDAD_CONFIG[sev].badge + ' ring-2 ring-offset-2 ring-current'
                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
            }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${SEVERIDAD_CONFIG[sev].dot}`} />
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {SEVERIDAD_CONFIG[sev].label}
              </p>
            </div>
            <p className="text-2xl font-bold text-white">{conteos[sev]}</p>
          </button>
        ))}
      </div>

      {/* Vulnerabilidades */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-200">
            Vulnerabilidades detectadas
            {filtro !== 'todas' && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                — {SEVERIDAD_CONFIG[filtro as keyof typeof SEVERIDAD_CONFIG]?.label}
                <button
                  onClick={() => setFiltro('todas')}
                  className="ml-1 text-blue-500 hover:underline text-xs">
                  limpiar filtro
                </button>
              </span>
            )}
          </h2>
          <span className="text-sm text-gray-400">{vulnsFiltradas.length} hallazgos</span>
        </div>

        {vulnsFiltradas.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-10 text-center">
            <p className="text-green-700 font-medium text-sm">
              {vulns.length === 0
                ? '✅ No se detectaron vulnerabilidades en este análisis'
                : '✅ No hay vulnerabilidades con esta severidad'}
            </p>
          </div>
        ) : (
          vulnsFiltradas.map(vuln => {
            const cfg = SEVERIDAD_CONFIG[vuln.severidad];
            const abierta = expandida === vuln.id;
            return (
              <div key={vuln.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">

                {/* Cabecera */}
                <button
                  className="w-full flex items-start justify-between px-6 py-4 hover:bg-slate-700 text-left transition-colors"
                  onClick={() => setExpandida(abierta ? null : vuln.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-gray-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded">
                        CVSS {vuln.score_cvss}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-200">{vuln.tipo_owasp}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      📄 {vuln.nombre_archivo || `Archivo #${vuln.archivo_id}`}
                      {' · '}línea {vuln.linea_codigo}
                    </p>
                  </div>
                  <span className="text-gray-400 ml-4 mt-1 text-xs">
                    {abierta ? '▲ cerrar' : '▼ ver detalle'}
                  </span>
                </button>

                {/* Detalle expandible */}
                {abierta && (
                  <div className="border-t border-slate-700 px-6 py-5 space-y-4 bg-slate-900">

                    {/* Código vulnerable */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Código vulnerable
                      </p>
                      <pre className="bg-red-950 border border-red-900 rounded-lg px-4 py-3 text-sm font-mono text-red-400 overflow-x-auto">
                        {vuln.codigo_vulnerable}
                      </pre>
                    </div>

                    {/* Fragmento contexto */}
                    {vuln.fragmento_codigo && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                          Contexto — línea {vuln.linea_codigo}
                        </p>
                        <pre className="bg-gray-900 text-green-400 rounded-lg px-4 py-3 text-xs font-mono overflow-x-auto">
                          {vuln.fragmento_codigo}
                        </pre>
                      </div>
                    )}

                    {/* Retroalimentación pedagógica */}
                    {vuln.recomendaciones && vuln.recomendaciones.length > 0 ? (
                      <div className="space-y-4">
                        <div className="bg-blue-950 border border-blue-900 rounded-lg px-4 py-3">
                          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1">
                            💡 {vuln.recomendaciones[0].titulo}
                          </p>
                          <p className="text-sm text-blue-200 leading-relaxed">
                            {vuln.recomendaciones[0].explicacion_riesgo}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            ✅ Código corregido sugerido
                          </p>
                          <pre className="bg-green-950 border border-green-900 rounded-lg px-4 py-3 text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">
                            {vuln.recomendaciones[0].codigo_corregido_ejemplo}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-950 border border-blue-900 rounded-lg px-4 py-3">
                        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1">
                          💡 Retroalimentación pedagógica
                        </p>
                        <p className="text-sm text-blue-300 italic">
                          No hay recomendación disponible para esta vulnerabilidad.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
