"use client"

import { useState } from 'react';
import type { Profile } from '@/interfaces';
import { LogoutButton } from '@/components/ui/LogoutButton';
import { PersonalInfo } from './PersonalInfo';
import { Experience } from './Experience';
import { Education } from './Education';
import { Skills } from './Skills';

const TABS = [
  { key: 'personal', label: 'Personal' },
  { key: 'experience', label: 'Experiencia' },
  { key: 'education', label: 'Educación' },
  { key: 'skills', label: 'Habilidades' },
];

const ActionButton = ({ onClick, children, variant = 'primary' }: { 
  onClick: () => void, 
  children: React.ReactNode,
  variant?: 'primary' | 'danger'
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors min-h-10 touch-manipulation ${
      variant === 'danger' 
        ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500' 
        : 'text-white bg-blue-800 hover:bg-blue-900 focus:ring-blue-500'
    }`}
    style={{
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation'
    }}
  >
    {children}
  </button>
);

export function Profile({ profile }: { profile: Profile }) {
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleEdit = () => {
    // TODO: Implementar lógica de edición
    console.log('Editar perfil');
  };

  const handleUploadCV = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadSuccess = () => {
    // Refrescar la página para mostrar los datos actualizados
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Dar tiempo para que el toast se muestre
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Mi Perfil</h2>
              <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                <ActionButton onClick={handleUploadCV}>
                  📄 Analizar CV con IA
                </ActionButton>
                <ActionButton onClick={handleEdit}>
                  Editar Perfil
                </ActionButton>
                <LogoutButton />
              </div>
            </div>
          </div>
          <div className="border-b overflow-x-auto sm:overflow-visible">
            <nav className="flex sm:justify-center items-center w-full sm:w-auto">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`whitespace-nowrap px-4 sm:px-11 py-3 sm:py-4 font-medium text-xs sm:text-sm border-b-2 -mb-px ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={{ minWidth: 'max-content' }}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-4 sm:p-6">
            {activeTab === 'personal' && <PersonalInfo profile={profile} />}
            {activeTab === 'experience' && <Experience profile={profile} />}
            {activeTab === 'education' && <Education profile={profile} />}
            {activeTab === 'skills' && <Skills profile={profile} />}
          </div>
        </div>
      </div>

    
    </>
  );
} 