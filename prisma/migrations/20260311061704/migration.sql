/*
  Warnings:

  - You are about to drop the column `date` on the `EtapeActivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EtapeActivity" DROP COLUMN "date",
ADD COLUMN     "dueDate" TIMESTAMP(3);
