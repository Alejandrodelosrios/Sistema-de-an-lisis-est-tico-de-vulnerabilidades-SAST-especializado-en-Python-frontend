'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getRol } from '@/lib/auth';
import { adminService } from '@/services/adminService'; // Asegúrate de tenerlo importado

export default function SuperAdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null = cargando

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated(); // Asegúrate de que esto no bloquee
      const rol = await getRol();

      if (!auth) {
        router.push('/login');
      } else if (rol !== 'superadmin') {
        router.push('/dashboard');
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();
  }, [router]);

  // Si está en null, mostramos un estado de carga claro
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-emerald-500 font-mono">
        Cargando sistema...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] p-8 text-white">
      <h1 className="text-2xl font-bold mb-8">Panel de Control Admin</h1>
      
      {/* Aquí irá tu tabla de usuarios cargada con adminService */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <p className="text-slate-400">Dashboard activo. Sistema listo.</p>
      </div>
    </main>
  );
}