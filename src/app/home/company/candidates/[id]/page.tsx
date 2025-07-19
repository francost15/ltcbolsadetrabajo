"use client"

import { useEffect, useState } from "react";
import { getCandidateProfile } from "@/actions";
import { BackButton } from "@/components";
import { Profile } from "@/interfaces";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaLinkedin, 
  FaGlobe, 
  FaDollarSign,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaLanguage,
  FaFileAlt
} from "react-icons/fa";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function CandidateProfilePage({ params }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { id } = await params;
        const candidateProfile = await getCandidateProfile(id);
        
        if (!candidateProfile) {
          setError('Candidato no encontrado');
          return;
        }
        
        setProfile(candidateProfile);
      } catch (err) {
        console.error('Error fetching candidate profile:', err);
        setError('Error al cargar el perfil del candidato');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM yyyy', { locale: es });
  };

  const formatFullDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const getNivelIdiomaLabel = (nivel: string) => {
    const niveles: { [key: string]: string } = {
      'NATIVO': 'Nativo',
      'AVANZADO_C2': 'Avanzado (C2)',
      'AVANZADO_C1': 'Avanzado (C1)',
      'INTERMEDIO_B2': 'Intermedio (B2)',
      'INTERMEDIO_B1': 'Intermedio (B1)',
      'BASICO_A2': 'Básico (A2)',
      'BASICO_A1': 'Básico (A1)'
    };
    return niveles[nivel] || nivel;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">{error || 'Perfil no encontrado'}</p>
          <BackButton className="mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-900">Perfil del Candidato</h1>
          <div className="w-24"></div>
        </div>

        {/* Información Personal */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <FaUser className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.nombre}</h2>
              {profile.tituloProfesional && (
                <p className="text-lg text-gray-600 mb-3">{profile.tituloProfesional}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="w-4 h-4 mr-2 text-blue-600" />
                  <span>{profile.email}</span>
                </div>
                
                {profile.telefono && (
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{profile.telefono}</span>
                  </div>
                )}
                
                {(profile.ciudad || profile.estado || profile.pais) && (
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-blue-600" />
                    <span>
                      {[profile.ciudad, profile.estado, profile.pais].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
                
                {profile.linkedinUrl && (
                  <div className="flex items-center text-gray-600">
                    <FaLinkedin className="w-4 h-4 mr-2 text-blue-600" />
                    <a 
                      href={profile.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver LinkedIn
                    </a>
                  </div>
                )}
                
                {profile.portfolioUrl && (
                  <div className="flex items-center text-gray-600">
                    <FaGlobe className="w-4 h-4 mr-2 text-blue-600" />
                    <a 
                      href={profile.portfolioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver Portafolio
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Resumen Profesional */}
          {profile.resumenProfesional && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FaFileAlt className="w-5 h-5 mr-2 text-blue-600" />
                Resumen Profesional
              </h3>
              <p className="text-gray-700 leading-relaxed">{profile.resumenProfesional}</p>
            </div>
          )}
          
          {/* Expectativas Salariales */}
          {(profile.salarioMinimo || profile.salarioMaximo) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FaDollarSign className="w-5 h-5 mr-2 text-green-600" />
                Expectativas Salariales
              </h3>
              <p className="text-gray-700">
                {profile.salarioMinimo && profile.salarioMaximo 
                  ? `${profile.salarioMinimo.toLocaleString()} - ${profile.salarioMaximo.toLocaleString()}`
                  : profile.salarioMinimo 
                    ? `Desde ${profile.salarioMinimo.toLocaleString()}`
                    : `Hasta ${profile.salarioMaximo?.toLocaleString()}`
                } {profile.monedaSalario || 'MXN'}
              </p>
            </div>
          )}
        </div>

        {/* Experiencia Laboral */}
        {profile.experiencia && profile.experiencia.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaBriefcase className="w-6 h-6 mr-2 text-blue-600" />
              Experiencia Laboral
            </h3>
            <div className="space-y-6">
              {profile.experiencia.map((exp) => (
                <div key={exp.id} className="border-l-4 border-blue-600 pl-4">
                  <div className="flex flex-wrap justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{exp.cargo}</h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(exp.fechaInicio)} - {exp.fechaFin ? formatDate(exp.fechaFin) : 'Actual'}
                    </span>
                  </div>
                  <p className="text-md font-medium text-gray-700 mb-2">{exp.empresa}</p>
                  <p className="text-gray-600 leading-relaxed">{exp.descripcion}</p>
                  {exp.trabajoActual && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Trabajo Actual
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educación */}
        {profile.educacion && profile.educacion.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaGraduationCap className="w-6 h-6 mr-2 text-blue-600" />
              Educación
            </h3>
            <div className="space-y-4">
              {profile.educacion.map((edu) => (
                <div key={edu.id} className="border-l-4 border-green-600 pl-4">
                  <div className="flex flex-wrap justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{edu.titulo}</h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(edu.fechaInicio)} - {edu.fechaFin ? formatDate(edu.fechaFin) : 'En curso'}
                    </span>
                  </div>
                  <p className="text-md font-medium text-gray-700">{edu.institucion}</p>
                  <p className="text-gray-600">{edu.campoEstudio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Certificaciones */}
          {profile.certificaciones && profile.certificaciones.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaCertificate className="w-6 h-6 mr-2 text-yellow-600" />
                Certificaciones
              </h3>
              <div className="space-y-3">
                {profile.certificaciones.map((cert) => (
                  <div key={cert.id} className="border-l-4 border-yellow-600 pl-4">
                    <h4 className="font-semibold text-gray-900">{cert.nombre}</h4>
                    <p className="text-gray-600">{cert.entidadEmisora}</p>
                    <p className="text-sm text-gray-500">{cert.anioObtencion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Idiomas */}
          {profile.idiomas && profile.idiomas.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaLanguage className="w-6 h-6 mr-2 text-purple-600" />
                Idiomas
              </h3>
              <div className="space-y-3">
                {profile.idiomas.map((idioma) => (
                  <div key={idioma.id} className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{idioma.nombre}</span>
                    <span className="text-sm text-gray-600">{getNivelIdiomaLabel(idioma.nivel)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preferencias de Empleo */}
        {profile.preferencias && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Preferencias de Empleo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.preferencias.tiposEmpleo && profile.preferencias.tiposEmpleo.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tipos de Empleo</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferencias.tiposEmpleo.map((tipo, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {tipo}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.preferencias.modalidadesTrabajo && profile.preferencias.modalidadesTrabajo.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Modalidades de Trabajo</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferencias.modalidadesTrabajo.map((modalidad, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {modalidad}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="mt-8 flex gap-4 justify-center">
          <button 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            onClick={() => {
              const subject = `Interés en tu perfil profesional`;
              const body = `Hola ${profile.nombre},\n\nHemos revisado tu perfil y nos interesa conocer más sobre tu experiencia profesional.\n\n¿Podrías contarnos más sobre tus proyectos recientes?\n\nSaludos cordiales,\nEquipo de Reclutamiento`;
              window.open(`mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
            }}
          >
            <FaEnvelope className="w-4 h-4 mr-2" />
            Contactar Candidato
          </button>
        </div>
      </div>
    </div>
  );
} 