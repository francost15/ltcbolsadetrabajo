import { CategoriaVacante } from "@prisma/client";

export interface VacantesInterface {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: CategoriaVacante;
  salario: number | null;
  ubicacion: string;
  tipoEmpleo: string;
  fechaPublicacion: Date;
  fechaActualizacion: Date;
  activa: boolean;
  totalCandidatos: number;
  candidatosInteresados: number;
  empresa?: {
    nombre: string;
    logo: string | null;
    ubicacion: string;
  };
  match?: number;
  analisis?: string | null;
  areas_mejora?: string[] | null;
  habilidades_match?: any;
}

export interface JobCardVacancy {
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
  // Campos de estado de postulación
  yaPostulado?: boolean;
  fechaPostulacion?: Date | null;
  empresaInteresada?: boolean;
}