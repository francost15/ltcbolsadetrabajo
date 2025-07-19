"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { 
  createLanguage, updateLanguage, deleteLanguage,
  createCertification, updateCertification, deleteCertification 
} from '@/actions';
import type { Profile } from '@/interfaces';

// Schemas
const languageSchema = z.object({
  nombre: z.string().min(1, 'El nombre del idioma es requerido'),
  nivel: z.enum(['NATIVO', 'AVANZADO_C2', 'AVANZADO_C1', 'INTERMEDIO_B2', 'INTERMEDIO_B1', 'BASICO_A2', 'BASICO_A1']),
});

const certificationSchema = z.object({
  nombre: z.string().min(1, 'El nombre de la certificación es requerido'),
  entidadEmisora: z.string().min(1, 'La entidad emisora es requerida'),
  anioObtencion: z.coerce.number().min(1900, 'Año inválido').max(new Date().getFullYear(), 'El año no puede ser futuro'),
});

type LanguageFormData = z.infer<typeof languageSchema>;
type CertificationFormData = z.infer<typeof certificationSchema>;

const NIVEL_LABELS = {
  NATIVO: 'Nativo',
  AVANZADO_C2: 'Avanzado (C2)',
  AVANZADO_C1: 'Avanzado (C1)',
  INTERMEDIO_B2: 'Intermedio Alto (B2)',
  INTERMEDIO_B1: 'Intermedio (B1)',
  BASICO_A2: 'Básico Alto (A2)',
  BASICO_A1: 'Básico (A1)',
};

export function Skills({ profile }: { profile: Profile }) {
  // Language state
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [editingLanguageId, setEditingLanguageId] = useState<string | null>(null);
  
  // Certification state
  const [isAddingCertification, setIsAddingCertification] = useState(false);
  const [editingCertificationId, setEditingCertificationId] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Language form
  const languageForm = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
  });

  // Certification form
  const certificationForm = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
  });

  // Language functions
  const startAddingLanguage = () => {
    languageForm.reset({ nombre: '', nivel: 'BASICO_A1' });
    setIsAddingLanguage(true);
    setEditingLanguageId(null);
  };

  const startEditingLanguage = (language: any) => {
    languageForm.reset({
      nombre: language.nombre,
      nivel: language.nivel,
    });
    setEditingLanguageId(language.id);
    setIsAddingLanguage(false);
  };

  const cancelLanguageEditing = () => {
    setIsAddingLanguage(false);
    setEditingLanguageId(null);
    languageForm.reset();
  };

  const onSubmitLanguage = async (data: LanguageFormData) => {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      let result;
      if (editingLanguageId) {
        result = await updateLanguage(editingLanguageId, formData);
      } else {
        result = await createLanguage(formData);
      }
      
      if (result.ok) {
        toast.success(editingLanguageId ? 'Idioma actualizado correctamente' : 'Idioma agregado correctamente');
        cancelLanguageEditing();
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(result.message || 'Error al guardar el idioma');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar el idioma');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLanguage = async (languageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este idioma?')) return;

    try {
      const result = await deleteLanguage(languageId);
      if (result.ok) {
        toast.success('Idioma eliminado correctamente');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(result.message || 'Error al eliminar el idioma');
      }
    } catch (error) {
      toast.error('Error al eliminar el idioma');
    }
  };

  // Certification functions
  const startAddingCertification = () => {
    certificationForm.reset({ nombre: '', entidadEmisora: '', anioObtencion: new Date().getFullYear() });
    setIsAddingCertification(true);
    setEditingCertificationId(null);
  };

  const startEditingCertification = (certification: any) => {
    certificationForm.reset({
      nombre: certification.nombre,
      entidadEmisora: certification.entidadEmisora,
      anioObtencion: certification.anioObtencion,
    });
    setEditingCertificationId(certification.id);
    setIsAddingCertification(false);
  };

  const cancelCertificationEditing = () => {
    setIsAddingCertification(false);
    setEditingCertificationId(null);
    certificationForm.reset();
  };

  const onSubmitCertification = async (data: CertificationFormData) => {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      let result;
      if (editingCertificationId) {
        result = await updateCertification(editingCertificationId, formData);
      } else {
        result = await createCertification(formData);
      }
      
      if (result.ok) {
        toast.success(editingCertificationId ? 'Certificación actualizada correctamente' : 'Certificación agregada correctamente');
        cancelCertificationEditing();
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(result.message || 'Error al guardar la certificación');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar la certificación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCertification = async (certificationId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta certificación?')) return;

    try {
      const result = await deleteCertification(certificationId);
      if (result.ok) {
        toast.success('Certificación eliminada correctamente');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(result.message || 'Error al eliminar la certificación');
      }
    } catch (error) {
      toast.error('Error al eliminar la certificación');
    }
  };

  return (
    <div className="space-y-8">
      {/* Idiomas Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Idiomas</h3>
          <button
            onClick={startAddingLanguage}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            disabled={isAddingLanguage || editingLanguageId !== null}
          >
            ➕ Agregar Idioma
          </button>
        </div>

        {/* Add Language Form */}
        {isAddingLanguage && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <form onSubmit={languageForm.handleSubmit(onSubmitLanguage)} className="space-y-4">
              <h4 className="font-medium text-gray-900">Nuevo Idioma</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idioma *</label>
                  <input
                    {...languageForm.register('nombre')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Inglés, Francés, Alemán..."
                  />
                  {languageForm.formState.errors.nombre && (
                    <p className="text-red-500 text-sm mt-1">{languageForm.formState.errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel *</label>
                  <select
                    {...languageForm.register('nivel')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(NIVEL_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  {languageForm.formState.errors.nivel && (
                    <p className="text-red-500 text-sm mt-1">{languageForm.formState.errors.nivel.message}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={cancelLanguageEditing}
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
                  {isSubmitting ? 'Guardando...' : 'Guardar Idioma'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Languages List */}
        <div className="space-y-2">
          {profile.idiomas && profile.idiomas.length > 0 ? (
            profile.idiomas.map((idioma) => (
              <div key={idioma.id} className="border border-gray-200 rounded-lg p-3">
                {editingLanguageId === idioma.id ? (
                  <form onSubmit={languageForm.handleSubmit(onSubmitLanguage)} className="space-y-4">
                    <h4 className="font-medium text-gray-900">Editando Idioma</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Idioma *</label>
                        <input
                          {...languageForm.register('nombre')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nivel *</label>
                        <select
                          {...languageForm.register('nivel')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          {Object.entries(NIVEL_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={cancelLanguageEditing}
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
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-900">{idioma.nombre}</span>
                      <span className="ml-2 text-gray-600">- {NIVEL_LABELS[idioma.nivel as keyof typeof NIVEL_LABELS]}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditingLanguage(idioma)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        disabled={isAddingLanguage || editingLanguageId !== null}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteLanguage(idioma.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                        disabled={isAddingLanguage || editingLanguageId !== null}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No hay idiomas registrados</p>
              <p className="text-sm">Haz clic en "Agregar Idioma" para comenzar</p>
            </div>
          )}
        </div>
      </div>

      {/* Certificaciones Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Certificaciones</h3>
          <button
            onClick={startAddingCertification}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            disabled={isAddingCertification || editingCertificationId !== null}
          >
            ➕ Agregar Certificación
          </button>
        </div>

        {/* Add Certification Form */}
        {isAddingCertification && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <form onSubmit={certificationForm.handleSubmit(onSubmitCertification)} className="space-y-4">
              <h4 className="font-medium text-gray-900">Nueva Certificación</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    {...certificationForm.register('nombre')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: AWS Certified Solutions Architect"
                  />
                  {certificationForm.formState.errors.nombre && (
                    <p className="text-red-500 text-sm mt-1">{certificationForm.formState.errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entidad Emisora *</label>
                  <input
                    {...certificationForm.register('entidadEmisora')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Amazon Web Services"
                  />
                  {certificationForm.formState.errors.entidadEmisora && (
                    <p className="text-red-500 text-sm mt-1">{certificationForm.formState.errors.entidadEmisora.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año de Obtención *</label>
                  <input
                    {...certificationForm.register('anioObtencion')}
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  {certificationForm.formState.errors.anioObtencion && (
                    <p className="text-red-500 text-sm mt-1">{certificationForm.formState.errors.anioObtencion.message}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={cancelCertificationEditing}
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
                  {isSubmitting ? 'Guardando...' : 'Guardar Certificación'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Certifications List */}
        <div className="space-y-4">
          {profile.certificaciones && profile.certificaciones.length > 0 ? (
            profile.certificaciones.map((cert) => (
              <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                {editingCertificationId === cert.id ? (
                  <form onSubmit={certificationForm.handleSubmit(onSubmitCertification)} className="space-y-4">
                    <h4 className="font-medium text-gray-900">Editando Certificación</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                        <input
                          {...certificationForm.register('nombre')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Entidad Emisora *</label>
                        <input
                          {...certificationForm.register('entidadEmisora')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Año de Obtención *</label>
                        <input
                          {...certificationForm.register('anioObtencion')}
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={cancelCertificationEditing}
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
                        <h4 className="font-semibold text-gray-900">{cert.nombre}</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditingCertification(cert)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            disabled={isAddingCertification || editingCertificationId !== null}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDeleteCertification(cert.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                            disabled={isAddingCertification || editingCertificationId !== null}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700">{cert.entidadEmisora}</p>
                      <p className="text-gray-600 text-sm">{cert.anioObtencion}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay certificaciones registradas</p>
              <p className="text-sm">Haz clic en "Agregar Certificación" para comenzar</p>
            </div>
          )}
        </div>
      </div>

      {/* Preferencias Laborales - Solo lectura por ahora */}
      {profile.preferencias && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Preferencias Laborales</h3>
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="text-gray-700 font-medium">Tipos de Empleo</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.preferencias.tiposEmpleo.map((tipo, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {tipo}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-700 font-medium">Modalidades de Trabajo</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.preferencias.modalidadesTrabajo.map((modalidad, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {modalidad}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
