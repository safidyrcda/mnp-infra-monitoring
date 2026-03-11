-- CreateTable
CREATE TABLE "EtapeActivityFollowUp" (
    "id" TEXT NOT NULL,
    "etapeActivityId" TEXT NOT NULL,
    "commentaire" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EtapeActivityFollowUp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EtapeActivityFollowUp" ADD CONSTRAINT "EtapeActivityFollowUp_etapeActivityId_fkey" FOREIGN KEY ("etapeActivityId") REFERENCES "EtapeActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
