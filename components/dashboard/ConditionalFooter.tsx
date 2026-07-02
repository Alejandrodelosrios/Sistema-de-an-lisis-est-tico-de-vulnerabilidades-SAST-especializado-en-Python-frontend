"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/dashboard/Footer";

/**
 * El Footer se renderiza en el layout raíz, fuera de {children}, así que
 * ninguna página hija puede ocultarlo por sí sola. Este wrapper lee la ruta
 * actual y no lo muestra en /admin (el superadmin no necesita ver enlaces
 * de contacto/soporte pensados para estudiantes).
 */
export function ConditionalFooter() {
  const pathname = usePathname();
  const esRutaAdmin = pathname?.startsWith("/admin");

  if (esRutaAdmin) return null;
  return <Footer />;
}

export default ConditionalFooter;