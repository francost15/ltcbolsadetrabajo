"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import RejectVacancyModal from "../Modal/RejectVacancyModal";
import ApplyVacancyModal from "../Modal/ApplyVacancyModal";

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
  onReject?: (id: string) => void;
}

const JobHeader = ({ match, title, company, location, salary }: Pick<Job, 'match' | 'title' | 'company' | 'location' | 'salary'>) => (
  <div className="flex items-center gap-4">
    <div className="relative flex items-center justify-center bg-gray-100 rounded-full w-14 h-14">
      <span className="absolute px-2 py-1 text-xs font-bold text-white bg-blue-800 rounded-full shadow -top-2 -left-2">{match}%</span>
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
);

export const JobCards = ({
  id,
  match,
  title,
  company,
  location,
  salary,
}: Job) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col gap-4 p-6 mb-6 transition-shadow bg-white border border-gray-200 rounded-2xl hover:shadow-xl">
        <JobHeader 
          match={match}
          title={title}
          company={company}
          location={location}
          salary={salary}
        />
        
        <div className="flex gap-3 mt-2">
          <button
            title="Rechazar"
            aria-label="Rechazar"
            name="Rechazar"
            className="flex-1 py-2 font-medium text-red-700 transition-colors border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setIsRejectModalOpen(true)}
          >
            Rechazar
          </button>
          <button
            title="Ver más"
            aria-label="Ver más"
            name="Ver más"
            className="flex-1 py-2 font-medium text-gray-700 transition-colors border border-gray-200 rounded-lg hover:bg-gray-100"
            onClick={() => router.push(`/home/vancancy/${id}`)}
          >
            Ver más
          </button>
          <button
            title="Postularse"
            aria-label="Postularse"
            name="Postularse"
            className="flex-1 py-2 font-semibold text-white transition-colors bg-blue-800 rounded-lg shadow hover:bg-blue-900"
            onClick={() => setIsApplyModalOpen(true)}
          >
            Postularse
          </button>
        </div>
      </div>

      <RejectVacancyModal
        isOpen={isRejectModalOpen}
        vacancyId={id}
        vacancyTitle={title}
        onCloseModal={() => setIsRejectModalOpen(false)}
      />

      <ApplyVacancyModal
        isOpen={isApplyModalOpen}
        vacancyId={id}
        vacancyTitle={title}
        onCloseModal={() => setIsApplyModalOpen(false)}
      />
    </>
  );
};
