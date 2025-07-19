import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserSubscriptionStatus } from '@/actions';
import Link from 'next/link';
import { Suspense } from 'react';

// Skeleton loading para la página de éxito
function SuccessSkeleton() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-10 bg-gray-200 rounded mb-3"></div>
          <div className="h-10 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    </div>
  );
}

export default async function SubscriptionSuccessPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Verificar el estado de la suscripción
  const subscriptionStatus = await getUserSubscriptionStatus();
  
  if (!subscriptionStatus.hasActiveSubscription) {
    redirect('/subscription/checkout');
  }

  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          {/* Ícono de éxito más compacto */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Mensaje de éxito más compacto */}
          <h1 className="text-2xl font-light text-gray-900 mb-3">
            ¡Suscripción activada!
          </h1>
          
          <p className="text-gray-600 font-light mb-6 leading-relaxed text-sm">
            Tu suscripción anual está activa. Disfruta de todas las funcionalidades premium 
            y encuentra tu trabajo ideal.
          </p>

          {/* Información de la suscripción más compacta */}
          <div className="bg-gray-50 p-4 mb-6 text-left">
            <h2 className="text-base font-light text-gray-900 mb-3">
              Detalles de tu suscripción
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-light">Plan:</span>
                <span className="text-gray-900 font-light">Anual Premium</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-light">Duración:</span>
                <span className="text-gray-900 font-light">365 días</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-light">Vence:</span>
                <span className="text-gray-900 font-light">
                  {subscriptionStatus.subscription?.fechaFin ? 
                    new Date(subscriptionStatus.subscription.fechaFin).toLocaleDateString() : 
                    'N/A'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Acciones más compactas */}
          <div className="space-y-3">
            <Link
              href="/home/candidate"
              className="block w-full bg-gray-900 text-white py-3 px-4 font-light transition-all duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-sm"
            >
              Comenzar a buscar trabajo
            </Link>
            
            <Link
              href="/home/candidate/profile"
              className="block w-full border border-gray-300 text-gray-700 py-3 px-4 font-light transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-sm"
            >
              Completar mi perfil
            </Link>
          </div>

          {/* Próximos pasos más compactos */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-base font-light text-gray-900 mb-3">
              Próximos pasos
            </h3>
            <div className="space-y-2 text-xs text-gray-600 font-light">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Completa tu perfil profesional</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Sube tu currículum actualizado</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Explora vacantes con matching avanzado</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Aplica a las oportunidades más relevantes</span>
              </div>
            </div>
          </div>

          {/* Soporte más compacto */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 font-light">
              ¿Necesitas ayuda? Contáctanos en{' '}
              <a href="mailto:soporte@tuapp.com" className="text-gray-700 hover:text-gray-900">
                contacto@ltcbolsadetrabajo.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </Suspense>
  );
} 