import Image from 'next/image'
import Link from 'next/link'

interface AdBannerProps {
  variant?: 'sidebar' | 'banner'
}

export default function AdBanner({ variant = 'sidebar' }: AdBannerProps) {
  if (variant === 'sidebar') {
    return (
      <>
        {/* Versión desktop - banner horizontal arriba */}
        <div className="hidden lg:block w-full  border-none bg-white rounded-lg overflow-hidden mb-8">
          <div className="flex items-center">
            {/* Imagen más grande en desktop con mejor proporción */}
            <div className="relative w-60 h-32 flex-shrink-0 bg-gray-50 p-2">
              <Image
                src="/publicidad.png"
                alt="Publicidad"
                fill
                className="object-contain rounded"
                sizes="240px"
              />
            </div>
            
            {/* Contenido del anuncio */}
            <div className="p-6 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Anuncia tu negocio aquí!
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Llega a miles de candidatos y empresas activas en nuestra plataforma
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                📢 Contactar ahora
              </Link>
            </div>
          </div>
        </div>

        {/* Versión móvil - banner horizontal fijo */}
        <div className="block lg:hidden w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">
          <div className="flex items-center">
            {/* Imagen optimizada para móvil */}
            <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 p-1">
              <Image
                src="/publicidad.png"
                alt="Publicidad"
                fill
                className="object-contain rounded"
                sizes="80px"
              />
            </div>
            
            {/* Texto al lado */}
            <div className="p-3 flex-1">
              <Link 
                href="/contact"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                📢 Anúnciate aquí
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Variant banner original para landing page
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Imagen de publicidad */}
      <div className="relative w-full h-48 sm:h-64 bg-gray-50 p-3">
        <Image
          src="/publicidad.png"
          alt="Publicidad"
          fill
          className="object-contain rounded"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Anuncio "Anúnciate aquí" */}
      <div className="p-4 bg-gray-50 text-center">
        <Link 
          href="/contact"
          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
        >
          📢 Anúnciate aquí - Contacta con nosotros
        </Link>
      </div>
    </div>
  )
} 