"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { ProjectList } from '@/components/project/ProjectList';
import { ProjectForm } from '@/components/project/ProjectForm';
import { UserProfile } from '@/components/auth/UserProfile';

function DashboardContent() {
  const [view, setView] = useState<'dashboard' | 'profile' | 'create-project' | 'edit-project'>('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      setEditingProjectId(Number(editId));
      setView('edit-project');
    }
  }, [searchParams]);

  const handleNavigate = (newView: string) => {
    setView(newView as 'dashboard' | 'profile' | 'create-project' | 'edit-project');
  };

  const handleEditProject = (id: number) => {
    setEditingProjectId(id);
    setView('edit-project');
  };

  const handleProjectSuccess = () => {
    // Forzar recarga de ProjectList
    setRefreshKey(prev => prev + 1);
    setView('dashboard');
    setEditingProjectId(null);
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
            key={refreshKey}
            onCreateProject={() => handleNavigate('create-project')}
            onEdit={handleEditProject}
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
          <ProjectForm 
            onCancel={() => handleNavigate('dashboard')}
            onSuccess={handleProjectSuccess}
          />
        )}

        {/* EDIT PROJECT VIEW */}
        {view === 'edit-project' && editingProjectId && (
          <ProjectForm 
            projectId={editingProjectId}
            onCancel={() => {
              setEditingProjectId(null);
              handleNavigate('dashboard');
            }}
            onSuccess={handleProjectSuccess}
          />
        )}

      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
