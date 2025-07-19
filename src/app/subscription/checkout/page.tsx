import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserSubscriptionStatus } from '@/actions';
import SubscriptionForm from '@/components/subscription/SubscriptionForm';
import prisma from '@/lib/prisma';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import { IoShield, IoShieldOutline } from 'react-icons/io5';

// Componente de loading skeleton
function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Content skeleton */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left column skeleton */}
          <div className="space-y-6">
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-3">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              ))}
            </div>
            <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Right column skeleton */}
          <div className="space-y-6">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function CheckoutPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/subscription/checkout');
  }

  // Verificar si ya tiene suscripción activa
  const subscriptionStatus = await getUserSubscriptionStatus();
  
  // Si ya tiene suscripción activa, mostrar pantalla informativa
  if (subscriptionStatus.hasActiveSubscription) {
    const subscription = subscriptionStatus.subscription;
    const daysRemaining = subscriptionStatus.daysRemaining || 0;
    
    return (
      <div className="min-h-screen bg-white">
        <Toaster 
          position="top-center" 
          toastOptions={{
            className: 'bg-white border border-gray-200 shadow-lg',
            style: {
              borderRadius: '8px',
              padding: '12px',
              fontWeight: '400',
              fontSize: '14px'
            }
          }}
        />
        
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            {/* Ícono de suscripción activa */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Mensaje principal */}
            <h1 className="text-2xl md:text-3xl font-light text-gray-900 mb-3 tracking-tight">
              Tu membresía ya está activa
            </h1>
            
            <p className="text-gray-600 font-light mb-8 leading-relaxed">
              Ya tienes acceso completo a todas las funcionalidades premium.
            </p>

            {/* Información de la suscripción */}
            <div className="bg-gray-50 border border-gray-200 p-6 mb-8 text-left">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-light text-gray-900">Plan Anual</h3>
                  <p className="text-sm text-gray-600 font-light">
                    Suscripción activa
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-light text-gray-900">
                    ${subscription?.plan?.precio ? Number(subscription.plan.precio) : '365'}
                  </p>
                  <p className="text-sm text-gray-600 font-light">
                    por año
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center border-t border-gray-200 pt-4">
                <div>
                  <p className="text-xl font-light text-gray-900">{daysRemaining}</p>
                  <p className="text-sm text-gray-600 font-light">
                    días restantes
                  </p>
                </div>
                <div>
                  <p className="text-xl font-light text-gray-900">
                    {subscription?.fechaFin ? new Date(subscription.fechaFin).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 font-light">
                    fecha de vencimiento
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <a
                href="/home/candidate"
                className="w-full bg-gray-900 text-white py-3 px-6 font-light transition-all duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-sm inline-block"
              >
                Ir al dashboard
              </a>
              
              <a
                href="/"
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 font-light transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-sm inline-block"
              >
                Volver al inicio
              </a>
            </div>

            {/* Beneficios recordatorio */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-light text-gray-900 mb-4">
                Beneficios activos
              </h3>
              <div className="grid grid-cols-2 gap-4 text-left">
                {[
                  'Matching avanzado con IA',
                  'Aplicaciones ilimitadas',
                  'Soporte prioritario 24/7',
                  'Estadísticas detalladas'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 font-light text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Obtener información del plan
  const plan = await prisma.planes.findFirst({
    where: {
      nombre: 'PLAN_ANUAL_365'
    }
  });

  if (!plan) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-light text-gray-900 mb-3">
            Error de configuración
          </h1>
          <p className="text-gray-600 font-light text-sm">
            No se pudo encontrar el plan de suscripción.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <div className="min-h-screen bg-white">
        <Toaster 
          position="top-center" 
          toastOptions={{
            className: 'bg-white border border-gray-200 shadow-lg',
            style: {
              borderRadius: '8px',
              padding: '12px',
              fontWeight: '400',
              fontSize: '14px'
            }
          }}
        />
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header más compacto */}
          <div className="text-center mb-6">
            <h1 className="text-xl md:text-3xl font-light text-gray-900 mb-3 tracking-tight">
              Suscripción Anual
            </h1>
            <p className="text-gray-600 font-light max-w-xl mx-auto leading-relaxed text-sm md:text-base">
              Accede a todas las funcionalidades premium
            </p>
          </div>

          {/* Contenido principal más compacto */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Información del plan - Más compacta */}
            <div className="space-y-8">
              {/* Precio principal más pequeño */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-baseline">
                  <span className="text-3xl md:text-4xl font-light text-gray-900">
                    ${Number(plan.precio)}
                  </span>
                  <span className="text-sm md:text-base text-gray-500 ml-2 font-light">
                    / año
                  </span>
                </div>
                <p className="text-gray-600 mt-1 font-light text-sm">
                  Solo ${(Number(plan.precio) / plan.duracionDias).toFixed(2)} por día
                </p>
              </div>

              {/* Características más compactas */}
              <div className="space-y-4">
                <h3 className="text-lg font-light text-gray-900">
                  Incluye
                </h3>
                <div className="space-y-2">
                  {[
                    'Acceso completo a la plataforma',
                    'Matching avanzado con IA',
                    'Subida ilimitada de CV',
                    'Aplicaciones ilimitadas',
                    'Soporte prioritario 24/7',
                    'Estadísticas detalladas'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-light text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estadísticas más compactas */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-light text-gray-900 mb-4">
                  Resultados
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-light text-gray-900">87%</div>
                    <div className="text-xs md:text-sm text-gray-600 font-light">
                      Encuentran trabajo
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-light text-gray-900">10,000+</div>
                    <div className="text-xs md:text-sm text-gray-600 font-light">
                      Vacantes disponibles
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de pago */}
            <div className="lg:pl-4">
              <Suspense fallback={<FormSkeleton />}>
                <SubscriptionForm 
                  userEmail={session.user.email || ''} 
                  planPrice={Number(plan.precio)}
                />
              </Suspense>
            </div>
          </div>

          {/* Información de seguridad más compacta */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-gray-600 font-light text-sm">
                <IoShieldOutline className="w-4 h-4" />
                <span>Pago seguro procesado por Mercado Pago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

// Skeleton loading para el formulario
function FormSkeleton() {
  return (
    <div className="bg-white space-y-6">
      <div className="mb-8">
        <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      
      <div className="space-y-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
      
      <div className="pt-6 border-t border-gray-200">
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
} 