"use client";

import React, { useState } from 'react';
import { 
  Folder, 
  Upload, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Calendar,
  MoreVertical,
  AlertCircle 
} from 'lucide-react';

// SVG de GitHub Manual para evitar errores de librería
const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Tipos basados en tu modelo project.py
export type OrigenProyecto = 'github' | 'carga_directa';

export interface Proyecto {
  id: number;
  nombre: string;
  origen: OrigenProyecto;
  url_github?: string;
  fecha_carga: string;
}

interface ProjectCardProps {
  proyecto: Proyecto;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

// Modal de Confirmación
const DeleteConfirmationModal = ({ 
  isOpen, 
  proyectoNombre, 
  onConfirm, 
  onCancel,
  isLoading 
}: { 
  isOpen: boolean;
  proyectoNombre: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Eliminar Proyecto</h3>
        </div>
        
        <p className="text-slate-300 mb-6">
          ¿Estás seguro de que deseas eliminar el proyecto <span className="font-bold text-white">"{proyectoNombre}"</span>? Esta acción no se puede deshacer.
        </p>

        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProjectCard = ({ proyecto, onEdit, onDelete }: ProjectCardProps) => {
  const isGithub = proyecto.origen === 'github';
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    try {
      await onDelete(proyecto.id);
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error al eliminar:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group bg-slate-800/30 border border-white/5 hover:border-emerald-500/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5">
      <div className="flex justify-between items-start mb-4">
        {/* Badge de Origen */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          isGithub ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
        }`}>
          {isGithub ? <GithubIcon className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
          {proyecto.origen.replace('_', ' ')}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
          {proyecto.nombre}
        </h3>
        <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(proyecto.fecha_carga).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Detalles específicos del origen */}
      <div className="bg-slate-900/50 rounded-xl p-3 mb-6 border border-white/5">
        {isGithub ? (
          <a 
            href={proyecto.url_github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
          >
            <span className="truncate mr-2">{proyecto.url_github}</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Folder className="w-3 h-3" />
            <span>Archivos locales analizados</span>
          </div>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        <button 
          onClick={() => onEdit(proyecto.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white text-xs font-semibold transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" /> Editar
        </button>
        <button 
          onClick={() => setShowDeleteModal(true)}
          className="px-3 py-2 bg-red-500/5 hover:bg-red-500/20 rounded-lg text-red-400 transition-all border border-red-500/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <DeleteConfirmationModal 
        isOpen={showDeleteModal}
        proyectoNombre={proyecto.nombre}
        onConfirm={handleDeleteClick}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};