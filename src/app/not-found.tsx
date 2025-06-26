"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6 p-8">
        {/* Número 404 grande */}
        <h1 className="text-9xl font-bold text-blue-800">404</h1>
        
        {/* Mensaje de error */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">¡Página no encontrada!</h2>
          <p className="text-gray-600">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
          >
            ← Volver atrás
          </button>
          
          <Link href="/home/candidate" className="px-6 py-2 text-white bg-blue-800 rounded-lg shadow-md hover:bg-blue-900 transition-colors duration-200">
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}