'use client';

import { useState } from 'react';
import { deleteVacancy } from '@/actions';

interface DeleteVacancyModalProps {
  isOpen: boolean;
  vacancyId: string;
  vacancyTitle: string;
  onCloseModal?: () => void;
}

export default function DeleteVacancyModal({ isOpen, vacancyId, vacancyTitle, onCloseModal }: DeleteVacancyModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (onCloseModal) onCloseModal();
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteVacancy(vacancyId);
      
      if (response.ok) {
        // Cerrar el modal
        handleClose();
        // Recargar la página
        window.location.reload();
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Error al eliminar la vacante:', error);
      alert('Error al eliminar la vacante');
    } finally {
      setIsDeleting(false);
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Eliminar Vacante
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    ¿Estás seguro que deseas eliminar la vacante &quot;{vacancyTitle}&quot;? Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50/80 backdrop-blur-sm px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
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