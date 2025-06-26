export interface CompanyInterface {
  id: string;
  nombre: string;
  logo: string | null;
  ubicacion: string | null;
  giro: string | null;
  descripcion?: string;
  sitioWeb?: string;
  email?: string;
  telefono?: string;
}

