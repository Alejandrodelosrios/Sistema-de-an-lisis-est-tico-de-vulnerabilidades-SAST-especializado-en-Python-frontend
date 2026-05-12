import React from 'react';
import { ProjectCard } from './ProjectCard';
import { Plus } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  language: string;
  date: string;
  issues: number;
}

interface ProjectListProps {
  projects: Project[];
  onCreateProject: () => void;
}

export const ProjectList = ({ projects, onCreateProject }: ProjectListProps) => (
  <div className="animate-in fade-in duration-500">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mis Proyectos</h1>
        <p className="text-slate-400">Gestiona y analiza la seguridad de tus desarrollos en Python.</p>
      </div>
      <button 
        onClick={onCreateProject}
        className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
      >
        <Plus className="w-5 h-5" /> Nuevo Proyecto
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((proj) => (
        <ProjectCard key={proj.id} project={proj} />
      ))}
    </div>
  </div>
);
