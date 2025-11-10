/*
  Warnings:

  - The values [OILY,DRY,COMBINATION,NORMAL,SENSITIVE] on the enum `SkinType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `concerns` on the `SkinProfile` table. All the data in the column will be lost.
  - You are about to drop the column `sensitivity` on the `SkinProfile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SkinRoutine" AS ENUM ('NAO_COMEÇANDO_AGORA', 'SIM_APENAS_LIMPEZA_E_HIDRATANTE', 'SIM_VARIOS_PRODUTOS', 'SIM_ROTINA_COMPLETA_COM_ATIVOS');

-- CreateEnum
CREATE TYPE "SunExposureLevel" AS ENUM ('BAIXO', 'MODERADO', 'ALTO');

-- CreateEnum
CREATE TYPE "KnownAllergies" AS ENUM ('NAO_TENHO', 'FRAGRANCIAS', 'ACIDOS_E_ATIVOS_FORTES', 'MULTIPLAS_SENSIBILIDADES');

-- CreateEnum
CREATE TYPE "PregnancyStatus" AS ENUM ('NAO', 'GRAVIDA', 'AMAMENTANDO', 'GRAVIDA_E_AMAMENTANDO');

-- CreateEnum
CREATE TYPE "SkinMedication" AS ENUM ('NAO_TOMA', 'ISOTRETINOINA', 'ESPIRONOLACTONA', 'OUTRAS_MEDICACOES_DERMATOLOGICAS', 'MULTIPLAS_MEDICACOES');

-- CreateEnum
CREATE TYPE "SkinCondition" AS ENUM ('NAO_TENHO_CONDICOES_ESPECIAIS', 'DERMATITE_ATORPICA_SEBORREICA_OU_DE_CONTATO', 'ROSACEA', 'ECZEMA', 'PSORIASE', 'HISTORICO_DE_HIPERSENSIBILIDADE_CUTANEA', 'MULTIPLAS_CONDICOES');

-- CreateEnum
CREATE TYPE "PoreCondition" AS ENUM ('LIMPOS_E_POUCO_VISIVEIS', 'VISIVEIS_MAS_SEM_PONTOS_PRETOS', 'DILATADOS_PRINCIPALMENTE_NA_ZONA_T', 'COM_PRESENCA_DE_PONTOS_PRETOS_CRAVOS', 'DILATADOS_COM_MUITOS_PONTOS_PRETOS');

-- CreateEnum
CREATE TYPE "SmokingHabit" AS ENUM ('NAO_FUMO', 'EX_FUMANTE', 'FUMO_OCASIONALMENTE', 'FUMO_MODERADAMENTE', 'FUMO_FREQUENTEMENTE');

-- CreateEnum
CREATE TYPE "WaterIntake" AS ENUM ('MENOS_DE_1L', 'DE_1_A_2L', 'DE_2_A_3L', 'MAIS_DE_3L');

-- AlterEnum
BEGIN;
CREATE TYPE "SkinType_new" AS ENUM ('OLEOSA', 'SECA', 'MISTA', 'SENSIVEL');
ALTER TABLE "SkinProfile" ALTER COLUMN "skinType" TYPE "SkinType_new" USING ("skinType"::text::"SkinType_new");
ALTER TYPE "SkinType" RENAME TO "SkinType_old";
ALTER TYPE "SkinType_new" RENAME TO "SkinType";
DROP TYPE "public"."SkinType_old";
COMMIT;

-- AlterTable
ALTER TABLE "SkinProfile" DROP COLUMN "concerns",
DROP COLUMN "sensitivity",
ADD COLUMN     "knownAllergies" "KnownAllergies",
ADD COLUMN     "poreCondition" "PoreCondition",
ADD COLUMN     "pregnancyStatus" "PregnancyStatus",
ADD COLUMN     "skinCondition" "SkinCondition",
ADD COLUMN     "skinMedication" "SkinMedication",
ADD COLUMN     "skincareRoutine" "SkinRoutine",
ADD COLUMN     "smokingHabit" "SmokingHabit",
ADD COLUMN     "sunExposure" "SunExposureLevel",
ADD COLUMN     "waterIntake" "WaterIntake",
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "skinType" DROP NOT NULL;
