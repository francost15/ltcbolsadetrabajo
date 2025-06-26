"use client"

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import DeleteVacancyModal from '../Modal/DeleteVacancyModal';

interface VacancyCardProps {
  id: string;
  titulo: string;
  tipoEmpleo: string | null;
  fechaPublicacion: Date;
  activa: boolean;
  totalCandidatos: number;
}

export function VacancyCard({
  id,
  titulo,
  tipoEmpleo,
  fechaPublicacion,
  activa,
  totalCandidatos,
}: VacancyCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: es });
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-4 sm:p-6 mb-4 sm:mb-6 transition-all duration-300 bg-white border border-gray-200 rounded-xl sm:rounded-2xl hover:shadow-lg group relative">
        {/* Botón de eliminar con mejor UI - Visible en móvil */}
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm sm:bg-transparent opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-md"
          title="Eliminar vacante"
        >
          <div className="relative">
            <FaTrash 
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 text-gray-400 group-hover:text-red-500" 
            />
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
          </div>
          <span className="sr-only">Eliminar vacante</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="relative flex items-center justify-center bg-gray-100 rounded-full w-12 h-12 sm:w-14 sm:h-14">
            <span className={`absolute px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-bold text-white rounded-full shadow -top-1 -left-1 sm:-top-2 sm:-left-2 ${
              activa ? 'bg-green-700' : 'bg-red-700'
            }`}>
              {totalCandidatos}
            </span>
            <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-base sm:text-xl text-gray-600 bg-gray-200 rounded-full">
              💼
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-start sm:items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold leading-tight text-gray-900 line-clamp-2 sm:line-clamp-1">
                {titulo}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-gray-600">
              <span className="inline-block">{tipoEmpleo || 'Tipo no especificado'}</span>
              <span className="inline-block">•</span>
              <span className="inline-block">Publicada el {formatDate(fechaPublicacion)}</span>
              <span className="inline-block">•</span>
              <span className={`inline-block font-medium ${activa ? 'text-green-700' : 'text-red-700'}`}>
                {activa ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 mt-1 sm:mt-2">
          <button
            title="Editar"
            aria-label="Editar"
            name="Editar"
            className="py-1.5 sm:py-2 px-2 sm:px-4 font-medium text-sm sm:text-base text-gray-700 transition-colors border border-gray-200 rounded-lg hover:bg-gray-100 sm:flex-1"
            onClick={() => router.push(`/home/company/edit/${id}`)}
          >
            Editar
          </button>
          <button
            title="Ver más"
            aria-label="Ver más"
            name="Ver más"
            className="py-1.5 sm:py-2 px-2 sm:px-4 font-medium text-sm sm:text-base text-gray-700 transition-colors border border-gray-200 rounded-lg hover:bg-gray-100 sm:flex-1"
            onClick={() => router.push(`/home/vancancy/${id}`)}
          >
            Ver más
          </button>
          <button
            title="Ver Candidatos"
            aria-label="Ver Candidatos"
            name="Ver Candidatos"
            className="col-span-2 py-1.5 sm:py-2 px-2 sm:px-4 font-semibold text-sm sm:text-base text-white transition-colors bg-blue-800 rounded-lg shadow hover:bg-blue-900 sm:flex-1"
            onClick={() => router.push(`/home/company/vacancy/${id}/candidates`)}
          >
            Ver Candidatos
          </button>
        </div>
      </div>

      <DeleteVacancyModal
        isOpen={isDeleteModalOpen}
        onCloseModal={() => setIsDeleteModalOpen(false)}
        vacancyId={id}
        vacancyTitle={titulo}
      />
    </>
  );
} 