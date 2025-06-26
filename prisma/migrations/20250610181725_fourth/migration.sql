/*
  Warnings:

  - You are about to drop the column `foto_perfil` on the `candidatos` table. All the data in the column will be lost.
  - You are about to drop the column `logros` on the `experiencias` table. All the data in the column will be lost.
  - You are about to drop the column `costo_publicacion` on the `vacantes` table. All the data in the column will be lost.
  - You are about to drop the `habilidades_blandas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `habilidades_tecnicas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "habilidades_blandas" DROP CONSTRAINT "habilidades_blandas_candidato_id_fkey";

-- DropForeignKey
ALTER TABLE "habilidades_tecnicas" DROP CONSTRAINT "habilidades_tecnicas_candidato_id_fkey";

-- AlterTable
ALTER TABLE "candidatos" DROP COLUMN "foto_perfil";

-- AlterTable
ALTER TABLE "experiencias" DROP COLUMN "logros";

-- AlterTable
ALTER TABLE "vacantes" DROP COLUMN "costo_publicacion",
ADD COLUMN     "tipo_empleo" TEXT DEFAULT 'Tiempo Completo';

-- DropTable
DROP TABLE "habilidades_blandas";

-- DropTable
DROP TABLE "habilidades_tecnicas";
