/*
  Warnings:

  - You are about to drop the column `perfil_profesional` on the `candidatos` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NivelIdioma" AS ENUM ('NATIVO', 'AVANZADO_C2', 'AVANZADO_C1', 'INTERMEDIO_B2', 'INTERMEDIO_B1', 'BASICO_A2', 'BASICO_A1');

-- CreateEnum
CREATE TYPE "DisponibilidadReub" AS ENUM ('SI', 'NO', 'ABIERTO');

-- CreateEnum
CREATE TYPE "TipoEmpleo" AS ENUM ('TIEMPO_COMPLETO', 'MEDIO_TIEMPO', 'POR_PROYECTO', 'FREELANCE');

-- CreateEnum
CREATE TYPE "ModalidadTrabajo" AS ENUM ('REMOTO', 'HIBRIDO', 'PRESENCIAL');

-- AlterTable
ALTER TABLE "candidatos" DROP COLUMN "perfil_profesional",
ADD COLUMN     "ciudad" TEXT,
ADD COLUMN     "disponible_reubicacion" "DisponibilidadReub",
ADD COLUMN     "estado" TEXT,
ADD COLUMN     "foto_perfil" TEXT,
ADD COLUMN     "linkedin_url" TEXT,
ADD COLUMN     "moneda_salario" TEXT,
ADD COLUMN     "pais" TEXT,
ADD COLUMN     "portfolio_url" TEXT,
ADD COLUMN     "resumen_profesional" TEXT,
ADD COLUMN     "salario_maximo" DECIMAL(65,30),
ADD COLUMN     "salario_minimo" DECIMAL(65,30),
ADD COLUMN     "telefono" TEXT,
ADD COLUMN     "titulo_profesional" TEXT;

-- CreateTable
CREATE TABLE "experiencias" (
    "id" BIGSERIAL NOT NULL,
    "candidato_id" BIGINT NOT NULL,
    "cargo" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "trabajo_actual" BOOLEAN NOT NULL DEFAULT false,
    "descripcion" TEXT NOT NULL,
    "logros" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experiencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educacion" (
    "id" BIGSERIAL NOT NULL,
    "candidato_id" BIGINT NOT NULL,
    "institucion" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "campo_estudio" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "educacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificaciones" (
    "id" BIGSERIAL NOT NULL,
    "candidato_id" BIGINT NOT NULL,
    "nombre" TEXT NOT NULL,
    "entidad_emisora" TEXT NOT NULL,
    "anio_obtencion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habilidades_tecnicas" (
    "id" BIGSERIAL NOT NULL,
    "candidato_id" BIGINT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL,

    CONSTRAINT "habilidades_tecnicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habilidades_blandas" (
    "id" BIGSERIAL NOT NULL,
    "candidato_id" BIGINT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "habilidades_blandas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idiomas" (
    "id" BIGSERIAL NOT NULL,
    "candidato_id" BIGINT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel" "NivelIdioma" NOT NULL,

    CONSTRAINT "idiomas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preferencias_empleo" (
    "id" BIGSERIAL NOT NULL,
    "candidato_id" BIGINT NOT NULL,
    "tipos_empleo" TEXT[],
    "modalidades_trabajo" TEXT[],
    "cargos_interes" TEXT[],
    "industrias_interes" TEXT[],
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "preferencias_empleo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "preferencias_empleo_candidato_id_key" ON "preferencias_empleo"("candidato_id");

-- AddForeignKey
ALTER TABLE "experiencias" ADD CONSTRAINT "experiencias_candidato_id_fkey" FOREIGN KEY ("candidato_id") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educacion" ADD CONSTRAINT "educacion_candidato_id_fkey" FOREIGN KEY ("candidato_id") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificaciones" ADD CONSTRAINT "certificaciones_candidato_id_fkey" FOREIGN KEY ("candidato_id") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidades_tecnicas" ADD CONSTRAINT "habilidades_tecnicas_candidato_id_fkey" FOREIGN KEY ("candidato_id") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidades_blandas" ADD CONSTRAINT "habilidades_blandas_candidato_id_fkey" FOREIGN KEY ("candidato_id") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idiomas" ADD CONSTRAINT "idiomas_candidato_id_fkey" FOREIGN KEY ("candidato_id") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferencias_empleo" ADD CONSTRAINT "preferencias_empleo_candidato_id_fkey" FOREIGN KEY ("candidato_id") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
