import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Shield, ArrowLeft, Loader, Upload, X } from 'lucide-react';
import api from '@/lib/api';

interface ProjectFormProps {
  onCancel?: () => void;
  onSuccess?: (nuevoProyecto?: any) => void;
  projectId?: number | null;
  initialData?: {
    nombre: string;
    origen: 'github' | 'carga_directa';
    url_github?: string;
  };
}

export const ProjectForm = ({ onCancel, onSuccess, projectId, initialData }: ProjectFormProps) => {
  const [origen, setOrigen] = useState<'github' | 'carga_directa'>(initialData?.origen || 'github');
  const [nombre, setNombre] = useState(initialData?.nombre || '');
  const [urlGithub, setUrlGithub] = useState(initialData?.url_github || '');
  const [archivos, setArchivos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!projectId;

  useEffect(() => {
    if (isEditing && projectId) {
      const fetchProyecto = async () => {
        try {
          const response = await api.get(`/proyectos/${projectId}/`);
          const proyecto = response.data;
          
          setNombre(proyecto.nombre);
          setOrigen(proyecto.origen);
          if (proyecto.url_github) {
            setUrlGithub(proyecto.url_github);
          }
        } catch (err) {
          console.error('Error al cargar el proyecto:', err);
          setError('No se pudo cargar los datos del proyecto');
        }
      };
      
      fetchProyecto();
    }
  }, [isEditing, projectId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validar que sean archivos .py
    const pythonFiles = selectedFiles.filter(file => file.name.endsWith('.py'));
    
    if (pythonFiles.length !== selectedFiles.length) {
      setError('Solo se permiten archivos .py');
      return;
    }
    
    setArchivos(pythonFiles);
    setError(null);
  };

  const removeArchivo = (index: number) => {
    setArchivos(archivos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación
    if (!nombre.trim()) {
      setError('El nombre del proyecto es requerido');
      return;
    }

    if (origen === 'github' && !urlGithub.trim()) {
      setError('La URL de GitHub es requerida');
      return;
    }

    if (origen === 'carga_directa' && archivos.length === 0 && !isEditing) {
      setError('Debes seleccionar al menos un archivo .py');
      return;
    }

    setLoading(true);

    try {
      // Construir payload JSON
      const payload: any = {
        nombre: nombre.trim(),
        origen: origen,
      };

      // Solo agregar url_github si es github
      if (origen === 'github') {
        payload.url_github = urlGithub.trim();
      }

      console.log('Enviando payload:', payload);

      let respuesta: any;
      if (isEditing) {
        // PUT para actualizar
        respuesta = await api.put(`/proyectos/${projectId}/`, payload);
      } else {
        // POST para crear
        respuesta = await api.post('/proyectos/', payload);
      }

      console.log('Respuesta del servidor:', respuesta.data);

      if (onSuccess) onSuccess(respuesta.data);
      if (onCancel) onCancel();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al procesar el proyecto';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </h2>
        <p className="text-slate-400 text-sm text-center mb-10">
          {isEditing ? 'Actualiza los detalles de tu proyecto.' : 'Crea un nuevo proyecto para analizar.'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex gap-3">
            <svg className="w-5 h-5 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {/* Nombre del Proyecto */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
                Nombre del Proyecto
              </label>
              <input 
                type="text" 
                placeholder="Ej. MiApiSegura" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors text-white placeholder-slate-500"
              />
            </div>

            {/* Origen del Proyecto */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
                Origen del Proyecto
              </label>
              <select 
                value={origen}
                onChange={(e) => setOrigen(e.target.value as 'github' | 'carga_directa')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-5 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors text-white"
              >
                <option value="github">GitHub</option>
                <option value="carga_directa">Carga Directa</option>
              </select>
            </div>

            {/* Carga de Archivos - Solo si es Carga Directa */}
            {origen === 'carga_directa' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
                  Archivos Python (.py)
                </label>
                <div className="border-2 border-dashed border-white/10 hover:border-emerald-500/30 rounded-xl p-8 text-center transition-colors cursor-pointer relative group">
                  <input 
                    type="file"
                    multiple
                    accept=".py"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="pointer-events-none">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    <p className="text-sm text-slate-300 mb-1">Arrastra archivos aquí o haz clic</p>
                    <p className="text-xs text-slate-500">Solo se aceptan archivos .py</p>
                  </div>
                </div>

                {/* Lista de Archivos Seleccionados */}
                {archivos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400 font-semibold">{archivos.length} archivo(s) seleccionado(s):</p>
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Confirmado ✓</span>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {archivos.map((archivo, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between bg-slate-900/50 border border-emerald-500/20 rounded-lg px-4 py-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Upload className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="text-sm text-slate-300 truncate">{archivo.name}</span>
                            <span className="text-xs text-slate-500 shrink-0">({(archivo.size / 1024).toFixed(2)} KB)</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeArchivo(index)}
                            className="text-red-400 hover:text-red-300 transition-colors shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nota informativa */}
                <div className="mt-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-3">
                  <svg className="w-5 h-5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Los archivos seleccionados serán validados. El análisis se procesará cuando se complete la configuración.
                  </p>
                </div>
              </div>
            )}

            {/* URL de GitHub - Solo si es GitHub */}
            {origen === 'github' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
                  URL del Repositorio
                </label>
                <div className="relative">
                  <LinkIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="https://github.com/usuario/mi-proyecto-python" 
                    value={urlGithub}
                    onChange={(e) => setUrlGithub(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-5 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors text-white placeholder-slate-500"
                  />
                </div>
                <div className="mt-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-3">
                  <svg className="w-5 h-5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Clonaremos el repositorio para realizar el análisis estático.
                  </p>
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                {isEditing ? 'Actualizar Proyecto' : 'Crear Proyecto'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};