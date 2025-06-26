/*
  Warnings:

  - The primary key for the `candidatos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `certificaciones` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fecha_actualizacion` on the `certificaciones` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `certificaciones` table. All the data in the column will be lost.
  - The primary key for the `empresas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `experiencias` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fecha_actualizacion` on the `experiencias` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `experiencias` table. All the data in the column will be lost.
  - The primary key for the `habilidades_blandas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `habilidades_tecnicas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `idiomas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `matches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `notificaciones` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pagos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `planes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `preferencias_empleo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `suscripciones` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fecha_creacion` on the `suscripciones` table. All the data in the column will be lost.
  - The primary key for the `usuarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `vacantes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `educacion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "candidatos" DROP CONSTRAINT "candidatos_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "certificaciones" DROP CONSTRAINT "certificaciones_candidato_id_fkey";

-- DropForeignKey
ALTER TABLE "educacion" DROP CONSTRAINT "educacion_candidato_id_fkey";

-- DropForeignKey
ALTER TABLE "empresas" DROP CONSTRAINT "empresas_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "experiencias" DROP CONSTRAINT "experiencias_candidato_id_fkey";

-- DropForeignKey
ALTER TABLE "habilidades_blandas" DROP CONSTRAINT "habilidades_blandas_candidato_id_fkey";

-- DropForeignKey
ALTER TABLE "habilidades_tecnicas" DROP CONSTRAINT "habilidades_tecnicas_candidato_id_fkey";

-- DropForeignKey
ALTER TABLE "idiomas" DROP CONSTRAINT "idiomas_candidato_id_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_candidato_id_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_vacante_id_fkey";

-- DropForeignKey
ALTER TABLE "notificaciones" DROP CONSTRAINT "notificaciones_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_suscripcion_id_fkey";

-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_vacante_id_fkey";

-- DropForeignKey
ALTER TABLE "preferencias_empleo" DROP CONSTRAINT "preferencias_empleo_candidato_id_fkey";

-- DropForeignKey
ALTER TABLE "suscripciones" DROP CONSTRAINT "suscripciones_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "suscripciones" DROP CONSTRAINT "suscripciones_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "vacantes" DROP CONSTRAINT "vacantes_empresa_id_fkey";

-- AlterTable
ALTER TABLE "candidatos" DROP CONSTRAINT "candidatos_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuario_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "candidatos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "candidatos_id_seq";

-- AlterTable
ALTER TABLE "certificaciones" DROP CONSTRAINT "certificaciones_pkey",
DROP COLUMN "fecha_actualizacion",
DROP COLUMN "fecha_creacion",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "candidato_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "certificaciones_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "certificaciones_id_seq";

-- AlterTable
ALTER TABLE "empresas" DROP CONSTRAINT "empresas_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuario_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "empresas_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "empresas_id_seq";

-- AlterTable
ALTER TABLE "experiencias" DROP CONSTRAINT "experiencias_pkey",
DROP COLUMN "fecha_actualizacion",
DROP COLUMN "fecha_creacion",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "candidato_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "experiencias_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "experiencias_id_seq";

-- AlterTable
ALTER TABLE "habilidades_blandas" DROP CONSTRAINT "habilidades_blandas_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "candidato_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "habilidades_blandas_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "habilidades_blandas_id_seq";

-- AlterTable
ALTER TABLE "habilidades_tecnicas" DROP CONSTRAINT "habilidades_tecnicas_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "candidato_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "habilidades_tecnicas_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "habilidades_tecnicas_id_seq";

-- AlterTable
ALTER TABLE "idiomas" DROP CONSTRAINT "idiomas_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "candidato_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "idiomas_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "idiomas_id_seq";

-- AlterTable
ALTER TABLE "matches" DROP CONSTRAINT "matches_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "candidato_id" SET DATA TYPE TEXT,
ALTER COLUMN "vacante_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "matches_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "matches_id_seq";

-- AlterTable
ALTER TABLE "notificaciones" DROP CONSTRAINT "notificaciones_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuario_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "notificaciones_id_seq";

-- AlterTable
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "suscripcion_id" SET DATA TYPE TEXT,
ALTER COLUMN "vacante_id" SET DATA TYPE TEXT,
ALTER COLUMN "usuario_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "pagos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "pagos_id_seq";

-- AlterTable
ALTER TABLE "planes" DROP CONSTRAINT "planes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "planes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "planes_id_seq";

-- AlterTable
ALTER TABLE "preferencias_empleo" DROP CONSTRAINT "preferencias_empleo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "candidato_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "preferencias_empleo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "preferencias_empleo_id_seq";

-- AlterTable
ALTER TABLE "suscripciones" DROP CONSTRAINT "suscripciones_pkey",
DROP COLUMN "fecha_creacion",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuario_id" SET DATA TYPE TEXT,
ALTER COLUMN "plan_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "suscripciones_id_seq";

-- AlterTable
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "usuarios_id_seq";

-- AlterTable
ALTER TABLE "vacantes" DROP CONSTRAINT "vacantes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "vacantes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "vacantes_id_seq";

-- DropTable
DROP TABLE "educacion";

-- DropEnum
DROP TYPE "ModalidadTrabajo";

-- DropEnum
DROP TYPE "TipoEmpleo";

-- CreateTable
CREATE TABLE "educaciones" (
    "id" TEXT NOT NULL,
    "candidato_id" TEXT NOT NULL,
    "institucion" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "campo_estudio" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),

    CONSTRAINT "educaciones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "candidatos" ADD CONSTRAINT "candidatos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vacantes" ADD CONSTRAINT "vacantes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "planes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_suscripcion_id_fkey" FOREIGN KEY ("suscripcion_id") REFERENCES "suscripciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_vacante_id_fkey" FOREIGN KEY ("vacante_id") REFERENCES "vacantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_candidato_id_fkey" FOREIGN KEY ("candidato_id") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_vacante_id_fkey" FOREIGN KEY ("vacante_id") REFERENCES "vacantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiencias" ADD CONSTRAINT "experiencias_candidato_id_fkey" FOREIGN KEY ("candidato_id") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educaciones" ADD CONSTRAINT "educaciones_candidato_id_fkey" FOREIGN KEY ("candidato_id") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
