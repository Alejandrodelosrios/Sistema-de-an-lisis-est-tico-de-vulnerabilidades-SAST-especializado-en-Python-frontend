import React, { useState } from 'react';
import { FileCode, Upload, Link as LinkIcon, Shield, ArrowLeft } from 'lucide-react';

interface ProjectFormProps {
  onCancel?: () => void;
}

export const ProjectForm = ({ onCancel }: ProjectFormProps) => {
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');

  return (
    <div className="max-w-3xl mx-auto animate-in zoom-in-95 duration-300">
      {onCancel && (
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Cancelar
        </button>
      )}

      <div className="bg-slate-800/30 border border-white/5 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Nuevo Análisis</h2>
        <p className="text-slate-400 text-sm text-center mb-10">Selecciona el origen de tu código para comenzar el escaneo.</p>

        <div className="space-y-8">
          {/* Tipo de Upload */}
          <div className="flex p-1 bg-slate-900 rounded-2xl border border-white/5">
            <button 
              onClick={() => setUploadType('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${uploadType === 'file' ? 'bg-emerald-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              <FileCode className="w-4 h-4" /> Subir Archivos
            </button>
            <button 
              onClick={() => setUploadType('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${uploadType === 'url' ? 'bg-emerald-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              <LinkIcon className="w-4 h-4" /> GitHub
            </button>
          </div>

          <div className="space-y-6">
            {/* Nombre del Proyecto */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
                Nombre del Proyecto
              </label>
              <input 
                type="text" 
                placeholder="Ej. MiApiSegura" 
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors text-white"
              />
            </div>

            {/* Input Condicional */}
            {uploadType === 'file' ? (
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-emerald-500/30 transition-all cursor-pointer group bg-slate-900/40">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-white font-bold mb-1">Arrastra tus archivos .py aquí</p>
                <p className="text-slate-500 text-sm">O haz clic para explorar en tu equipo (Máx 5MB)</p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
                  URL del Repositorio
                </label>
                <div className="relative">
                  <LinkIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="https://github.com/usuario/mi-proyecto-python" 
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-5 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors text-white"
                  />
                </div>
                <div className="mt-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-3">
                  <svg className="w-5 h-5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Clonaremos el repositorio para realizar el análisis estático. Asegúrate de que el repositorio sea público o esté accesible.
                  </p>
                </div>
              </div>
            )}
          </div>

          <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2">
            <Shield className="w-5 h-5" /> Comenzar Análisis Seguro
          </button>
        </div>
      </div>
    </div>
  );
};