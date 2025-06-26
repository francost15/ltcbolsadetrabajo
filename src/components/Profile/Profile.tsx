"use client"

import { useState } from 'react';


import type { Profile } from '@/interfaces';
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

const ActionButton = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    {children}
  </button>
);

export function Profile({ profile }: { profile: Profile }) {
  const [activeTab, setActiveTab] = useState<string>('personal');

  const handleEdit = () => {
    // TODO: Implementar lógica de edición
    console.log('Editar perfil');
  };

  const handleUploadCV = () => {
    // TODO: Implementar lógica de subida de CV
    console.log('Subir CV');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm">
        <div className="p-4 sm:p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Mi Perfil</h2>
          <div className="flex gap-3">
            <ActionButton onClick={handleUploadCV}>
              Subir CV
            </ActionButton>
            <ActionButton onClick={handleEdit}>
              Editar Perfil
            </ActionButton>
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
  );
} 