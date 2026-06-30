"use client";

import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { feedbackService } from '@/services/feedbackService';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // <-- Prop añadida para guardar en localStorage
  proyectoId: number;
}

export const SurveyModal = ({ isOpen, onClose, onSuccess, proyectoId }: SurveyModalProps) => {
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Estado inicial con todos los campos de tu esquema Pydantic
  const [formData, setFormData] = useState({
    facilidad_carga: 5,
    relevancia_vulnerabilidades: 5,
    tiempo_analisis_adecuado: 'si' as 'si' | 'masomenos' | 'no',
    claridad_explicaciones: 5,
    aprendio_algo_nuevo: 'si' as 'si' | 'no',
    comentario_aprendizaje: '',
    claridad_recomendaciones: 5,
    intuitividad_dashboard: 5,
    comentario_mejora: '',
    nps: 10
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await feedbackService.enviarEncuesta({
        proyecto_id: proyectoId,
        ...formData
      });
      setSuccess(true);
      onSuccess(); // <-- Registra el éxito para que no vuelva a aparecer
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error enviando encuesta:", error);
      alert("Error al enviar. Verifica tu conexión.");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  // Subcomponente para no repetir tanto código en las barras deslizantes (range)
  const StarRating = ({ label, field }: { label: string, field: keyof typeof formData }) => (
    <div>
      <label className="text-xs text-slate-400 font-medium mb-1 block">{label}</label>
      <input 
        type="range" min="1" max="5" value={Number(formData[field])}
        onChange={(e) => setFormData({...formData, [field]: Number(e.target.value)})}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
      />
      <div className="text-right text-xs text-emerald-400 font-bold mt-1">{formData[field]} / 5</div>
    </div>
  );

  return (
    // Corregido el z-index a z-50
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        
        {success ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl text-white font-bold">¡Encuesta Completada!</h2>
            <p className="text-slate-400 mt-2">Tus respuestas son clave para mejorar la precisión del auditor.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl text-white font-bold">Evaluación del Análisis Estático</h2>
                <p className="text-xs text-slate-400 mt-1">Ayúdanos a validar el funcionamiento de la plataforma.</p>
              </div>
              <button 
                type="button" 
                onClick={onClose} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            {/* Grid para organizar mejor las preguntas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <StarRating label="1. ¿Qué tan fácil fue analizar tu código?" field="facilidad_carga" />
              <StarRating label="2. Relevancia de los fallos detectados" field="relevancia_vulnerabilidades" />
              <StarRating label="3. Claridad de las explicaciones" field="claridad_explicaciones" />
              <StarRating label="4. Utilidad de las recomendaciones" field="claridad_recomendaciones" />
              <StarRating label="5. Intuitividad del Dashboard" field="intuitividad_dashboard" />
              
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">6. ¿El tiempo de escaneo fue adecuado?</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 text-sm focus:border-emerald-500 outline-none transition-colors"
                  value={formData.tiempo_analisis_adecuado}
                  onChange={(e) => setFormData({...formData, tiempo_analisis_adecuado: e.target.value as 'si'|'masomenos'|'no'})}
                >
                  <option value="si">Sí, bastante rápido</option>
                  <option value="masomenos">Más o menos</option>
                  <option value="no">No, tardó demasiado</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">7. ¿Aprendiste sobre seguridad hoy?</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 text-sm focus:border-emerald-500 outline-none transition-colors"
                  value={formData.aprendio_algo_nuevo}
                  onChange={(e) => setFormData({...formData, aprendio_algo_nuevo: e.target.value as 'si' | 'no'})}
                >
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">8. ¿Recomendarías el sistema? (0-10)</label>
                <input 
                  type="number" min="0" max="10" 
                  value={formData.nps} 
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2 text-sm focus:border-emerald-500 outline-none transition-colors"
                  onChange={(e) => setFormData({...formData, nps: Number(e.target.value)})} 
                />
              </div>
            </div>

            {/* Preguntas abiertas (Opcionales) */}
            <div className="space-y-4 pt-2 border-t border-white/5">
              {formData.aprendio_algo_nuevo === 'si' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-xs text-emerald-400 font-medium mb-1 block">¿Qué concepto nuevo aprendiste? (Opcional)</label>
                  <textarea 
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg p-3 text-sm h-16 resize-none focus:border-emerald-500 outline-none"
                    value={formData.comentario_aprendizaje}
                    onChange={(e) => setFormData({...formData, comentario_aprendizaje: e.target.value})} 
                  />
                </div>
              )}
              
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1 block">9. ¿Qué funcionalidad le agregarías a la herramienta? (Opcional)</label>
                <textarea 
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 text-sm h-20 resize-none focus:border-emerald-500 outline-none"
                  value={formData.comentario_mejora}
                  onChange={(e) => setFormData({...formData, comentario_mejora: e.target.value})} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSending} 
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSending ? (
                "Guardando respuestas..."
              ) : (
                <>
                  <Send className="w-4 h-4"/> 
                  Enviar Evaluación
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};