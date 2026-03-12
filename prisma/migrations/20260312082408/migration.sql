/*
  Warnings:

  - You are about to drop the `Step` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StepActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StepActivityFollowUp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PhaseToStep` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskValueType" AS ENUM ('DATE', 'PERCENTAGE', 'STATUS', 'DOCUMENT');

-- DropForeignKey
ALTER TABLE "StepActivity" DROP CONSTRAINT "StepActivity_activityId_fkey";

-- DropForeignKey
ALTER TABLE "StepActivity" DROP CONSTRAINT "StepActivity_stepId_fkey";

-- DropForeignKey
ALTER TABLE "StepActivityFollowUp" DROP CONSTRAINT "StepActivityFollowUp_createdById_fkey";

-- DropForeignKey
ALTER TABLE "StepActivityFollowUp" DROP CONSTRAINT "StepActivityFollowUp_stepActivityId_fkey";

-- DropForeignKey
ALTER TABLE "StepActivityFollowUp" DROP CONSTRAINT "StepActivityFollowUp_validatedById_fkey";

-- DropForeignKey
ALTER TABLE "_PhaseToStep" DROP CONSTRAINT "_PhaseToStep_A_fkey";

-- DropForeignKey
ALTER TABLE "_PhaseToStep" DROP CONSTRAINT "_PhaseToStep_B_fkey";

-- DropTable
DROP TABLE "Step";

-- DropTable
DROP TABLE "StepActivity";

-- DropTable
DROP TABLE "StepActivityFollowUp";

-- DropTable
DROP TABLE "_PhaseToStep";

-- DropEnum
DROP TYPE "StepValueType";

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phaseType" "PhaseType" NOT NULL,
    "order" INTEGER NOT NULL,
    "valueType" "TaskValueType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskActivity" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NON_FAIT',
    "isApplicable" BOOLEAN NOT NULL DEFAULT true,
    "valueString" TEXT,
    "valueNumber" DOUBLE PRECISION,
    "valueDate" TIMESTAMP(3),
    "commentaire" TEXT,
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskActivityFollowUp" (
    "id" TEXT NOT NULL,
    "taskActivityId" TEXT NOT NULL,
    "status" "Status",
    "valueString" TEXT,
    "valueNumber" DOUBLE PRECISION,
    "valueDate" TIMESTAMP(3),
    "commentaire" TEXT,
    "problemDescription" TEXT,
    "proposedSolution" TEXT,
    "nextAction" TEXT,
    "fichierJoint" TEXT,
    "createdById" TEXT,
    "validatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskActivityFollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PhaseToTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PhaseToTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskActivity_activityId_taskId_key" ON "TaskActivity"("activityId", "taskId");

-- CreateIndex
CREATE INDEX "_PhaseToTask_B_index" ON "_PhaseToTask"("B");

-- AddForeignKey
ALTER TABLE "TaskActivity" ADD CONSTRAINT "TaskActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskActivity" ADD CONSTRAINT "TaskActivity_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskActivityFollowUp" ADD CONSTRAINT "TaskActivityFollowUp_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskActivityFollowUp" ADD CONSTRAINT "TaskActivityFollowUp_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskActivityFollowUp" ADD CONSTRAINT "TaskActivityFollowUp_taskActivityId_fkey" FOREIGN KEY ("taskActivityId") REFERENCES "TaskActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhaseToTask" ADD CONSTRAINT "_PhaseToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Phase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhaseToTask" ADD CONSTRAINT "_PhaseToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
