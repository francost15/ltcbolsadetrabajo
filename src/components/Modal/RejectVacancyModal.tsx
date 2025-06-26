'use client';

import { useState } from 'react';
import { rejectVacancy } from '@/actions/vacancies/rejectVacancy';

interface RejectVacancyModalProps {
  isOpen: boolean;
  vacancyId: string;
  vacancyTitle: string;
  onCloseModal?: () => void;
}

export default function RejectVacancyModal({ isOpen, vacancyId, vacancyTitle, onCloseModal }: RejectVacancyModalProps) {
  const [isRejecting, setIsRejecting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (onCloseModal) onCloseModal();
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      const response = await rejectVacancy(vacancyId);
      
      if (response.ok) {
        alert(`Has rechazado exitosamente la vacante "${vacancyTitle}"`);
        handleClose();
        window.location.reload();
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error al rechazar la vacante:', error);
      alert('Ha ocurrido un error al rechazar la vacante. Por favor, intenta de nuevo.');
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Fondo con blur */}
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" 
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white/90 backdrop-blur-sm text-left shadow-xl transition-all sm:w-full sm:max-w-lg">
          <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100/80 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Rechazar Vacante
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    ¿Estás seguro que deseas rechazar la vacante "{vacancyTitle}"? Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              disabled={isRejecting}
              onClick={handleReject}
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRejecting ? 'Rechazando...' : 'Rechazar'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isRejecting}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 