import { CategoriaVacante } from "@/generated/prisma";

export const CATEGORIA_TODOS = "TODOS" as const;
export type CategoriaFilter = typeof CATEGORIA_TODOS | CategoriaVacante;

export const TODAS_CATEGORIAS: CategoriaVacante[] = [
  "DESARROLLO_SOFTWARE",
  "DISENO_UX_UI",
  "MARKETING_DIGITAL",
  "VENTAS",
  "ATENCION_CLIENTE",
  "RECURSOS_HUMANOS",
  "ADMINISTRACION",
  "FINANZAS_CONTABILIDAD",
  "LEGAL",
  "OPERACIONES",
  "LOGISTICA",
  "PRODUCCION",
  "CALIDAD",
  "INVESTIGACION_DESARROLLO",
  "EDUCACION_FORMACION",
  "SALUD",
  "TECNOLOGIA_INFORMACION",
  "SEGURIDAD",
  "COMUNICACIONES",
  "CONSULTORIA",
  "COMPRAS",
  "MANTENIMIENTO",
  "SERVICIO_TECNICO",
  "COMERCIO_EXTERIOR",
  "BIENES_RAICES",
  "CONSTRUCCION",
  "AGRICULTURA",
  "MINERIA",
  "ENERGIA",
  "TRANSPORTE",
  "OTROS"
];

export const formatearCategoria = (categoria: CategoriaVacante): string => {
  const formatMap: Record<CategoriaVacante, string> = {
    DESARROLLO_SOFTWARE: "Desarrollo de Software",
    DISENO_UX_UI: "Diseño UX/UI",
    MARKETING_DIGITAL: "Marketing Digital",
    VENTAS: "Ventas",
    ATENCION_CLIENTE: "Atención al Cliente",
    RECURSOS_HUMANOS: "Recursos Humanos",
    ADMINISTRACION: "Administración",
    FINANZAS_CONTABILIDAD: "Finanzas y Contabilidad",
    LEGAL: "Legal",
    OPERACIONES: "Operaciones",
    LOGISTICA: "Logística",
    PRODUCCION: "Producción",
    CALIDAD: "Calidad",
    INVESTIGACION_DESARROLLO: "Investigación y Desarrollo",
    EDUCACION_FORMACION: "Educación y Formación",
    SALUD: "Salud",
    TECNOLOGIA_INFORMACION: "Tecnología de la Información",
    SEGURIDAD: "Seguridad",
    COMUNICACIONES: "Comunicaciones",
    CONSULTORIA: "Consultoría",
    COMPRAS: "Compras",
    MANTENIMIENTO: "Mantenimiento",
    SERVICIO_TECNICO: "Servicio Técnico",
    COMERCIO_EXTERIOR: "Comercio Exterior",
    BIENES_RAICES: "Bienes Raíces",
    CONSTRUCCION: "Construcción",
    AGRICULTURA: "Agricultura",
    MINERIA: "Minería",
    ENERGIA: "Energía",
    TRANSPORTE: "Transporte",
    OTROS: "Otros"
  };

  return formatMap[categoria] || categoria;
}; 