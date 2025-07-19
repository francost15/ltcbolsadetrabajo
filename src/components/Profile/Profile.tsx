"use client"

import { useState } from 'react';
import type { Profile } from '@/interfaces';
import { LogoutButton } from '@/components/ui/LogoutButton';
import { UploadCVModal } from '@/components/Modal/UploadCVModal';
import { PersonalInfo } from './PersonalInfo';
import { Experience } from './Experience';
import { Education } from './Education';
import { Skills } from './Skills';
import { IoCloudUploadOutline, IoSparklesOutline, IoDocumentTextOutline } from 'react-icons/io5';

const TABS = [
  { key: 'personal', label: 'Personal' },
  { key: 'experience', label: 'Experiencia' },
  { key: 'education', label: 'Educación' },
  { key: 'skills', label: 'Habilidades' },
];

const ActionButton = ({ onClick, children, variant = 'primary', icon }: { 
  onClick: () => void, 
  children: React.ReactNode,
  variant?: 'primary' | 'danger',
  icon?: React.ReactNode
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 min-h-12 touch-manipulation shadow-sm hover:shadow-md ${
      variant === 'danger' 
        ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500' 
        : 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500'
    }`}
    style={{
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation'
    }}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </button>
);

export function Profile({ profile }: { profile: Profile }) {
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUploadCV = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    // Refrescar la página para mostrar los datos actualizados
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Dar tiempo para que el toast se muestre
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header con información de IA */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-3">
                    <h1 className="text-xl font-bold text-gray-900">Mi Perfil</h1>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                    Sube tu CV y nuestra <span className="font-semibold text-blue-700">IA avanzada</span> completará automáticamente tu perfil. 
                    Analizará tu experiencia, habilidades y educación para crear un perfil optimizado que atraiga a los mejores empleadores.
                  </p>
                  <div className="flex items-center justify-center lg:justify-start mt-4 text-sm text-gray-500">
                    <IoDocumentTextOutline className="h-4 w-4 mr-1" />
                    Formatos soportados: PDF, DOC, DOCX
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <ActionButton 
                    onClick={handleUploadCV}
                    icon={<IoCloudUploadOutline className="h-5 w-5" />}
                  >
                    Subir CV
                  </ActionButton>
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal del perfil */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Navegación de tabs mejorada */}
            <div className="border-b border-gray-200">
              <nav className="flex justify-center">
                {TABS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`relative px-8 py-4 font-medium text-sm transition-all duration-200 ${
                      activeTab === key
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                    {activeTab === key && (
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 rounded-t-full" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Contenido de tabs */}
            <div className="p-6 sm:p-8">
              {activeTab === 'personal' && <PersonalInfo profile={profile} />}
              {activeTab === 'experience' && <Experience profile={profile} />}
              {activeTab === 'education' && <Education profile={profile} />}
              {activeTab === 'skills' && <Skills profile={profile} />}
            </div>
          </div>
        </div>
      </div>

      <UploadCVModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </>
  );
} 