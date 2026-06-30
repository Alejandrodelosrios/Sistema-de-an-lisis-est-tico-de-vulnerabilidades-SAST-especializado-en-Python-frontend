'use client';

import React from 'react';
import { Mail } from 'lucide-react';

export const Footer = () => {
  // Accedemos a la variable de entorno de Next.js para el cliente
  const EMAIL_SOPORTE = process.env.NEXT_PUBLIC_EMAIL_SOPORTE || ""; 
  
  const SUBJECT = encodeURIComponent("[PyGuardian] Solicitud de Soporte Técnico");
  const BODY = encodeURIComponent(
    "Hola equipo de soporte,\n\n" +
    "Tengo el siguiente inconveniente con la plataforma:\n" +
    "- Descripción del problema: \n" +
    "- Pasos para reproducirlo: \n\n" +
    "Gracias."
  );

  const mailtoLink = `mailto:${EMAIL_SOPORTE}?subject=${SUBJECT}&body=${BODY}`;

  return (
    <footer className="relative z-10 w-full bg-[#0f172a] border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-white/20 text-xs">PyGuardian© 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-white/40 text-xs hidden md:inline font-sans">
            ¿Experimentas fallos técnicos en el análisis o la carga?
          </span>
          
          <a
            href={mailtoLink}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-800 text-blue-400 font-medium rounded-xl border border-slate-700/40 hover:border-slate-600 transition-all duration-200 shadow-sm text-xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contactar a Soporte</span>
          </a>
        </div>

      </div>
    </footer>
  );
};