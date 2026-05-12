"use client";

import React from 'react';
import { Shield, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api'; 
import { clearTokens } from '@/lib/auth';

export const Navbar = ({ onNavigate, currentView }: { onNavigate: (view: string) => void; currentView: string }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Intentamos avisar al backend
      await api.post('/auth/logout');
    } catch (error) {
      // Si falla (ej. token expirado), solo lo logueamos
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      // IMPORTANTE: Limpiamos localmente y redirigimos SIEMPRE
      clearTokens();
      router.push('/');
    }
  };

  return (
    <nav className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-900" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">PyGuardian</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              currentView === 'profile' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Perfil</span>
          </button>
          
          <button 
            onClick={handleLogout} // <--- Agregamos el evento aquí
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
};