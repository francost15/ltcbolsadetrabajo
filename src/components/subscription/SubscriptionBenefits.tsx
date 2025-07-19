'use client';

import { Suspense } from 'react';

// Skeleton loading para beneficios
function BenefitsSkeleton() {
  return (
    <div className="bg-white py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-72 mx-auto animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="text-center animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionBenefits() {
  const benefits = [
    {
      title: 'Matching Avanzado',
      description: 'Algoritmo de IA que encuentra las mejores oportunidades',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Acceso Ilimitado',
      description: 'Aplica a todas las vacantes sin restricciones',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: 'Soporte Prioritario',
      description: 'Asistencia personalizada 24/7 para suscriptores',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Estadísticas Avanzadas',
      description: 'Análisis detallado de tu desempeño y progreso',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <Suspense fallback={<BenefitsSkeleton />}>
      <div className="bg-white py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">
              Beneficios de tu suscripción
            </h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto text-sm md:text-base">
              Diseñado para acelerar tu búsqueda laboral con herramientas avanzadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-700 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-base md:text-lg font-light text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 font-light text-xs md:text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Estadísticas más compactas */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-light text-gray-900 mb-2">87%</div>
                <div className="text-gray-600 font-light text-xs md:text-sm">
                  Encuentran trabajo en menos de 3 meses
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-gray-900 mb-2">10,000+</div>
                <div className="text-gray-600 font-light text-xs md:text-sm">
                  Vacantes activas disponibles
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-gray-900 mb-2">95%</div>
                <div className="text-gray-600 font-light text-xs md:text-sm">
                  Satisfacción con el matching
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
} 