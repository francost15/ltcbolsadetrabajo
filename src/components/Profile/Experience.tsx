import React from 'react'
import { Profile } from '@/interfaces'
import { FaPencil } from 'react-icons/fa6'
import { es } from 'date-fns/locale'
import { format } from 'date-fns'

interface Props{
  profile: Profile
}
export const Experience = ({ profile }: Props) => {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Presente';
    return format(new Date(date), 'MMMM yyyy', { locale: es });
  };
  return (
    <div className="space-y-6">
    {profile.experiencia.length === 0 ? (
    <p className="text-gray-600">No hay experiencia registrada</p>
  ) : (
    profile.experiencia.map((exp) => (
      <div key={exp.id} className="border-b pb-4 last:border-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">{exp.cargo}</h3>
            <p className="text-gray-600">{exp.empresa}</p>
            <p className="text-sm text-gray-500">
              {formatDate(new Date(exp.fechaInicio))} - {formatDate(exp.fechaFin ? new Date(exp.fechaFin) : null)}
              {exp.trabajoActual && ' (Actual)'}
            </p>
          </div>
          <button className="p-2 text-gray-600 hover:text-blue-600">
            <FaPencil />
          </button>
        </div>
        <p className="mt-2 text-gray-600">{exp.descripcion}</p>
      </div>
    ))
  )}
</div>
  )
}
