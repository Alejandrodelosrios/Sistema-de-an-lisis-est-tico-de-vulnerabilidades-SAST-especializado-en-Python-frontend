"use client";

import { useState, useEffect } from "react";
import {useRouter} from "next/navigation";
import api from "@/lib/api";
import {saveTokens} from "@/lib/auth";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Cargar correo guardado en localStorage al montar el componente
  useEffect(() => {
    const savedCorreo = localStorage.getItem("rememberedEmail");
    if (savedCorreo) {
      setCorreo(savedCorreo);
      setRememberMe(true);
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Guardar o eliminar email según rememberMe
    if (rememberMe) {
     localStorage.setItem("rememberedEmail", correo);
    } else {
     localStorage.removeItem("rememberedEmail");
    }

    try {

      // Aquí irá la lógica de autenticación
      const response = await api.post("/auth/login", {
          correo: correo, 
          password:password, 
      });

      saveTokens(
       response.data.access_token,
       response.data.refresh_token 
      );

      router.push("/dashboard");

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
       const detail = err.response?.data?.detail;
       if(typeof detail==="string"){
        setError(detail);
       }else if(Array.isArray(detail)){
        setError(detail[0]?.msg || "Error de validación");
       }else{
         setError("Credenciales incorrectas");
       }
      } else {
       setError("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Correo */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-mono text-white/80">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60" />
          <input
            id="correo"
            type="email"
            placeholder="tu@email.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-mono text-sm"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-mono text-white/80">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-sm font-mono">{error}</p>
        </div>
      )}

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded bg-white/5 border border-white/10 accent-emerald-600" 
          />
          <span className="font-mono text-white/60 group-hover:text-white/80 transition-colors">
            Recuérdame
          </span>
        </label>
        <Link href="#" className="font-mono text-emerald-400 hover:text-emerald-300 transition-colors">
          ¿Olvidó contraseña?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-sm py-2.5 h-auto disabled:opacity-50"
      >
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>

      {/* Register Link */}
      <p className="text-center text-sm font-mono text-white/60">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}
