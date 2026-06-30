"use client";

import React, { useState } from 'react';
import { MessageSquare, X, Star } from 'lucide-react';
import { feedbackService } from '@/services/feedbackService';

type Categoria = 'bug' | 'sugerencia' | 'felicitacion' | 'otro';

interface FeedbackBubbleProps {
  proyectoId?: number;
}

export const FeedbackBubble = ({ proyectoId }: FeedbackBubbleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    categoria: 'sugerencia' as Categoria,
    calificacion: 5,
    comentario: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.comentario.trim()) return;

    setIsSending(true);
    setError(null);

    try {
      // Control estricto: Si es un número válido, pasa el entero. 
      // Si es NaN, undefined o null, enviamos explícitamente null para que la llave 
      // exista en el JSON y Pydantic no lance el error de validación 422.
      const idFinal = (proyectoId !== undefined && proyectoId !== null && !isNaN(proyectoId))
        ? Number(proyectoId)
        : null;

      await feedbackService.enviarOpinion({
        ...formData,
        proyecto_id: idFinal,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
        setFormData({ categoria: 'sugerencia', calificacion: 5, comentario: '' });
      }, 3000);
    } catch (err) {
      console.error("Error enviando feedback:", err);
      setError("Hubo un error al enviar, intenta de nuevo.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Botón Flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar formulario de opinión" : "Dejar tu opinión"}
        className="fixed bottom-24 right-6 z-50 p-4 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-900/20 hover:scale-110 transition-transform duration-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Modal/Formulario */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 z-50 w-80 bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl p-6 animate-in slide-in-from-bottom-10">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="text-emerald-500 mb-2 font-semibold">¡Gracias!</div>
              <p className="text-sm text-slate-400">Recibimos tu comentario.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-white font-bold text-lg">¿Qué nos cuentas?</h3>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Categoría</label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value as Categoria })}
                >
                  <option value="sugerencia">Sugerencia</option>
                  <option value="bug">Reportar bug</option>
                  <option value="felicitacion">Felicitación</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Tu calificación</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, calificacion: star })}
                      aria-label={`${star} estrellas`}
                      className={`transition-colors ${formData.calificacion >= star ? 'text-yellow-400' : 'text-slate-600'}`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none h-24"
                placeholder="Cuéntanos tu experiencia..."
                value={formData.comentario}
                onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                required
              />

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {isSending ? 'Enviando...' : 'Enviar feedback'}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};