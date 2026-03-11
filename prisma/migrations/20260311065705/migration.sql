-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "contractualizationEndDate" TIMESTAMP(3),
ADD COLUMN     "contractualizationStartDate" TIMESTAMP(3),
ADD COLUMN     "executionEndDate" TIMESTAMP(3),
ADD COLUMN     "executionStartDate" TIMESTAMP(3),
ADD COLUMN     "passationEndDate" TIMESTAMP(3),
ADD COLUMN     "passationStartDate" TIMESTAMP(3),
ADD COLUMN     "preparationEndDate" TIMESTAMP(3),
ADD COLUMN     "preparationStartDate" TIMESTAMP(3);
