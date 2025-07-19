"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { createExperience, updateExperience, deleteExperience } from '@/actions';
import type { Profile } from '@/interfaces';

const experienceSchema = z.object({
  cargo: z.string().min(1, 'El cargo es requerido'),
  empresa: z.string().min(1, 'La empresa es requerida'),
  fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fechaFin: z.string().optional(),
  trabajoActual: z.boolean().default(false),
  descripcion: z.string().min(1, 'La descripción es requerida'),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface ExperienceItem {
  id: string;
  cargo: string;
  empresa: string;
  fechaInicio: string;
  fechaFin?: string | null;
  trabajoActual: boolean;
  descripcion: string;
}

export function Experience({ profile }: { profile: Profile }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema) as any, // Solución temporal para el error de tipos
    defaultValues: {
      trabajoActual: false,
    },
  });

  const watchTrabajoActual = watch('trabajoActual', false);

  const startAdding = () => {
    reset({
      cargo: '',
      empresa: '',
      fechaInicio: '',
      fechaFin: '',
      trabajoActual: false,
      descripcion: '',
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const startEditing = (experience: ExperienceItem) => {
    reset({
      cargo: experience.cargo,
      empresa: experience.empresa,
      fechaInicio: experience.fechaInicio.split('T')[0],
      fechaFin: experience.fechaFin ? experience.fechaFin.split('T')[0] : '',
      trabajoActual: experience.trabajoActual,
      descripcion: experience.descripcion,
    });
    setEditingId(experience.id);
    setIsAdding(false);
  };

  const cancelEditing = () => {
    setIsAdding(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          formData.append(key, value.toString());
        }
      });

      let result;
      if (editingId) {
        result = await updateExperience(editingId, formData);
      } else {
        result = await createExperience(formData);
      }
      
      if (result.ok) {
        toast.success(editingId ? 'Experiencia actualizada correctamente' : 'Experiencia agregada correctamente');
        cancelEditing();
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(result.message || 'Error al guardar la experiencia');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar la experiencia');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (experienceId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) {
      return;
    }

    try {
      const result = await deleteExperience(experienceId);
      if (result.ok) {
        toast.success('Experiencia eliminada correctamente');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(result.message || 'Error al eliminar la experiencia');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar la experiencia');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Experiencia Laboral</h3>
        <button
          onClick={startAdding}
          className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          disabled={isAdding || editingId !== null}
        >
          ➕ Agregar Experiencia
        </button>
      </div>

      {/* Formulario para agregar nueva experiencia */}
      {isAdding && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h4 className="font-medium text-gray-900">Nueva Experiencia</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo *</label>
                <input
                  {...register('cargo')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Desarrollador Frontend"
                />
                {errors.cargo && <p className="text-red-500 text-sm mt-1">{errors.cargo.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
                <input
                  {...register('empresa')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Tech Company"
                />
                {errors.empresa && <p className="text-red-500 text-sm mt-1">{errors.empresa.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio *</label>
                <input
                  {...register('fechaInicio')}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.fechaInicio && <p className="text-red-500 text-sm mt-1">{errors.fechaInicio.message}</p>}
              </div>

              {!watchTrabajoActual && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
                  <input
                    {...register('fechaFin')}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.fechaFin && <p className="text-red-500 text-sm mt-1">{errors.fechaFin.message}</p>}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                {...register('trabajoActual')}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Trabajo actual</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea
                {...register('descripcion')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Describe tus responsabilidades y logros..."
              />
              {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>}
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={cancelEditing}
                className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Experiencia'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de experiencias existentes */}
      <div className="space-y-4">
        {profile.experiencia && profile.experiencia.length > 0 ? (
          profile.experiencia.map((exp) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
              {editingId === exp.id ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <h4 className="font-medium text-gray-900">Editando Experiencia</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cargo *</label>
                      <input
                        {...register('cargo')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.cargo && <p className="text-red-500 text-sm mt-1">{errors.cargo.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
                      <input
                        {...register('empresa')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.empresa && <p className="text-red-500 text-sm mt-1">{errors.empresa.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio *</label>
                      <input
                        {...register('fechaInicio')}
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.fechaInicio && <p className="text-red-500 text-sm mt-1">{errors.fechaInicio.message}</p>}
                    </div>

                    {!watchTrabajoActual && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
                        <input
                          {...register('fechaFin')}
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.fechaFin && <p className="text-red-500 text-sm mt-1">{errors.fechaFin.message}</p>}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      {...register('trabajoActual')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">Trabajo actual</label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                    <textarea
                      {...register('descripcion')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Guardando...' : 'Actualizar'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{exp.cargo}</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(exp)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          disabled={isAdding || editingId !== null}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          disabled={isAdding || editingId !== null}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium">{exp.empresa}</p>
                    <p className="text-gray-600 text-sm">
                      {formatDate(exp.fechaInicio)} - {exp.trabajoActual ? 'Presente' : (exp.fechaFin ? formatDate(exp.fechaFin) : 'No especificado')}
                    </p>
                    <p className="text-gray-700 mt-2">{exp.descripcion}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No hay experiencias laborales registradas</p>
            <p className="text-sm">Haz clic en "Agregar Experiencia" para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
}
