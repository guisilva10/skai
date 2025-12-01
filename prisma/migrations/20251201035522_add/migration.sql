/*
  Warnings:

  - You are about to drop the column `knownAllergies` on the `SkinProfile` table. All the data in the column will be lost.
  - You are about to drop the column `poreCondition` on the `SkinProfile` table. All the data in the column will be lost.
  - You are about to drop the column `pregnancyStatus` on the `SkinProfile` table. All the data in the column will be lost.
  - You are about to drop the column `skinCondition` on the `SkinProfile` table. All the data in the column will be lost.
  - You are about to drop the column `skinMedication` on the `SkinProfile` table. All the data in the column will be lost.
  - You are about to drop the column `skinType` on the `SkinProfile` table. All the data in the column will be lost.
  - You are about to drop the column `skincareRoutine` on the `SkinProfile` table. All the data in the column will be lost.
  - You are about to drop the column `smokingHabit` on the `SkinProfile` table. All the data in the column will be lost.
  - You are about to drop the column `waterIntake` on the `SkinProfile` table. All the data in the column will be lost.
  - The `sunExposure` column on the `SkinProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ProductRecommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseUrl` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductRecommendation" DROP CONSTRAINT "ProductRecommendation_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PurchaseUrl" DROP CONSTRAINT "PurchaseUrl_recommendationId_fkey";

-- AlterTable
ALTER TABLE "SkinProfile" DROP COLUMN "knownAllergies",
DROP COLUMN "poreCondition",
DROP COLUMN "pregnancyStatus",
DROP COLUMN "skinCondition",
DROP COLUMN "skinMedication",
DROP COLUMN "skinType",
DROP COLUMN "skincareRoutine",
DROP COLUMN "smokingHabit",
DROP COLUMN "waterIntake",
ADD COLUMN     "allergyDetails" TEXT,
ADD COLUMN     "brandPreference" TEXT,
ADD COLUMN     "cleansingFrequency" TEXT,
ADD COLUMN     "climate" TEXT,
ADD COLUMN     "cosmeticsBurn" BOOLEAN,
ADD COLUMN     "currentMedication" TEXT,
ADD COLUMN     "currentTreatment" TEXT,
ADD COLUMN     "diet" TEXT,
ADD COLUMN     "dilatedPoresLocation" TEXT,
ADD COLUMN     "feelsTightAfterWashing" BOOLEAN,
ADD COLUMN     "getsRedEasily" BOOLEAN,
ADD COLUMN     "getsShinySkin" BOOLEAN,
ADD COLUMN     "hasAcne" BOOLEAN,
ADD COLUMN     "hasAllergies" BOOLEAN,
ADD COLUMN     "hasAtopicDermatitis" BOOLEAN,
ADD COLUMN     "hasDilatedPores" BOOLEAN,
ADD COLUMN     "hasFlakingSkin" BOOLEAN,
ADD COLUMN     "hasMelasma" BOOLEAN,
ADD COLUMN     "hasPsoriasis" BOOLEAN,
ADD COLUMN     "hasRosacea" BOOLEAN,
ADD COLUMN     "hasSeborrheicDermatitis" BOOLEAN,
ADD COLUMN     "hormonalTreatment" BOOLEAN,
ADD COLUMN     "hormonalTreatmentType" TEXT,
ADD COLUMN     "intensiveWorkout" BOOLEAN,
ADD COLUMN     "irritatingIngredients" TEXT[],
ADD COLUMN     "mainGoal" TEXT,
ADD COLUMN     "morningProducts" TEXT[],
ADD COLUMN     "nightProducts" TEXT[],
ADD COLUMN     "oilProductionArea" TEXT,
ADD COLUMN     "preferredTexture" TEXT[],
ADD COLUMN     "prefersFragrance" TEXT,
ADD COLUMN     "procedureDate" TEXT,
ADD COLUMN     "procedureType" TEXT,
ADD COLUMN     "recentProcedures" BOOLEAN,
ADD COLUMN     "retinolReaction" TEXT,
ADD COLUMN     "routineSteps" INTEGER,
ADD COLUMN     "secondaryGoals" TEXT[],
ADD COLUMN     "skinIrritationFrequency" TEXT,
ADD COLUMN     "sleepsWithAC" BOOLEAN,
ADD COLUMN     "triedRetinol" BOOLEAN,
ADD COLUMN     "usesAntibiotics" BOOLEAN,
ADD COLUMN     "usesCorticoids" BOOLEAN,
ADD COLUMN     "usesMakeup" TEXT,
ADD COLUMN     "usesSunscreenDaily" BOOLEAN,
DROP COLUMN "sunExposure",
ADD COLUMN     "sunExposure" TEXT;

-- DropTable
DROP TABLE "public"."ProductRecommendation";

-- DropTable
DROP TABLE "public"."PurchaseUrl";

-- DropEnum
DROP TYPE "public"."KnownAllergies";

-- DropEnum
DROP TYPE "public"."PoreCondition";

-- DropEnum
DROP TYPE "public"."PregnancyStatus";

-- DropEnum
DROP TYPE "public"."SkinCondition";

-- DropEnum
DROP TYPE "public"."SkinMedication";

-- DropEnum
DROP TYPE "public"."SkinRoutine";

-- DropEnum
DROP TYPE "public"."SkinType";

-- DropEnum
DROP TYPE "public"."SmokingHabit";

-- DropEnum
DROP TYPE "public"."SunExposureLevel";

-- DropEnum
DROP TYPE "public"."WaterIntake";
