'use client';

import { useEffect, useState, type ReactElement } from 'react';
import { X, Clock, Activity, FileCode, LogIn, LogOut, UserPlus, FolderPlus, Trash2, Pencil, Download, MessageSquare, ClipboardList } from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { AccionEnum, TimelineEvento } from '@/lib/types/admin';

interface UserTimelinePanelProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioId: number | null;
}

const ACCION_LABEL: Record<AccionEnum, string> = {
  registro: 'Registro',
  login: 'Inicio de sesión',
  logout: 'Cierre de sesión',
  proyecto_creado: 'Proyecto creado',
  proyecto_eliminado: 'Proyecto eliminado',
  proyecto_actualizado: 'Proyecto actualizado',
  archivo_subido: 'Archivo subido',
  analisis_ejecutado: 'Análisis ejecutado',
  reporte_descargado: 'Reporte descargado',
  opinion_enviada: 'Opinión enviada',
  encuesta_respondida: 'Encuesta respondida',
};

const ACCION_ICONO: Record<AccionEnum, ReactElement> = {
  registro: <UserPlus className="w-4 h-4 text-violet-400" />,
  login: <LogIn className="w-4 h-4 text-emerald-400" />,
  logout: <LogOut className="w-4 h-4 text-slate-400" />,
  proyecto_creado: <FolderPlus className="w-4 h-4 text-blue-400" />,
  proyecto_eliminado: <Trash2 className="w-4 h-4 text-red-400" />,
  proyecto_actualizado: <Pencil className="w-4 h-4 text-blue-400" />,
  archivo_subido: <FileCode className="w-4 h-4 text-blue-400" />,
  analisis_ejecutado: <Activity className="w-4 h-4 text-emerald-400" />,
  reporte_descargado: <Download className="w-4 h-4 text-amber-400" />,
  opinion_enviada: <MessageSquare className="w-4 h-4 text-pink-400" />,
  encuesta_respondida: <ClipboardList className="w-4 h-4 text-cyan-400" />,
};

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const UserTimelinePanel = ({ isOpen, onClose, usuarioId }: UserTimelinePanelProps) => {
  const [timeline, setTimeline] = useState<TimelineEvento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos cuando el panel se abre y hay un usuario seleccionado
  useEffect(() => {
    if (isOpen && usuarioId) {
      cargarTimeline(usuarioId);
    }
  }, [isOpen, usuarioId]);

  const cargarTimeline = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getTimelineUsuario(id);
      setTimeline(data.eventos);
    } catch (err) {
      console.error("Error cargando timeline", err);
      setError("No se pudo cargar la bitácora de este usuario.");
      setTimeline([]);
    } finally {
      setLoading(false);
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
          ) : error ? (
            <div className="flex justify-center items-center h-32 text-red-400 text-sm text-center px-4">
              {error}
            </div>
          ) : timeline.length === 0 ? (
            <div className="flex justify-center items-center h-32 text-slate-500 text-sm">
              Este usuario todavía no tiene actividad registrada.
            </div>
          ) : (
            <div className="relative border-l border-slate-700 ml-3 space-y-6">
              {timeline.map((evento, i) => (
                <div key={i} className="relative pl-6">
                  {/* Punto en la línea de tiempo */}
                  <span className="absolute -left-2.25 top-1 bg-slate-900 border border-slate-700 p-1 rounded-full">
                    {ACCION_ICONO[evento.accion] ?? <Clock className="w-4 h-4 text-slate-400" />}
                  </span>
                  
                  {/* Información del evento */}
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                    <p className="text-sm font-semibold text-slate-200">
                      {ACCION_LABEL[evento.accion] ?? evento.accion}
                    </p>
                    {evento.detalle && (
                      <p className="text-xs text-slate-400 mt-1">{evento.detalle}</p>
                    )}
                    <p className="text-[10px] text-slate-500 font-mono mt-2">
                      {formatearFecha(evento.fecha)}
                    </p>
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

export default UserTimelinePanel;