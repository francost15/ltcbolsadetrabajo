"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { editProfile } from '@/actions';
import type { Profile } from '@/interfaces';

export function PersonalInfo({ profile }: { profile: Profile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      nombre: profile.nombre || '',
      telefono: profile.telefono || '',
      linkedinUrl: profile.linkedinUrl || '',
      portfolioUrl: profile.portfolioUrl || '',
      resumenProfesional: profile.resumenProfesional || '',
      tituloProfesional: profile.tituloProfesional || '',
      ciudad: profile.ciudad || '',
      estado: profile.estado || '',
      pais: profile.pais || '',
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = await editProfile(formData);
      
      if (result.ok) {
        toast.success('Información actualizada correctamente');
        setIsEditing(false);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(result.message || 'Error al actualizar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Editar Información Personal</h3>
          <div className="space-x-2">
            <button
              type="button"
              onClick={handleCancel}
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
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              {...register('nombre')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título Profesional</label>
            <input
              {...register('tituloProfesional')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              {...register('telefono')}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input
              {...register('linkedinUrl')}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portafolio</label>
            <input
              {...register('portfolioUrl')}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input
              {...register('ciudad')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado/Provincia</label>
            <input
              {...register('estado')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
            <input
              {...register('pais')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resumen Profesional</label>
          <textarea
            {...register('resumenProfesional')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Describe tu experiencia y habilidades..."
          />
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
        >
          ✏️ Editar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField label="Nombre" value={profile.nombre} />
        <InfoField label="Título Profesional" value={profile.tituloProfesional} />
        <InfoField label="Teléfono" value={profile.telefono} />
        <InfoField label="Ciudad" value={profile.ciudad} />
        <InfoField label="Estado/Provincia" value={profile.estado} />
        <InfoField label="País" value={profile.pais} />
      </div>

      {profile.linkedinUrl && (
        <InfoField 
          label="LinkedIn" 
          value={
            <a 
              href={profile.linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Ver perfil de LinkedIn
            </a>
          } 
        />
      )}

      {profile.portfolioUrl && (
        <InfoField 
          label="Portafolio" 
          value={
            <a 
              href={profile.portfolioUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Ver portafolio
            </a>
          } 
        />
      )}

      {profile.resumenProfesional && (
        <InfoField label="Resumen Profesional" value={profile.resumenProfesional} />
      )}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string | null | React.ReactNode }) {
  if (!value) return null;
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 text-sm text-gray-900">
        {typeof value === 'string' ? value : value}
      </div>
    </div>
  );
}
