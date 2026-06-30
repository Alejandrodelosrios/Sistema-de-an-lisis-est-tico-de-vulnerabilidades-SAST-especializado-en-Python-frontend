"use client";

import React, { useState, useMemo, useEffect } from 'react';
import api from '@/lib/api';
import { ProjectCard } from './ProjectCard';
import { Plus, Search } from 'lucide-react';
import { getAccessToken, decodeToken } from '@/lib/auth';

export type OrigenProyecto = 'github' | 'carga_directa';

export interface Proyecto {
  id: number;
  nombre: string;
  origen: OrigenProyecto;
  url_github?: string;
  fecha_carga: string;
  usuario_id: number;
}

interface ProjectListProps {
  proyectos?: Proyecto[];
  onCreateProject: () => void;
  onEdit: (id: number) => void;
  onRefresh?: () => void;
}

export const ProjectList = ({ proyectos: initialProyectos = [], onCreateProject, onEdit, onRefresh }: ProjectListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [proyectos, setProyectos] = useState<Proyecto[]>(initialProyectos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Cargar proyectos desde la API
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo('');
        
        // Obtener usuario_id del token
        const token = getAccessToken();
        console.log('Token obtenido:', token ? 'Sí' : 'No');
        
        if (!token) {
          const msg = 'No autenticado - No se encontró token';
          setError(msg);
          setDebugInfo(msg);
          setProyectos([]);
          return;
        }
        
        const decoded = decodeToken(token);
        console.log('Token decodificado:', decoded);
        
        if (!decoded) {
          const msg = 'No se pudo decodificar el token';
          setError(msg);
          setDebugInfo(msg);
          return;
        }
        
        const usuarioId = Number(decoded?.sub);
        console.log('Usuario ID extraído:', usuarioId, 'Tipo:', typeof usuarioId);
        setDebugInfo(`Usuario ID: ${usuarioId}`);
        
        if (!usuarioId || isNaN(usuarioId)) {
          const msg = 'Usuario ID inválido o no encontrado en token';
          setError(msg);
          setDebugInfo(msg);
          return;
        }
        
        const response = await api.get('/proyectos/');
        console.log('Respuesta de API completa:', response.data);
        
        // Extraer array de proyectos
        const proyectosData = response.data?.proyectos;
        console.log('Proyectos recibidos:', proyectosData);
        
        if (!Array.isArray(proyectosData)) {
          const msg = `Proyectos no es un array. Tipo: ${typeof proyectosData}`;
          console.warn(msg);
          setError(msg);
          setProyectos([]);
          return;
        }
        
        // Filtrar por usuario_id
        const proyectosFiltrados = proyectosData.filter((p: any) => {
          console.log(`Comparando: p.usuario_id (${p.usuario_id}, tipo: ${typeof p.usuario_id}) === usuarioId (${usuarioId}, tipo: ${typeof usuarioId})`);
          return Number(p.usuario_id) === usuarioId;
        });
        
        console.log('Proyectos filtrados:', proyectosFiltrados);
        setDebugInfo(`Total: ${proyectosData.length}, Filtrados: ${proyectosFiltrados.length}`);
        setProyectos(proyectosFiltrados);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Error al cargar los proyectos';
        console.error('Error:', err);
        setError(errorMsg);
        setDebugInfo(errorMsg);
        setProyectos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  // Manejar eliminación desde ProjectCard
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/proyectos/${id}`);
      setProyectos(proyectos.filter(p => p.id !== id));
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error al eliminar proyecto:', err);
      alert('No se pudo eliminar el proyecto');
    }
  };

  const proyectosFiltrados = useMemo(() => {
    return proyectos.filter(proyecto =>
      proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [proyectos, searchTerm]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mis Proyectos</h1>
          <p className="text-slate-400">Gestiona y analiza la seguridad de tus proyectos de Python.</p>
        </div>
        <button 
          onClick={onCreateProject}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" /> Nuevo Proyecto
        </button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar proyecto por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="col-span-full text-center py-12">
          <p className="text-slate-400">Cargando proyectos...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="col-span-full mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectosFiltrados.length > 0 ? (
          proyectosFiltrados.map((proj) => (
            <ProjectCard 
              key={proj.id} 
              proyecto={proj}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400">
              {searchTerm ? 'No se encontraron proyectos con ese nombre.' : 'No tienes proyectos aún.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
