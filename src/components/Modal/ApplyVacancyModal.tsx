'use client';

import { useState } from 'react';
import { applyToVacancy } from '@/actions/vacancies/applyToVacancy';

interface ApplyVacancyModalProps {
  isOpen: boolean;
  vacancyId: string;
  vacancyTitle: string;
  onCloseModal?: () => void;
  onApplicationSuccess?: () => void; // Nueva prop para notificar éxito
}

export default function ApplyVacancyModal({ 
  isOpen, 
  vacancyId, 
  vacancyTitle, 
  onCloseModal,
  onApplicationSuccess 
}: ApplyVacancyModalProps) {
  const [isApplying, setIsApplying] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (onCloseModal) onCloseModal();
  };

  const handleApply = async () => {
    try {
      setIsApplying(true);
      const response = await applyToVacancy(vacancyId);
      
      if (response.ok) {
        // Mostrar mensaje de éxito
        alert(`¡Felicitaciones! Te has postulado exitosamente a la vacante "${vacancyTitle}". La empresa podrá ver tu perfil.`);
        
        // Cerrar modal
        handleClose();
        
        // Notificar al componente padre para actualizar los datos
        if (onApplicationSuccess) {
          onApplicationSuccess();
        }
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error al postularse a la vacante:', error);
      alert('Ha ocurrido un error al postularte a la vacante. Por favor, intenta de nuevo.');
    } finally {
      setIsApplying(false);
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
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100/80 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Postularse a Vacante
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    ¿Estás seguro que deseas postularte a la vacante &quot;{vacancyTitle}&quot;? 
                  </p>
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Al postularte:</strong>
                    </p>
                    <ul className="mt-1 text-sm text-blue-700 list-disc list-inside space-y-1">
                      <li>La empresa podrá ver tu perfil completo</li>
                      <li>Tendrás acceso a tu CV y experiencias</li>
                      <li>Te notificaremos si la empresa muestra interés</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              disabled={isApplying}
              onClick={handleApply}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApplying ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando postulación...
                </span>
              ) : (
                'Confirmar postulación'
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isApplying}
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