"use client";
import Link from "next/link";
import { Shield, Code2, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
   <main className="min-h-screen bg-[#0f172a] text-slate-200 overflow-hidden relative selection:bg-emerald-500/30">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bgsize-[40px_40px]" />
      {/* Glow top */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />


      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-6 h-6 text-white" />
           </div>
          <span className="font-mono text-xl font-bold text-white tracking-tight">
            Py<span className="text-emerald-400">Guardian</span>
          </span>
        </div>
        {/* revisar si poner estas cosas */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#caracteristicas" className="hover:text-emerald-400 transition-colors">Caracteristicas</a>
          <a href="#tecnologias" className="hover:text-emerald-400 transition-colors">Tecnologias</a>
          <a href="#acerca" className="hover:text-emerald-400 transition-colors">Acerca del proyecto</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 font-mono text-sm">
              Iniciar sesión
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-sm px-5">
              Registrarse
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-300 font-mono text-xs tracking-widest uppercase">
            Análisis estático de vulnerabilidades
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-mono text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
          <span className="text-white">Detectá</span>
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-violet-400">
            vulnerabilidades
          </span>
          <br />
          <span className="text-white/40">en tu código</span>
        </h1>

        <p className="text-white/40 font-mono text-sm md:text-base max-w-xl mb-10 leading-relaxed">
          diseñado para estudiantes. Detecta vulnerabilidades y aprende a resolverlas con explicaciones paso a paso.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/register">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono px-8 py-3 h-auto text-sm">
              Empezar gratis →
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-white/10 text-black hover:text-white hover:bg-white/5 font-mono px-8 py-3 h-auto text-sm">
              Ya tengo cuenta
            </Button>
          </Link>
        </div>
      </section>
      
      <section
  id="caracteristicas"
  className="relative z-10 max-w-5xl mx-auto px-8 py-20"
>
  <h2 className="font-mono text-3xl font-bold text-center mb-12">
    Características
  </h2>

  <div className="grid md:grid-cols-2 gap-6">
    <div className="p-6 rounded-xl border border-white/10">
      <h3 className="font-mono text-emerald-400 mb-2">
        Análisis estático especializado en Python
      </h3>
      <p className="text-slate-400 text-sm">
        Detecta patrones inseguros en código Python sin ejecutar la aplicación.
      </p>
    </div>

    <div className="p-6 rounded-xl border border-white/10">
      <h3 className="font-mono text-emerald-400 mb-2">
        Vulnerabilidades OWASP
      </h3>
      <p className="text-slate-400 text-sm">
        Identifica vulnerabilidades alineadas con las categorías del OWASP Top 10.
      </p>
    </div>

    <div className="p-6 rounded-xl border border-white/10">
      <h3 className="font-mono text-emerald-400 mb-2">
        Retroalimentación pedagógica
      </h3>
      <p className="text-slate-400 text-sm">
        Cada hallazgo incluye una explicación del riesgo y una solución sugerida.
      </p>
    </div>

    <div className="p-6 rounded-xl border border-white/10">
      <h3 className="font-mono text-emerald-400 mb-2">
        Reportes PDF
      </h3>
      <p className="text-slate-400 text-sm">
        Exporta los resultados del análisis para documentación y seguimiento.
      </p>
    </div>
  </div>
</section>

      {/* Code preview */}
      <section className="relative z-10 flex justify-center px-6 pb-16">
        <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-white/3 backdrop-blur-sm overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/20">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 font-mono text-xs text-white/20">vulnerabilities.py</span>
          </div>
          {/* Code */}
          <div className="p-6 font-mono text-sm space-y-1">
            <p><span className="text-violet-400">import</span> <span className="text-white/60">subprocess</span></p>
            <p className="text-white/20">&nbsp;</p>
            <p><span className="text-blue-400">def</span> <span className="text-emerald-300">run_command</span><span className="text-white/60">(user_input):</span></p>
            <p className="pl-4">
              <span className="text-white/60">subprocess.</span>
              <span className="text-emerald-300">call</span>
              <span className="text-white/60">(user_input, </span>
              <span className="text-orange-400">shell</span>
              <span className="text-white/60">=</span>
              <span className="text-red-400">True</span>
              <span className="text-white/60">)</span>
            </p>
            <p className="text-white/20">&nbsp;</p>
            {/* Alert line */}
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">
              <span className="text-red-400 text-xs mt-0.5">⚠</span>
              <div>
                <p className="text-red-400 text-xs font-bold">CRÍTICO — Inyección de comandos</p>
                <p className="text-red-300/60 text-xs">shell=True con input del usuario permite ejecución arbitraria</p>
              </div>
            </div>

            {/* Safe solution box */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 mt-3">
              <p className="text-green-400 text-xs font-bold mb-2">💡 ¿Por qué es peligroso?</p>
              <p className="text-green-300/70 text-xs leading-relaxed mb-3">
                Cuando usás shell=True con input del usuario, un atacante puede agregar caracteres como <span className="text-green-300 font-mono">; rm -rf /</span> o <span className="text-green-300 font-mono">| cat /etc/passwd</span> y ejecutar cualquier comando en tu servidor.
              </p>
              
              <p className="text-green-400 text-xs font-bold mb-2">✓ La solución correcta es:</p>
              <ul className="text-green-300/70 text-xs space-y-1 mb-3 list-disc list-inside">
                <li>Pasar el comando como lista en lugar de string</li>
                <li>Nunca usar shell=True con datos externos</li>
                <li>Validar y sanitizar el input antes de usarlo</li>
              </ul>

              <p className="font-mono text-white text-xs space-y-1 bg-black/50 rounded p-2 mb-2 leading-relaxed">
                <span className="block"><span className="text-violet-400">import</span> <span className="text-white">subprocess</span></span>
                <span className="block">&nbsp;</span>
                <span className="block"><span className="text-blue-400">def</span> <span className="text-white">run_command</span><span className="text-white">(user_input):</span></span>
                <span className="block">&nbsp;&nbsp;<span className="text-white/50"># ✓ Lista de comandos permitidos — whitelist</span></span>
                <span className="block">&nbsp;&nbsp;allowed = [<span className="text-yellow-300">&quot;ls&quot;</span>, <span className="text-yellow-300">&quot;pwd&quot;</span>, <span className="text-yellow-300">&quot;whoami&quot;</span>]</span>
                <span className="block">&nbsp;&nbsp;<span className="text-violet-400">if</span> <span className="text-white">user_input</span> <span className="text-violet-400">not in</span> <span className="text-white">allowed:</span></span>
                <span className="block">&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-violet-400">raise</span> <span className="text-orange-400">ValueError</span>(<span className="text-yellow-300">&quot;Comando no permitido&quot;</span>)</span>
                <span className="block">&nbsp;&nbsp;<span className="text-white/50"># ✓ Lista como argumento, sin shell=True</span></span>
                <span className="block">&nbsp;&nbsp;subprocess.run([user_input], shell=<span className="text-red-400">False</span>)</span>
              </p>

              <p className="text-green-400 text-xs font-bold">✓ Código seguro — Inyección de comandos eliminada</p>
              <p className="text-green-300/70 text-xs">Whitelist de comandos + shell=False elimina el riesgo de ejecución arbitraria</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 px-8 max-w-4xl mx-auto pb-24">
        {[
          { icon: Code2, title: "Archivos .py", desc: "Subí uno o varios archivos Python directamente desde tu equipo" },
          { icon: Zap, title: "GitHub", desc: "Conectá cualquier repositorio público con solo pegar la URL" },
          { icon: Lock, title: "Reporte detallado", desc: "Cada vulnerabilidad con su nivel de riesgo y cómo solucionarla" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="p-5 rounded-xl border border-white/5 bg-white/2 hover:border-emerald-500/30 transition-colors">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3">
              <Icon className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-mono font-bold text-white text-sm mb-1">{title}</h3>
            <p className="font-mono text-white/30 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>
      <section
  id="tecnologias"
  className="relative z-10 max-w-5xl mx-auto px-8 py-20"
>
  <h2 className="font-mono text-3xl font-bold text-center mb-12">
    Tecnologías
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[
      "Next.js",
      "FastAPI",
      "PostgreSQL",
      "TypeScript",
      "Tailwind CSS",
      "GitHub"
    ].map((tech) => (
      <div
        key={tech}
        className="rounded-xl border border-white/10 p-5 text-center font-mono"
      >
        {tech}
      </div>
    ))}
  </div>
</section>

<section
  id="acerca"
  className="relative z-10 max-w-4xl mx-auto px-8 py-20 text-center"
>
  <h2 className="font-mono text-3xl font-bold mb-8">
    Acerca del proyecto
  </h2>

  <p className="text-slate-400 leading-relaxed">
    PyGuardian es una herramienta educativa de análisis estático de
    vulnerabilidades especializada en Python. Su objetivo es ayudar a
    estudiantes a identificar vulnerabilidades de seguridad, comprender
    sus riesgos y aprender buenas prácticas mediante retroalimentación
    pedagógica y ejemplos de corrección.
  </p>
</section>
      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-8 py-6 flex items-center justify-between">
        <span className="font-mono text-white/20 text-xs">PyGuardian © 2026</span>
      </footer>
    </main>
  );
}