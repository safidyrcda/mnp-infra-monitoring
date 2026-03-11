import {
  ActivityType,
  PhaseType,
  PrismaClient,
  Status,
} from './app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { mockActivities, mockEtapes } from './mock-data';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // ACTIVITIES
  await prisma.activity.createMany({
    data: mockActivities as Array<{
      name: string;
      id: string;
      site: string;
      type: ActivityType;
      createdAt: Date;
      updatedAt: Date;
    }>,
  });

  // ETAPES
  await prisma.etape.createMany({
    data: mockEtapes as Array<{
      nom: string;
      id: string;
      phaseType: PhaseType;
    }>,
  });

  const generateEtapeActivities = async () => {
    const etapeActivities = [];

    const activities = await prisma.activity.findMany();

    const etapes = await prisma.etape.findMany();

    for (const activity of activities) {
      const existingActivity = await prisma.activity.findUnique({
        where: { id: activity.id },
      });
      if (!existingActivity) {
        console.warn(
          `Activity with id ${activity.id} not found. Skipping etape activities for this activity.`,
        );
        continue;
      }

      for (const etape of etapes) {
        const existingEtape = await prisma.etape.findUnique({
          where: { id: etape.id },
        });
        if (!existingEtape) {
          console.warn(
            `Etape with id ${etape.id} not found. Skipping etape activity for this etape.`,
          );
          continue;
        }
        etapeActivities.push({
          activityId: existingActivity.id,
          etapeId: existingEtape.id,
          status: Status.NON_FAIT,
          commentaire: '',
          date: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return etapeActivities;
  };

  await prisma.etapeActivity.createMany({
    data: await generateEtapeActivities(),
  });

  console.log('✅ Seed terminé');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
