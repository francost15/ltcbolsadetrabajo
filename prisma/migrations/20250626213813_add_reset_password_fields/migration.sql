-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "reset_token" TEXT,
ADD COLUMN     "reset_token_expiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "vacantes" ALTER COLUMN "tipo_empleo" DROP DEFAULT,
ALTER COLUMN "categoria" DROP DEFAULT;
