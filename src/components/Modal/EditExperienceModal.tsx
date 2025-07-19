"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { createExperience, updateExperience } from '@/actions';

const experienceSchema = z.object({
  cargo: z.string().min(1, 'El cargo es requerido'),
  empresa: z.string().min(1, 'La empresa es requerida'),
  fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fechaFin: z.string().optional(),
  trabajoActual: z.boolean().default(false),
  descripcion: z.string().min(1, 'La descripción es requerida'),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface Experience {
  id?: string;
  cargo: string;
  empresa: string;
  fechaInicio: string;
  fechaFin?: string | null;
  trabajoActual: boolean;
  descripcion: string;
}

interface EditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  experience?: Experience | null;
}

export function EditExperienceModal({ isOpen, onClose, onSuccess, experience }: EditExperienceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trabajoActual, setTrabajoActual] = useState(experience?.trabajoActual || false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema) as any, // Solución temporal para el error de tipos
    defaultValues: {
      cargo: experience?.cargo || '',
      empresa: experience?.empresa || '',
      fechaInicio: experience?.fechaInicio ? experience.fechaInicio.split('T')[0] : '',
      fechaFin: experience?.fechaFin ? experience.fechaFin.split('T')[0] : '',
      trabajoActual: experience?.trabajoActual || false,
      descripcion: experience?.descripcion || '',
    }
  });

  const watchTrabajoActual = watch('trabajoActual');

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value.toString());
        }
      });

      const result = experience?.id 
        ? await updateExperience(experience.id, formData)
        : await createExperience(formData);
      
      if (result.ok) {
        toast.success(experience?.id ? 'Experiencia actualizada correctamente' : 'Experiencia agregada correctamente');
        onSuccess();
        onClose();
      } else {
        toast.error(result.message || 'Error al guardar la experiencia');
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error('Error al guardar la experiencia');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {experience?.id ? 'Editar Experiencia' : 'Agregar Experiencia'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo *
            </label>
            <input
              {...register('cargo')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Desarrollador Frontend"
            />
            {errors.cargo && (
              <p className="text-red-500 text-sm mt-1">{errors.cargo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa *
            </label>
            <input
              {...register('empresa')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Tech Company"
            />
            {errors.empresa && (
              <p className="text-red-500 text-sm mt-1">{errors.empresa.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de inicio *
            </label>
            <input
              {...register('fechaInicio')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fechaInicio && (
              <p className="text-red-500 text-sm mt-1">{errors.fechaInicio.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              {...register('trabajoActual')}
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={(e) => setTrabajoActual(e.target.checked)}
            />
            <label className="text-sm text-gray-700">
              Trabajo actual
            </label>
          </div>

          {!watchTrabajoActual && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de fin
              </label>
              <input
                {...register('fechaFin')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fechaFin && (
                <p className="text-red-500 text-sm mt-1">{errors.fechaFin.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              {...register('descripcion')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe tus responsabilidades y logros..."
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                experience?.id ? 'Actualizar' : 'Agregar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 