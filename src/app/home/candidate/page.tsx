"use client"

import { useEffect, useState } from "react";
import { JobCards, Loading, AdBanner, CompleteProfilePrompt } from "@/components";

import { JobCardVacancy, VacantesInterface } from "@/interfaces";
import { getVacanciesWithMatching } from "@/actions/vacancies/getVacanciesWithMatching";
import { checkProfileCompleteness } from "@/actions";
import { CategoriaVacante } from "@prisma/client";

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
  analisis?: string | null;
  areas_mejora?: string[] | null;
  habilidades_match?: any;
  yaPostulado?: boolean;
  fechaPostulacion?: Date | null;
  empresaInteresada?: boolean;
}): JobCardVacancy => {
  console.log('🔄 Transformando vacante:', vacancy.titulo, 'Match:', vacancy.match, 'Ya postulado:', vacancy.yaPostulado);
  return {
    id: vacancy.id,
    match: vacancy.match || 0,
    title: vacancy.titulo,
    company: vacancy.empresa.nombre,
    location: vacancy.ubicacion,
    salary: vacancy.salario ? `$${vacancy.salario}` : "No especificado",
    description: vacancy.descripcion,
    tipoEmpleo: vacancy.tipoEmpleo,
    fechaPublicacion: vacancy.fechaPublicacion.toISOString(),
    analisis: vacancy.analisis,
    areas_mejora: vacancy.areas_mejora,
    habilidades_match: vacancy.habilidades_match,
    yaPostulado: vacancy.yaPostulado,
    fechaPostulacion: vacancy.fechaPostulacion,
    empresaInteresada: vacancy.empresaInteresada
  };
};

const EmptyState = ({ message, title, showNotification = false }: { 
  message: string; 
  title?: string;
  showNotification?: boolean;
}) => (
  <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-4">
      <svg 
        className="h-8 w-8 text-blue-600" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6v10a2 2 0 002 2h4a2 2 0 002-2V6" 
        />
      </svg>
    </div>
    <h3 className="mt-2 text-lg font-semibold text-gray-900">
      {title || "No hay resultados"}
    </h3>
    <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
      {message}
    </p>
    {showNotification && (
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
        <p className="text-sm text-blue-800">
          <svg className="inline h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Te notificaremos por email cuando tengamos nuevas oportunidades que encajen con tu perfil
        </p>
      </div>
    )}
  </div>
);

export default function CandidatePage() {
  const [vacancies, setVacancies] = useState<JobCardVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchingStatus, setMatchingStatus] = useState<{
    source?: string;
    fallback?: boolean;
    message?: string;
  }>({});
  const [profileStatus, setProfileStatus] = useState<{
    isComplete: boolean;
    missingFields: string[];
    hasExperience: boolean;
    hasEducation: boolean;
    hasBasicInfo: boolean;
  } | null>(null);
  const [rejectedVacancyIds, setRejectedVacancyIds] = useState<string[]>([]);

  // Leer vacantes rechazadas de localStorage al cargar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('rejectedVacancyIds');
      if (stored) {
        setRejectedVacancyIds(JSON.parse(stored));
      }
    }
  }, []);

  // Guardar en localStorage cuando cambian
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rejectedVacancyIds', JSON.stringify(rejectedVacancyIds));
    }
  }, [rejectedVacancyIds]);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const status = await checkProfileCompleteness();
        setProfileStatus(status);
      } catch (error) {
        console.error("Error checking profile completeness:", error);
      }
    };

    checkProfile();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getVacanciesWithMatching();
        console.log('📨 Respuesta recibida en frontend:', response);
        // Guardar información del estado del matching
        setMatchingStatus({
          source: response.source,
          fallback: response.fallback,
          message: response.message,
        });
        if (response.ok) {
          console.log('✅ Vacantes recibidas:', response.vacantes?.length || 0);
          let transformedVacancies = (response.vacantes ?? []).map(transformVacancyToJobCard);
          // Filtrar vacantes rechazadas
          transformedVacancies = transformedVacancies.filter(v => !rejectedVacancyIds.includes(v.id));
          console.log('🔄 Vacantes transformadas:', transformedVacancies.length);
          setVacancies(transformedVacancies);
        } else {
          console.log('❌ Error en respuesta:', response.message);
          setVacancies([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setVacancies([]);
      } finally {
        setLoading(false);
      }
    };
    // Solo fetchear datos si el perfil está completo
    if (profileStatus?.isComplete) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [profileStatus, rejectedVacancyIds]);

  // Función para rechazar una vacante
  const handleRejectVacancy = (id: string) => {
    setRejectedVacancyIds(prev => Array.from(new Set([...prev, id])));
  };

  // Función para refrescar datos después de una postulación exitosa
  const handleApplicationSuccess = async () => {
    try {
      console.log('🔄 Actualizando datos después de postulación exitosa...');
      const response = await getVacanciesWithMatching();
      if (response.ok) {
        let transformedVacancies = (response.vacantes ?? []).map(transformVacancyToJobCard);
        transformedVacancies = transformedVacancies.filter(v => !rejectedVacancyIds.includes(v.id));
        setVacancies(transformedVacancies);
        console.log('✅ Datos actualizados exitosamente');
      }
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    }
  };

  if (loading) return <Loading />;

  // Si el perfil no está completo, mostrar el prompt
  if (profileStatus && !profileStatus.isComplete) {
    return (
      <CompleteProfilePrompt
        missingFields={profileStatus.missingFields}
        hasExperience={profileStatus.hasExperience}
        hasEducation={profileStatus.hasEducation}
        hasBasicInfo={profileStatus.hasBasicInfo}
      />
    );
  }

  const getEmptyStateContent = () => {
    // Si hay vacantes/matches, no mostrar mensaje de subir CV
    if (vacancies.length > 0) {
      return null;
    }
    // Si el backend explícitamente manda un mensaje de CV, lo mostramos
    if (matchingStatus.message?.toLowerCase().includes("sube tu cv")) {
      return {
        title: "Sube tu CV para comenzar",
        message: "Para poder recomendarte las mejores vacantes que coincidan con tu perfil, necesitamos que subas tu CV primero.",
        showNotification: false
      };
    }
    // Mensaje por defecto si no hay matches
    return {
      title: "No hay vacantes disponibles",
      message: "No hay vacantes disponibles en este momento que coincidan con tu perfil.",
      showNotification: false
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 md:px-0">
      <div className="max-w-4xl mx-auto">
        {/* Banner de publicidad */}
        <AdBanner variant="sidebar" />

        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Vacantes recomendadas para ti
        </h2>
        
        {vacancies.length === 0 ? (
          (() => {
            const content = getEmptyStateContent();
            return (
              <EmptyState 
                title={content?.title || "No hay resultados"}
                message={content?.message || "No hay vacantes disponibles en este momento que coincidan con tu perfil."}
                showNotification={content?.showNotification || false}
              />
            );
          })()
        ) : (
          vacancies.map((vacancy) => (
            <JobCards
              key={vacancy.id}
              {...vacancy}
              onReject={handleRejectVacancy}
              onApplicationSuccess={handleApplicationSuccess}
            />
          ))
        )}
      </div>
    </div>
  );
}