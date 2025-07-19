'use client';

import { useEffect, useState } from 'react';
import { getUserSubscriptionStatus } from '@/actions';

interface SubscriptionData {
  authenticated: boolean;
  hasActiveSubscription?: boolean | null;
  subscription?: any;
  daysRemaining?: number;
}

// Skeleton loading para el estado de suscripción
function SubscriptionSkeleton() {
  return (
    <div className="bg-white border border-gray-200 p-4 md:p-6">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="text-right">
            <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}

export default function SubscriptionStatus() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const data = await getUserSubscriptionStatus();
        setSubscriptionData(data);
      } catch (error) {
        console.error('Error al obtener estado de suscripción:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  if (loading) {
    return <SubscriptionSkeleton />;
  }

  if (!subscriptionData?.authenticated) {
    return null;
  }

  if (!subscriptionData.hasActiveSubscription) {
    return (
      <div className="bg-white border border-gray-300 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h3 className="text-base md:text-lg font-light text-gray-900 mb-1">
              Suscripción requerida
            </h3>
            <p className="text-gray-600 font-light text-sm">
              Activa tu suscripción para acceder a todas las funcionalidades
            </p>
          </div>
          <div className="sm:ml-6">
            <a
              href="/subscription/checkout"
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white font-light transition-all duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 text-sm w-full sm:w-auto"
            >
              Activar suscripción
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { subscription, daysRemaining = 0 } = subscriptionData;
  const isExpiringSoon = daysRemaining <= 30;
  const progressPercentage = Math.min(((365 - daysRemaining) / 365) * 100, 100);

  return (
    <div className="bg-white border border-gray-200 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${isExpiringSoon ? 'bg-orange-500' : 'bg-green-500'}`}></div>
            <h3 className="text-base md:text-lg font-light text-gray-900">
              {isExpiringSoon ? 'Próxima a vencer' : 'Suscripción activa'}
            </h3>
          </div>
          <p className="text-gray-600 font-light text-sm">
            {daysRemaining > 0 ? (
              <>
                {daysRemaining} día{daysRemaining !== 1 ? 's' : ''} restante{daysRemaining !== 1 ? 's' : ''}
              </>
            ) : (
              'Suscripción expirada'
            )}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-base md:text-lg font-light text-gray-900">
            Plan Anual
          </p>
          <p className="text-xs md:text-sm text-gray-600 font-light">
            Vence el {new Date(subscription.fechaFin).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {/* Barra de progreso más compacta */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600 font-light">
          <span>Progreso</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 h-1">
          <div
            className={`h-1 transition-all duration-500 ${
              isExpiringSoon ? 'bg-orange-500' : 'bg-gray-900'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Alerta de renovación más compacta */}
      {isExpiringSoon && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm font-light text-gray-700">
                Renueva pronto para mantener acceso
              </span>
            </div>
            <a
              href="/subscription/checkout"
              className="text-sm font-light text-gray-900 hover:text-gray-700 transition-colors duration-200 underline"
            >
              Renovar
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 