-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NON_FAIT', 'EN_COURS', 'REALISE', 'VALIDE');

-- CreateEnum
CREATE TYPE "PhaseType" AS ENUM ('preparation', 'passation', 'contractualization', 'execution');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('ECOT', 'ADMIN');

-- CreateTable
CREATE TABLE "EtapeActivity" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "etapeId" TEXT NOT NULL,
    "status" "Status",
    "commentaire" TEXT,
    "fichierJoint" TEXT,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EtapeActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Etape" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "phaseType" "PhaseType",

    CONSTRAINT "Etape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EtapeActivity_activityId_etapeId_key" ON "EtapeActivity"("activityId", "etapeId");

-- AddForeignKey
ALTER TABLE "EtapeActivity" ADD CONSTRAINT "EtapeActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EtapeActivity" ADD CONSTRAINT "EtapeActivity_etapeId_fkey" FOREIGN KEY ("etapeId") REFERENCES "Etape"("id") ON DELETE CASCADE ON UPDATE CASCADE;
