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
}