'use client';

import { useEffect, useState } from 'react';
import { X, Clock, Activity, FileCode } from 'lucide-react';
// import { adminService } from '@/services/adminService';

interface UserTimelinePanelProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioId: number | null;
}

export const UserTimelinePanel = ({ isOpen, onClose, usuarioId }: UserTimelinePanelProps) => {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar datos cuando el panel se abre y hay un usuario seleccionado
  useEffect(() => {
    if (isOpen && usuarioId) {
      cargarTimeline();
    }
  }, [isOpen, usuarioId]);

  const cargarTimeline = async () => {
    setLoading(true);
    try {
      // Reemplaza esto con tu llamada real:
      // const data = await adminService.getTimelineUsuario(usuarioId);
      // setTimeline(data);
      
      // Datos simulados para que veas el diseño:
      setTimeout(() => {
        setTimeline([
          { id: 1, accion: 'Análisis Ejecutado', detalle: 'Proyecto "Frontend React"', fecha: 'Hace 2 horas', tipo: 'analisis' },
          { id: 2, accion: 'Archivo Subido', detalle: 'main.py (15KB)', fecha: 'Hace 3 horas', tipo: 'archivo' },
          { id: 3, accion: 'Inicio de Sesión', detalle: 'IP: 192.168.1.1', fecha: 'Hace 1 día', tipo: 'sistema' },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error cargando timeline", error);
      setLoading(false);
    }
  };

  // Icono dinámico según el tipo de acción
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'analisis': return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'archivo': return <FileCode className="w-4 h-4 text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <>
      {/* Overlay oscuro (Fondo borroso que cubre la tabla) */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel Lateral que se desliza desde la derecha */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Encabezado del Panel */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Timeline del Usuario</h2>
            <p className="text-xs text-slate-400 font-mono mt-1">ID Usuario: #{usuarioId}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido / Historial (Con Scroll) */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-32 text-slate-400 text-sm">
              Cargando actividad...
            </div>
          ) : (
            <div className="relative border-l border-slate-700 ml-3 space-y-6">
              {timeline.map((evento) => (
                <div key={evento.id} className="relative pl-6">
                  {/* Punto en la línea de tiempo */}
                  <span className="absolute -left-2.25 top-1 bg-slate-900 border border-slate-700 p-1 rounded-full">
                    {getIcon(evento.tipo)}
                  </span>
                  
                  {/* Información del evento */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                    <p className="text-sm font-semibold text-slate-200">{evento.accion}</p>
                    <p className="text-xs text-slate-400 mt-1">{evento.detalle}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-2">{evento.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};