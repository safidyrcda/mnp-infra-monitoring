import {
  ActivityType,
  PhaseType,
  PrismaClient,
  Status,
  TaskValueType,
} from './app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { mockActivities, mockTasks } from './mock-data';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PHASE_ORDER: Record<PhaseType, number> = {
  preparation: 1,
  passation: 2,
  contractualization: 3,
  execution: 4,
};

async function main() {
  console.log('🌱 Démarrage du seed...\n');

  // 1. ACTIVITIES
  console.log('📦 Création des activités...');
  await prisma.activity.createMany({
    data: mockActivities as Array<{
      name: string;
      site: string;
      type: ActivityType;
    }>,
    skipDuplicates: true,
  });
  const activities = await prisma.activity.findMany();
  console.log(`   ✔ ${activities.length} activités créées`);

  // 2. TASKS (référentiel commun à toutes les activités)
  console.log('📋 Création des tâches...');
  await prisma.task.createMany({
    data: mockTasks as Array<{
      name: string;
      phaseType: PhaseType;
      order: number;
      valueType: TaskValueType;
    }>,
    skipDuplicates: true,
  });
  const tasks = await prisma.task.findMany();
  console.log(`   ✔ ${tasks.length} tâches créées`);

  // 3. PHASES — une par (activity × phaseType)
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

  // 4. Association Phase ↔ Task (many-to-many)
  console.log('🔗 Association tâches ↔ phases...');
  for (const phase of phases) {
    const matchingTasks = tasks.filter((t) => t.phaseType === phase.type);
    await prisma.phase.update({
      where: { id: phase.id },
      data: { tasks: { connect: matchingTasks.map((t) => ({ id: t.id })) } },
    });
  }
  console.log('   ✔ Tâches associées aux phases');

  // 5. TASK ACTIVITIES — une par (activity × task)
  console.log('⚙️  Création des taskActivities...');
  const taskActivityData = activities.flatMap((activity) =>
    tasks.map((task) => ({
      activityId: activity.id,
      taskId: task.id,
      status: Status.NON_FAIT,
      isApplicable: true,
    })),
  );
  await prisma.taskActivity.createMany({
    data: taskActivityData,
    skipDuplicates: true,
  });
  const taskActivities = await prisma.taskActivity.findMany();
  console.log(`   ✔ ${taskActivities.length} taskActivities créées`);

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
