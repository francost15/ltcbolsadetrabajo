"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import RejectVacancyModal from "../Modal/RejectVacancyModal";
import ApplyVacancyModal from "../Modal/ApplyVacancyModal";
import { MatchInfo } from "./MatchInfo";

interface Job {
  id: string;
  match: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  description?: string;
  tipoEmpleo?: string;
  fechaPublicacion?: string;
  analisis?: string | null;
  areas_mejora?: string[] | null;
  habilidades_match?: any;
  yaPostulado?: boolean;
  fechaPostulacion?: Date | null;
  empresaInteresada?: boolean;
  onReject?: (id: string) => void;
  onApplicationSuccess?: () => void; // Nueva prop para notificar postulación exitosa
}

const JobHeader = ({ match, title, company, location, salary, analisis, areas_mejora, habilidades_match }: Pick<Job, 'match' | 'title' | 'company' | 'location' | 'salary' | 'analisis' | 'areas_mejora' | 'habilidades_match'>) => (
  <div className="space-y-3">
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center bg-gray-100 rounded-full w-14 h-14">
        <span className="flex items-center justify-center w-10 h-10 text-xl text-gray-600 bg-gray-200 rounded-full">👤</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold leading-tight text-gray-900">{title}</h3>
        </div>
        <div className="text-sm font-medium text-gray-700">{company}</div>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
          <span>{location}</span>
          <span>{salary}</span>
        </div>
      </div>
    </div>
    <MatchInfo 
      match={match} 
      analisis={analisis}
      areas_mejora={areas_mejora}
      habilidades_match={habilidades_match}
      showDetails={false}
    />
  </div>
);

export const JobCards = ({
  id,
  match,
  title,
  company,
  location,
  salary,
  analisis,
  areas_mejora,
  habilidades_match,
  yaPostulado,
  fechaPostulacion,
  empresaInteresada,
  onApplicationSuccess,
  onReject,
}: Job) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const router = useRouter();

  // Determinar el estado de la postulación
  const getApplicationStatus = () => {
    if (yaPostulado && empresaInteresada) {
      return { status: 'interested', label: 'Empresa interesada', color: 'bg-green-600 hover:bg-green-700' };
    } else if (yaPostulado) {
      return { status: 'applied', label: 'Ya postulado', color: 'bg-gray-600 hover:bg-gray-700' };
    }
    return { status: 'available', label: 'Postularse', color: 'bg-blue-800 hover:bg-blue-900' };
  };

  const applicationStatus = getApplicationStatus();

  const handleApplicationSuccess = () => {
    // Cerrar el modal
    setIsApplyModalOpen(false);
    // Notificar al componente padre para que actualice los datos
    if (onApplicationSuccess) {
      onApplicationSuccess();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-6 mb-6 transition-shadow bg-white border border-gray-200 rounded-2xl hover:shadow-xl">
        <JobHeader 
          match={match}
          title={title}
          company={company}
          location={location}
          salary={salary}
          analisis={analisis}
          areas_mejora={areas_mejora}
          habilidades_match={habilidades_match}
        />
        
        {/* Mostrar información adicional si ya se postuló */}
        {yaPostulado && (
          <div className={`p-3 rounded-lg ${empresaInteresada ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${empresaInteresada ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className={`text-sm font-medium ${empresaInteresada ? 'text-green-800' : 'text-gray-800'}`}>
                  {empresaInteresada ? 'La empresa está interesada en tu perfil' : 'Postulación enviada'}
                </span>
              </div>
              {fechaPostulacion && (
                <span className="text-xs text-gray-500">
                  {new Date(fechaPostulacion).toLocaleDateString('es-ES')}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-3 mt-2">
          {!yaPostulado && (
            <button
              title="Rechazar"
              aria-label="Rechazar"
              name="Rechazar"
              className="flex-1 py-2 font-medium text-red-700 transition-colors border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setIsRejectModalOpen(true)}
            >
              Rechazar
            </button>
          )}
          <button
            title="Ver más"
            aria-label="Ver más"
            name="Ver más"
            className={`${yaPostulado ? 'flex-1' : 'flex-1'} py-2 font-medium text-gray-700 transition-colors border border-gray-200 rounded-lg hover:bg-gray-100`}
            onClick={() => router.push(`/home/vancancy/${id}`)}
          >
            Ver más
          </button>
          <button
            title={applicationStatus.label}
            aria-label={applicationStatus.label}
            name={applicationStatus.label}
            className={`flex-1 py-2 font-semibold text-white transition-colors rounded-lg shadow ${applicationStatus.color} ${yaPostulado ? 'cursor-default' : ''}`}
            onClick={yaPostulado ? undefined : () => setIsApplyModalOpen(true)}
            disabled={yaPostulado}
          >
            {applicationStatus.label}
          </button>
        </div>
      </div>

      {!yaPostulado && (
        <>
          <RejectVacancyModal
            isOpen={isRejectModalOpen}
            vacancyId={id}
            vacancyTitle={title}
            onCloseModal={() => setIsRejectModalOpen(false)}
            onConfirmReject={() => {
              if (onReject) onReject(id);
              setIsRejectModalOpen(false);
            }}
          />

          <ApplyVacancyModal
            isOpen={isApplyModalOpen}
            vacancyId={id}
            vacancyTitle={title}
            onCloseModal={() => setIsApplyModalOpen(false)}
            onApplicationSuccess={handleApplicationSuccess}
          />
        </>
      )}
    </>
  );
};
