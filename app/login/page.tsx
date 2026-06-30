"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-size-[64px_64px]" />

      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-mono font-bold text-white tracking-tight text-sm sm:text-base">
            Py<span className="text-emerald-400">Guardian</span>
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Heading */}
          <div className="space-y-3 text-center">
            <h1 className="font-mono text-3xl sm:text-4xl font-black tracking-tight">
              <span className="text-white">Bienvenido</span>
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-violet-400">
                de vuelta
              </span>
            </h1>
            <p className="text-white/40 font-mono text-xs sm:text-sm">
              Inicia sesión para acceder a tu dashboard
            </p>
          </div>

          {/* Form Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
