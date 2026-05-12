"use client"

import { useState } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { ProjectList } from '@/components/project/ProjectList';
import { ProjectForm } from '@/components/project/ProjectForm';
import { UserProfile } from '@/components/auth/UserProfile';

interface Project {
  id: number;
  name: string;
  language: string;
  date: string;
  issues: number;
}

export default function DashboardPage() {
  const [view, setView] = useState<'dashboard' | 'profile' | 'create-project'>('dashboard');

  // Datos simulados de proyectos (los datos del usuario ahora se obtienen desde la API en UserProfile)
  const myProjects: Project[] = [
    { id: 1, name: "Sistema_Ventas_API", language: "Python 3.10", issues: 5, date: "12/05/2026" },
    { id: 2, name: "Data_Analyzer_Bot", language: "Python 3.9", issues: 0, date: "10/05/2026" },
    { id: 3, name: "Auth_Module_Py", language: "Python 3.11", issues: 2, date: "08/05/2026" },
  ];

  const handleNavigate = (newView: string) => {
    setView(newView as 'dashboard' | 'profile' | 'create-project');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      {/* Navbar Component */}
      <Navbar onNavigate={handleNavigate} currentView={view} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* DASHBOARD VIEW */}
        {view === 'dashboard' && (
          <ProjectList 
            projects={myProjects} 
            onCreateProject={() => handleNavigate('create-project')}
          />
        )}

        {/* USER PROFILE VIEW - Obtiene datos de API internamente */}
        {view === 'profile' && (
          <UserProfile 
            onBack={() => handleNavigate('dashboard')}
          />
        )}

        {/* CREATE PROJECT VIEW */}
        {view === 'create-project' && (
          <ProjectForm onCancel={() => handleNavigate('dashboard')} />
        )}

      </main>
    </div>
  );
}
