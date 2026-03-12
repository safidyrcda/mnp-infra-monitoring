import {
  ActivityType,
  PhaseType,
  PrismaClient,
  Status,
  StepValueType,
} from './app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { mockActivities, mockSteps } from './mock-data';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ─── Ordre des phases ─────────────────────────────────────────────────────────

const PHASE_ORDER: Record<PhaseType, number> = {
  preparation: 1,
  passation: 2,
  contractualization: 3,
  execution: 4,
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Démarrage du seed...\n');

  // 1. ACTIVITIES
  console.log('📦 Création des activités...');
  await prisma.activity.createMany({
    data: mockActivities as Array<{
      name: string;
      site: string;
      type: ActivityType;
      createdAt: Date;
      updatedAt: Date;
    }>,
    skipDuplicates: true,
  });
  const activities = await prisma.activity.findMany();
  console.log(`   ✔ ${activities.length} activités créées`);

  // 2. STEPS
  console.log('📋 Création des steps...');
  await prisma.step.createMany({
    data: mockSteps as Array<{
      name: string;
      phaseType: PhaseType;
      order: number;
      valueType: StepValueType;
    }>,
    skipDuplicates: true,
  });
  const steps = await prisma.step.findMany();
  console.log(`   ✔ ${steps.length} steps créés`);

  // 3. PHASES — une phase par (activity × phaseType)
  console.log('🔖 Création des phases...');
  const phaseData = activities.flatMap((activity) =>
    (Object.keys(PHASE_ORDER) as PhaseType[]).map((phaseType) => ({
      type: phaseType,
      order: PHASE_ORDER[phaseType],
      activityId: activity.id,
    })),
  );
  await prisma.phase.createMany({ data: phaseData, skipDuplicates: true });
  const phases = await prisma.phase.findMany();
  console.log(`   ✔ ${phases.length} phases créées`);

  // 4. Lier les steps aux phases (Phase ↔ Step many-to-many)
  console.log('🔗 Association steps ↔ phases...');
  for (const phase of phases) {
    const matchingSteps = steps.filter((s) => s.phaseType === phase.type);
    await prisma.phase.update({
      where: { id: phase.id },
      data: {
        steps: {
          connect: matchingSteps.map((s) => ({ id: s.id })),
        },
      },
    });
  }
  console.log(`   ✔ Steps associés aux phases`);

  // 5. STEP ACTIVITIES — un StepActivity par (activity × step)
  console.log('⚙️  Création des stepActivities...');
  const stepActivityData = activities.flatMap((activity) =>
    steps.map((step) => ({
      activityId: activity.id,
      stepId: step.id,
      status: Status.NON_FAIT,
      isApplicable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  );
  await prisma.stepActivity.createMany({
    data: stepActivityData,
    skipDuplicates: true,
  });
  const stepActivities = await prisma.stepActivity.findMany();
  console.log(`   ✔ ${stepActivities.length} stepActivities créées`);

  console.log('\n✅ Seed terminé avec succès');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
