/*
  Warnings:

  - You are about to drop the column `contractualizationEndDate` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `contractualizationStartDate` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `executionEndDate` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `executionStartDate` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `passationEndDate` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `passationStartDate` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `preparationEndDate` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `preparationStartDate` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the `Etape` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EtapeActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EtapeActivityFollowUp` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `createdAt` on table `Activity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Activity` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `role` on the `UserActivity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StepValueType" AS ENUM ('DATE', 'PERCENTAGE', 'TEXT', 'BOOLEAN', 'STATUS');

-- CreateEnum
CREATE TYPE "UserActivityRole" AS ENUM ('RESPONSABLE', 'VALIDATEUR', 'OBSERVATEUR');

-- DropForeignKey
ALTER TABLE "EtapeActivity" DROP CONSTRAINT "EtapeActivity_activityId_fkey";

-- DropForeignKey
ALTER TABLE "EtapeActivity" DROP CONSTRAINT "EtapeActivity_etapeId_fkey";

-- DropForeignKey
ALTER TABLE "EtapeActivityFollowUp" DROP CONSTRAINT "EtapeActivityFollowUp_createdById_fkey";

-- DropForeignKey
ALTER TABLE "EtapeActivityFollowUp" DROP CONSTRAINT "EtapeActivityFollowUp_etapeActivityId_fkey";

-- DropForeignKey
ALTER TABLE "EtapeActivityFollowUp" DROP CONSTRAINT "EtapeActivityFollowUp_validatedById_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "contractualizationEndDate",
DROP COLUMN "contractualizationStartDate",
DROP COLUMN "executionEndDate",
DROP COLUMN "executionStartDate",
DROP COLUMN "passationEndDate",
DROP COLUMN "passationStartDate",
DROP COLUMN "preparationEndDate",
DROP COLUMN "preparationStartDate",
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserActivity" DROP COLUMN "role",
ADD COLUMN     "role" "UserActivityRole" NOT NULL;

-- DropTable
DROP TABLE "Etape";

-- DropTable
DROP TABLE "EtapeActivity";

-- DropTable
DROP TABLE "EtapeActivityFollowUp";

-- CreateTable
CREATE TABLE "Phase" (
    "id" TEXT NOT NULL,
    "type" "PhaseType" NOT NULL,
    "order" INTEGER NOT NULL,
    "activityId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Phase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Step" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phaseType" "PhaseType" NOT NULL,
    "order" INTEGER NOT NULL,
    "valueType" "StepValueType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StepActivity" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NON_FAIT',
    "valueString" TEXT,
    "valueNumber" DOUBLE PRECISION,
    "valueDate" TIMESTAMP(3),
    "valueBoolean" BOOLEAN,
    "commentaire" TEXT,
    "isApplicable" BOOLEAN NOT NULL DEFAULT true,
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StepActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StepActivityFollowUp" (
    "id" TEXT NOT NULL,
    "stepActivityId" TEXT NOT NULL,
    "commentaire" TEXT,
    "status" "Status",
    "valueString" TEXT,
    "valueNumber" DOUBLE PRECISION,
    "valueDate" TIMESTAMP(3),
    "fichierJoint" TEXT,
    "createdById" TEXT,
    "validatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StepActivityFollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PhaseToStep" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PhaseToStep_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "StepActivity_activityId_stepId_key" ON "StepActivity"("activityId", "stepId");

-- CreateIndex
CREATE INDEX "_PhaseToStep_B_index" ON "_PhaseToStep"("B");

-- AddForeignKey
ALTER TABLE "Phase" ADD CONSTRAINT "Phase_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepActivity" ADD CONSTRAINT "StepActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepActivity" ADD CONSTRAINT "StepActivity_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepActivityFollowUp" ADD CONSTRAINT "StepActivityFollowUp_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepActivityFollowUp" ADD CONSTRAINT "StepActivityFollowUp_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepActivityFollowUp" ADD CONSTRAINT "StepActivityFollowUp_stepActivityId_fkey" FOREIGN KEY ("stepActivityId") REFERENCES "StepActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhaseToStep" ADD CONSTRAINT "_PhaseToStep_A_fkey" FOREIGN KEY ("A") REFERENCES "Phase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhaseToStep" ADD CONSTRAINT "_PhaseToStep_B_fkey" FOREIGN KEY ("B") REFERENCES "Step"("id") ON DELETE CASCADE ON UPDATE CASCADE;
