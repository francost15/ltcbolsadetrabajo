"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { createEducation, updateEducation, deleteEducation } from '@/actions';
import type { Profile } from '@/interfaces';

const educationSchema = z.object({
  institucion: z.string().min(1, 'La institución es requerida'),
  titulo: z.string().min(1, 'El título es requerido'),
  campoEstudio: z.string().min(1, 'El campo de estudio es requerido'),
  fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fechaFin: z.string().optional(),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationItem {
  id: string;
  institucion: string;
  titulo: string;
  campoEstudio: string;
  fechaInicio: string;
  fechaFin?: string | null;
}

export function Education({ profile }: { profile: Profile }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
  });

  const startAdding = () => {
    reset({
      institucion: '',
      titulo: '',
      campoEstudio: '',
      fechaInicio: '',
      fechaFin: '',
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const startEditing = (education: EducationItem) => {
    reset({
      institucion: education.institucion,
      titulo: education.titulo,
      campoEstudio: education.campoEstudio,
      fechaInicio: education.fechaInicio.split('T')[0],
      fechaFin: education.fechaFin ? education.fechaFin.split('T')[0] : '',
    });
    setEditingId(education.id);
    setIsAdding(false);
  };

  const cancelEditing = () => {
    setIsAdding(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = async (data: EducationFormData) => {
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
        result = await updateEducation(editingId, formData);
      } else {
        result = await createEducation(formData);
      }
      
      if (result.ok) {
        toast.success(editingId ? 'Educación actualizada correctamente' : 'Educación agregada correctamente');
        cancelEditing();
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(result.message || 'Error al guardar la educación');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar la educación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (educationId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta educación?')) {
      return;
    }

    try {
      const result = await deleteEducation(educationId);
      if (result.ok) {
        toast.success('Educación eliminada correctamente');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(result.message || 'Error al eliminar la educación');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar la educación');
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
        <h3 className="text-lg font-medium text-gray-900">Educación</h3>
        <button
          onClick={startAdding}
          className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          disabled={isAdding || editingId !== null}
        >
          ➕ Agregar Educación
        </button>
      </div>

      {/* Formulario para agregar nueva educación */}
      {isAdding && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h4 className="font-medium text-gray-900">Nueva Educación</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institución *</label>
                <input
                  {...register('institucion')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Universidad Nacional"
                />
                {errors.institucion && <p className="text-red-500 text-sm mt-1">{errors.institucion.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  {...register('titulo')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Licenciatura en Ingeniería"
                />
                {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campo de estudio *</label>
                <input
                  {...register('campoEstudio')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Ingeniería de Sistemas"
                />
                {errors.campoEstudio && <p className="text-red-500 text-sm mt-1">{errors.campoEstudio.message}</p>}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de graduación</label>
                <input
                  {...register('fechaFin')}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.fechaFin && <p className="text-red-500 text-sm mt-1">{errors.fechaFin.message}</p>}
              </div>
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
                {isSubmitting ? 'Guardando...' : 'Guardar Educación'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de educaciones existentes */}
      <div className="space-y-4">
        {profile.educacion && profile.educacion.length > 0 ? (
          profile.educacion.map((edu) => (
            <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
              {editingId === edu.id ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <h4 className="font-medium text-gray-900">Editando Educación</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institución *</label>
                      <input
                        {...register('institucion')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.institucion && <p className="text-red-500 text-sm mt-1">{errors.institucion.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                      <input
                        {...register('titulo')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Campo de estudio *</label>
                      <input
                        {...register('campoEstudio')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.campoEstudio && <p className="text-red-500 text-sm mt-1">{errors.campoEstudio.message}</p>}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de graduación</label>
                      <input
                        {...register('fechaFin')}
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.fechaFin && <p className="text-red-500 text-sm mt-1">{errors.fechaFin.message}</p>}
                    </div>
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
                      <h4 className="font-semibold text-gray-900">{edu.titulo}</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(edu)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          disabled={isAdding || editingId !== null}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(edu.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          disabled={isAdding || editingId !== null}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium">{edu.institucion}</p>
                    <p className="text-gray-600">{edu.campoEstudio}</p>
                    <p className="text-gray-600 text-sm">
                      {formatDate(edu.fechaInicio)} - {edu.fechaFin ? formatDate(edu.fechaFin) : 'En curso'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No hay registros de educación</p>
            <p className="text-sm">Haz clic en "Agregar Educación" para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
}
