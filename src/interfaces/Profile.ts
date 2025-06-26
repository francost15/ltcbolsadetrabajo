// Interfaces basadas en el schema de Prisma para el perfil de candidato

export interface ProfileEducation {
  id: string;
  institucion: string;
  titulo: string;
  campoEstudio: string;
  fechaInicio: string; // ISO date
  fechaFin: string | null;
}

export interface ProfileExperience {
  id: string;
  cargo: string;
  empresa: string;
  fechaInicio: string; // ISO date
  fechaFin: string | null;
  trabajoActual: boolean;
  descripcion: string;
}

export interface ProfileCertification {
  id: string;
  nombre: string;
  entidadEmisora: string;
  anioObtencion: number;
}

export interface ProfileLanguage {
  id: string;
  nombre: string;
  nivel: string;
}

export interface ProfilePreferences {
  id: string;
  tiposEmpleo: string[];
  modalidadesTrabajo: string[];
  cargosInteres: string[];
  industriasInteres: string[];
}

export interface Profile {
  id: string;
  nombre: string;
  email: string;
  curriculum: string | null;
  ciudad: string | null;
  estado: string | null;
  pais: string | null;
  disponibleReubicacion: 'SI' | 'NO' | 'ABIERTO' | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  resumenProfesional: string | null;
  tituloProfesional: string | null;
  telefono: string | null;
  salarioMinimo: number | null;
  salarioMaximo: number | null;
  monedaSalario: string | null;
  experiencia: ProfileExperience[];
  educacion: ProfileEducation[];
  certificaciones: ProfileCertification[];
  idiomas: ProfileLanguage[];
  preferencias: ProfilePreferences | null;
}

// Exportación para importación global
export type { Profile as ProfileResponse }; 