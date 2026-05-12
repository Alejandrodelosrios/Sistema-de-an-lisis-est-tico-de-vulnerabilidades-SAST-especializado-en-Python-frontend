import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener el token de la cookie o header
  const token = request.cookies.get('auth_token')?.value;

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/dashboard'];
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/', '/login', '/register'];

  // Si intenta acceder a una ruta protegida sin token
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Si ya está logueado, no lo dejes ir a login/register
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Permitir la solicitud si pasa todas las validaciones
  return NextResponse.next();
}

// Configurar qué rutas debe interceptar el middleware
export const config = {
  matcher: [
    /*
     * Coincidir todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     * - public/* (archivos públicos)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
