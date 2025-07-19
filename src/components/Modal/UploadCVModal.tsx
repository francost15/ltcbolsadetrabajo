"use client"

import { useState } from 'react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS, TIMEOUTS, createRequest } from '@/config/api';

interface UploadCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadCVModal({ isOpen, onClose, onSuccess }: UploadCVModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (selectedFile) {
      // Validar tipo de archivo
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Solo se permiten archivos PDF, DOC o DOCX');
        return;
      }

      // Validar tamaño (10MB máximo)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('El archivo es demasiado grande. Máximo 10MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Por favor selecciona un archivo');
      return;
    }

    setIsUploading(true);

    try {
      // Obtener sesión de usuario
      const sessionResponse = await fetch('/api/auth/session');
      const session = await sessionResponse.json();
      
      if (!session?.user?.id) {
        throw new Error('Usuario no autenticado');
      }

      console.log('🐍 Subiendo CV a API de Python...');
      console.log('📄 Usuario ID:', session.user.id);
      console.log('📎 Archivo:', file.name, file.type, file.size);

      // Crear FormData
      const formData = new FormData();
      formData.append('file', file);

      // Subir a la API de Python
      const response = await createRequest(
        API_ENDPOINTS.UPLOAD_CV(session.user.id),
        {
          method: 'POST',
          body: formData,
          headers: {
            // No incluir Content-Type para FormData - el browser lo maneja automáticamente
          }
        },
        TIMEOUTS.UPLOAD
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en upload:', response.status, errorText);
        
        if (response.status === 400) {
          if (errorText.includes('archivo')) {
            throw new Error('Error en el archivo: ' + errorText);
          } else if (errorText.includes('formato')) {
            throw new Error('Formato de archivo no válido');
          }
        } else if (response.status === 404) {
          throw new Error('Endpoint no encontrado en la API');
        } else if (response.status >= 500) {
          throw new Error('Error del servidor en la API de Python');
        }
        
        throw new Error(`Error ${response.status}: ${errorText || 'Error desconocido'}`);
      }

      const result = await response.json();
      console.log('✅ CV procesado exitosamente:', result);

      toast.success('🎉 CV procesado exitosamente con IA');
      onSuccess();
      onClose();
      setFile(null);

    } catch (error) {
      console.error('❌ Error subiendo CV:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('abort')) {
          toast.error('🔌 No se pudo conectar con la API de Python.\n\nVerifica que esté corriendo en puerto 8000');
        } else if (error.message === 'Usuario no autenticado') {
          toast.error('❌ Error de autenticación. Recarga la página');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Error desconocido al procesar CV');
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            🐍 Analizar CV con API de Python
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isUploading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona tu CV
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="cv-upload"
                disabled={isUploading}
              />
              <label 
                htmlFor="cv-upload" 
                className="cursor-pointer flex flex-col items-center"
              >
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-600">
                  {file ? file.name : 'Haz clic para seleccionar archivo'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX (máx. 10MB)
                </span>
              </label>
            </div>
          </div>

          {file && (
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-green-800">
                  Archivo seleccionado: {file.name}
                </span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium">Tu API de Python extraerá:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Información personal y contacto</li>
                  <li>Experiencia laboral</li>
                  <li>Educación y certificaciones</li>
                  <li>Habilidades técnicas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isUploading}
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              '🐍 Procesar con Python'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 