"use client";
import { useState } from "react";
import {useRouter} from "next/navigation";
import api from "@/lib/api";
import {saveTokens} from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Eye, EyeOff, Check, X } from "lucide-react";
import axios from "axios";

export default function RegisterForm() {
  const router = useRouter();
  const [nombre_completo, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Validaciones de contraseña
  const passwordValidations = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  };

  const isPasswordValid = Object.values(passwordValidations).every(Boolean);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    if (!isPasswordValid) {
      setError("La contraseña no cumple con los requisitos");
      return;
    }

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        nombre_completo: nombre_completo,
        correo: correo,
        password: password,
      });

      saveTokens(
        response.data.access_token,
        response.data.refresh_token
      );

      router.push("/dashboard")

    } catch (err:unknown) {
      if (axios.isAxiosError(err)) {
       const detail = err.response?.data?.detail;
    if (typeof detail === "string") {
      setError(detail);
    } else if (Array.isArray(detail)) {
      setError(detail[0]?.msg || "Error de validación");
    } else {
      setError("Error al registrarse");
    }
    }else{
      setError("Error inesperado");
    } 
  }finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-mono text-white/80">
          Nombre completo
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60" />
          <input
            id="name"
            type="text"
            placeholder="Juan Pérez"
            value={nombre_completo}
            onChange={(e) => setNombreCompleto(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-mono text-sm"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-mono text-white/80">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60" />
          <input
            id="email"
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

        {/* Password Requirements */}
        {password && (
          <div className="mt-3 space-y-2 p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs font-mono text-white/60 mb-2">Requisitos de contraseña:</p>
            {[
              { key: "minLength", label: "Mínimo 8 caracteres" },
              { key: "hasUppercase", label: "Una mayúscula" },
              { key: "hasLowercase", label: "Una minúscula" },
              { key: "hasNumber", label: "Un número" },
              { key: "hasSpecial", label: "Un carácter especial (!@#$%^&*)" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                {passwordValidations[key as keyof typeof passwordValidations] ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <X className="w-3.5 h-3.5 text-red-400" />
                )}
                <span className={`text-xs font-mono ${
                  passwordValidations[key as keyof typeof passwordValidations]
                    ? "text-green-400/60"
                    : "text-red-400/60"
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-mono text-white/80">
          Confirmar contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {confirmPassword && (
          <p className={`text-xs font-mono ${passwordsMatch ? "text-green-400/60" : "text-red-400/60"}`}>
            {passwordsMatch ? "✓ Las contraseñas coinciden" : "✗ Las contraseñas no coinciden"}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-sm font-mono">{error}</p>
        </div>
      )}

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded bg-white/5 border border-white/10 accent-emerald-600"
        />
        <span className="font-mono text-xs text-white/60 group-hover:text-white/80 transition-colors leading-relaxed">
          Acepto los{" "}
          <Link href="#" className="text-emerald-400 hover:text-emerald-300">
            términos de servicio
          </Link>
          {" "}y la{" "}
          <Link href="#" className="text-emerald-400 hover:text-emerald-300">
            política de privacidad
          </Link>
        </span>
      </label>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading || !agreeTerms || !isPasswordValid || !passwordsMatch}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-sm py-2.5 h-auto disabled:opacity-50"
      >
        {loading ? "Registrando..." : "Crear cuenta"}
      </Button>

      {/* Login Link */}
      <p className="text-center text-sm font-mono text-white/60">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
