import React from 'react'
import { IoCubeOutline } from 'react-icons/io5'

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
    <div className="mb-4">
    <IoCubeOutline size={60} className='text-blue-800 opacity-70' />
    </div>
    <h2 className="text-xl font-bold text-gray-800 mb-2">Aún no tienes postulaciones</h2>
    <p className="text-gray-500 text-sm text-center max-w-xs">Cuando te postules a una vacante, aparecerá aquí tu historial de postulaciones. ¡Sigue explorando oportunidades!</p>
  </div>
  )
}
