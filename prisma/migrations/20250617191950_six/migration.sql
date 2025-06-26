/*
  Warnings:

  - The values [pendiente,completado,fallido,reembolsado] on the enum `EstadoPago` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `vacante_id` on the `pagos` table. All the data in the column will be lost.
  - You are about to drop the column `limite_vacantes` on the `planes` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_entidad` on the `planes` table. All the data in the column will be lost.
  - You are about to drop the column `rango_salarial_texto` on the `vacantes` table. All the data in the column will be lost.
  - You are about to drop the column `salario_maximo` on the `vacantes` table. All the data in the column will be lost.
  - You are about to drop the column `salario_minimo` on the `vacantes` table. All the data in the column will be lost.
  - You are about to drop the column `ubicacion_vacante` on the `vacantes` table. All the data in the column will be lost.
  - Made the column `suscripcion_id` on table `pagos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duracion_dias` on table `planes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoPago_new" AS ENUM ('PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO');
ALTER TABLE "pagos" ALTER COLUMN "estado_pago" TYPE "EstadoPago_new" USING ("estado_pago"::text::"EstadoPago_new");
ALTER TYPE "EstadoPago" RENAME TO "EstadoPago_old";
ALTER TYPE "EstadoPago_new" RENAME TO "EstadoPago";
DROP TYPE "EstadoPago_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_suscripcion_id_fkey";

-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_vacante_id_fkey";

-- AlterTable
ALTER TABLE "pagos" DROP COLUMN "vacante_id",
ALTER COLUMN "suscripcion_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "planes" DROP COLUMN "limite_vacantes",
DROP COLUMN "tipo_entidad",
ALTER COLUMN "duracion_dias" SET NOT NULL;

-- AlterTable
ALTER TABLE "vacantes" DROP COLUMN "rango_salarial_texto",
DROP COLUMN "salario_maximo",
DROP COLUMN "salario_minimo",
DROP COLUMN "ubicacion_vacante",
ADD COLUMN     "salario" DECIMAL(65,30),
ADD COLUMN     "ubicacion" TEXT;

-- DropEnum
DROP TYPE "TipoEntidadPlan";

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_suscripcion_id_fkey" FOREIGN KEY ("suscripcion_id") REFERENCES "suscripciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
