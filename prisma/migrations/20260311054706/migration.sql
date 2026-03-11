/*
  Warnings:

  - You are about to drop the column `fichierJoint` on the `EtapeActivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EtapeActivity" DROP COLUMN "fichierJoint",
ADD COLUMN     "isApplicable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "EtapeActivityFollowUp" ADD COLUMN     "fichierJoint" TEXT,
ADD COLUMN     "status" "Status";
