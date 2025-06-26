"use client"

import { useEffect, useState } from "react";
import { JobCards, Loading } from "@/components";

import { JobCardVacancy, VacantesInterface } from "@/interfaces";
import { getAvailableVacancies } from "@/actions/vacancies/getAvailableVacancies";
import { getMyApplications } from "@/actions/vacancies/getMyApplications";
import { CategoriaVacante } from "@/generated/prisma";

const transformVacancyToJobCard = (vacancy: {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: CategoriaVacante;
  empresa: {
    nombre: string;
    logo: string | null;
    ubicacion: string;
  };
  salario: number | null;
  ubicacion: string;
  tipoEmpleo: string;
  fechaPublicacion: Date;
  match?: number;
}): JobCardVacancy => ({
  id: vacancy.id,
  match: vacancy.match || 0,
  title: vacancy.titulo,
  company: vacancy.empresa.nombre,
  location: vacancy.ubicacion,
  salary: vacancy.salario ? `$${vacancy.salario}` : "No especificado",
  description: vacancy.descripcion,
  tipoEmpleo: vacancy.tipoEmpleo,
  fechaPublicacion: vacancy.fechaPublicacion.toISOString()
});

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const TabButton = ({ isActive, onClick, children, className = '' }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`
      px-6 py-2 text-sm font-medium
      ${isActive 
        ? 'bg-blue-800 text-white' 
        : 'bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
      ${className}
    `}
  >
    {children}
  </button>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay resultados</h3>
    <p className="mt-1 text-sm text-gray-500">{message}</p>
  </div>
);

export default function CandidatePage() {
  const [vacancies, setVacancies] = useState<JobCardVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommended' | 'applications'>('recommended');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'recommended') {
          const response = await getAvailableVacancies();
          if (response.ok) {
            setVacancies((response.vacantes ?? []).map(transformVacancyToJobCard));
          }
        } else {
          const response = await getMyApplications();
          if (response.ok) {
            setVacancies((response.postulaciones ?? []).map(transformVacancyToJobCard));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 md:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex justify-center">
            <TabButton 
              isActive={activeTab === 'recommended'} 
              onClick={() => setActiveTab('recommended')}
              className="rounded-s-lg"
            >
              Recomendadas
            </TabButton>
            <TabButton 
              isActive={activeTab === 'applications'} 
              onClick={() => setActiveTab('applications')}
              className="rounded-e-lg"
            >
              Mis Postulaciones
            </TabButton>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {activeTab === 'recommended' 
            ? 'Vacantes que hacen match contigo'
            : 'Tus postulaciones'
          }
        </h2>
        
        {vacancies.length === 0 ? (
          <EmptyState 
            message={
              activeTab === 'recommended'
                ? "No hay vacantes disponibles en este momento."
                : "No tienes postulaciones activas."
            } 
          />
        ) : (
          vacancies.map((vacancy) => (
            <JobCards
              key={vacancy.id}
              {...vacancy}
            />
          ))
        )}
      </div>
    </div>
  );
}