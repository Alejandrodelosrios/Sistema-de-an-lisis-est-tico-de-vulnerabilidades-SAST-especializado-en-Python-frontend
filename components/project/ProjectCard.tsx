import React from 'react';
import { Folder, ChevronRight } from 'lucide-react';

interface Project {
  name: string;
  language: string;
  date: string;
  issues: number;
}

export const ProjectCard = ({ project }: { project: Project }) => (
  <div className="group bg-slate-800/30 border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-900 rounded-xl border border-white/5">
        <Folder className="w-6 h-6 text-emerald-400" />
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${project.issues > 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
        {project.issues > 0 ? `${project.issues} Riesgos` : 'Seguro'}
      </span>
    </div>
    <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
    <p className="text-slate-500 text-xs font-mono mb-6">{project.language} • {project.date}</p>
    <button className="w-full py-2 bg-white/5 hover:bg-emerald-500 hover:text-slate-900 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2">
      Ver Reporte <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);