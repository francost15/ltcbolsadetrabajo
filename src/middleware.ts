import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// Rutas que requieren suscripción activa
const PROTECTED_ROUTES = [
  '/home/candidate',
  '/home/company',
  '/home/vancancy'
];

// Rutas públicas que no requieren suscripción
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/subscription/checkout',
  '/subscription/success',
  '/api/auth',
  '/privacy',
  '/terms'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir rutas públicas
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Verificar autenticación
  const session = await auth();
  
  if (!session?.user?.id) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Verificar si la ruta requiere suscripción
  const requiresSubscription = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  if (requiresSubscription) {
    try {
      // Verificar suscripción activa
      const activeSubscription = await prisma.suscripciones.findFirst({
        where: {
          usuarioId: session.user.id,
          estado: 'activa',
          fechaFin: {
            gt: new Date()
          }
        }
      });
      
      if (!activeSubscription) {
        // Redirigir a la página de suscripción
        return NextResponse.redirect(new URL('/subscription/checkout', request.url));
      }
      
    } catch (error) {
      console.error('Error al verificar suscripción:', error);
      return NextResponse.redirect(new URL('/subscription/checkout', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 