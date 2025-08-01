-- CreateEnum
CREATE TYPE "CategoriaVacante" AS ENUM ('DESARROLLO_SOFTWARE', 'DISENO_UX_UI', 'MARKETING_DIGITAL', 'VENTAS', 'ATENCION_CLIENTE', 'RECURSOS_HUMANOS', 'ADMINISTRACION', 'FINANZAS_CONTABILIDAD', 'LEGAL', 'OPERACIONES', 'LOGISTICA', 'PRODUCCION', 'CALIDAD', 'INVESTIGACION_DESARROLLO', 'EDUCACION_FORMACION', 'SALUD', 'TECNOLOGIA_INFORMACION', 'SEGURIDAD', 'COMUNICACIONES', 'CONSULTORIA', 'COMPRAS', 'MANTENIMIENTO', 'SERVICIO_TECNICO', 'COMERCIO_EXTERIOR', 'BIENES_RAICES', 'CONSTRUCCION', 'AGRICULTURA', 'MINERIA', 'ENERGIA', 'TRANSPORTE', 'OTROS');

-- AlterTable
ALTER TABLE "vacantes" ADD COLUMN     "categoria" "CategoriaVacante" NOT NULL DEFAULT 'OTROS';
