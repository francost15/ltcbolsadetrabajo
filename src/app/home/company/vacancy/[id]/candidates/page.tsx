"use client"

import { useEffect, useState } from "react";
import { getVacancy, getCandidatesByVacancy } from "@/actions";
import { Badge, BackButton } from "@/components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserPlus } from "react-icons/fa";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

interface Vacancy {
  id: string;
  titulo: string;
  createdAt: string;
  updatedAt: string;
  activa: boolean;
  tipoEmpleo: string | null;
  categoria: string;
  salario: number | null;
  ubicacion: string | null;
  empresa: {
    id: string;
    usuarioId: string;
    nombre: string;
    giro: string | null;
    ubicacion: string | null;
    logo: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

interface Candidate {
  id: string;
  nombre: string;
  email: string;
  tituloProfesional: string | null;
  resumenProfesional: string | null;
  porcentajeMatch: number;
  ciudad: string | null;
  pais: string | null;
  linkedinUrl: string | null;
}

export default function CandidatesPage({ params }: Props) {
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = await params;
        
        // Verificar que la vacante exista
        const vacancyResponse = await getVacancy(id);
        if (!vacancyResponse.ok || !vacancyResponse.vacancy) {
          router.push("/home/company");
          return;
        }

        setVacancy(vacancyResponse.vacancy);

        // Obtener candidatos
        const candidatesResponse = await getCandidatesByVacancy(id);
        if (!candidatesResponse.ok) {
          setError(candidatesResponse.error || 'Error desconocido');
          return;
        }

        setCandidates(candidatesResponse.candidates || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="mt-4 h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vacancy) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Error al cargar los candidatos</h1>
          <p className="mt-2 text-gray-600">{error || 'Vacante no encontrada'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-900">
            Candidatos para: {vacancy.titulo}
          </h1>
          <div className="w-24"></div>
        </div>

        {candidates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <FaUserPlus className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">No hay candidatos que se hayan postulado</h2>
            <p className="mt-2 text-gray-500">
              Cuando los candidatos se postulen a esta vacante, aparecerán aquí con toda su información de perfil.
            </p>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <strong>💡 Consejo:</strong> Las vacantes con buenos matches (60%+) suelen recibir más postulaciones.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-800 font-medium">
                  {candidates.length} candidato{candidates.length !== 1 ? 's' : ''} se ha{candidates.length !== 1 ? 'n' : ''} postulado a esta vacante
                </span>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{candidate.nombre}</h3>
                      {candidate.tituloProfesional && (
                        <p className="text-gray-600 mt-1 font-medium">{candidate.tituloProfesional}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    {candidate.resumenProfesional && (
                      <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                        {candidate.resumenProfesional}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {(candidate.ciudad || candidate.pais) && (
                      <p className="text-gray-600 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {[candidate.ciudad, candidate.pais].filter(Boolean).join(", ")}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {candidate.email}
                    </p>
                    {candidate.linkedinUrl && (
                      <a 
                        href={candidate.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        Ver LinkedIn
                      </a>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Link 
                      href={`/home/company/candidates/${candidate.id}`}
                      className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-center transition-colors"
                    >
                      Ver perfil completo
                    </Link>
                    <button 
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        // Crear mailto con información del candidato
                        const subject = `Interés en tu postulación para: ${vacancy.titulo}`;
                        const body = `Hola ${candidate.nombre},\n\nHemos revisado tu postulación para la vacante "${vacancy.titulo}" y nos gustaría conocer más sobre tu perfil.\n\n¿Podrías contarnos más sobre tu experiencia?\n\nSaludos cordiales,\nEquipo de Reclutamiento`;
                        window.open(`mailto:${candidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                      }}
                    >
                      Contactar candidato
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 