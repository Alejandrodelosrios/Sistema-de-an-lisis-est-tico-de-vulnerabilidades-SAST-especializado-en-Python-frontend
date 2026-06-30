import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Importa el componente Footer (ajusta la ruta según dónde lo guardaste)
import { Footer } from "@/components/dashboard/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PyGuardian",
  description: "PyGuardian es una herramienta de análisis estático de vulnerabilidades diseñada para estudiantes. Detecta vulnerabilidades en tu código Python y te enseña a resolverlas con explicaciones paso a paso.",
  icons: {
    icon: "/shield-icon.svg",
    shortcut: "/shield-icon.svg",
    apple: "/shield-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Añadimos las clases de color de fondo y texto globales para que el footer y las páginas compartan el mismo diseño */}
      <body className="min-h-full flex flex-col bg-[#0f172a] text-slate-200">
        
        {/* El div 'flex-1' envuelve las páginas y empuja al Footer hacia abajo */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        
        {/* El Footer global se renderiza en todas las rutas */}
        <Footer />
      </body>
    </html>
  );
}