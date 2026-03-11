import {
  ActivityType,
  PhaseType,
  PrismaClient,
  Status,
} from './app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // ACTIVITIES
  await prisma.activity.createMany({
    data: [
      {
        id: 'act-1',
        name: "Travaux d'aménagement de points métriques",
        site: 'Ranomafana',
        type: ActivityType.ECOT,
      },
      {
        id: 'act-2',
        name: "Travaux d'aménagement site de camping",
        site: 'Ranomafana',
        type: ActivityType.ECOT,
      },
      {
        id: 'act-3',
        name: "Travaux d'entretien Centre de Recherche",
        site: 'Ranomafana',
        type: ActivityType.ECOT,
      },
      {
        id: 'act-4',
        name: 'Réhabilitation bureaux administratifs',
        site: 'Ranomafana',
        type: ActivityType.ADMIN,
      },
    ],
  });

  // ETAPES
  await prisma.etape.createMany({
    data: [
      {
        id: 'etape-1',
        nom: 'Date prévue dans PPM',
        phaseType: PhaseType.preparation,
      },
      {
        id: 'etape-2',
        nom: 'Type du document (APD/DEVIS/DAOR/DAON)',
        phaseType: PhaseType.preparation,
      },
      { id: 'etape-3', nom: 'DAS', phaseType: PhaseType.preparation },
      { id: 'etape-4', nom: 'APD', phaseType: PhaseType.preparation },
      {
        id: 'etape-5',
        nom: 'Réalisation du document %',
        phaseType: PhaseType.preparation,
      },
      {
        id: 'etape-6',
        nom: 'Échéance pour la phase de préparation',
        phaseType: PhaseType.preparation,
      },

      {
        id: 'etape-7',
        nom: 'Échéance pour la phase de passation',
        phaseType: PhaseType.passation,
      },
      {
        id: 'etape-8',
        nom: 'Prospection des fournisseurs',
        phaseType: PhaseType.passation,
      },
      { id: 'etape-9', nom: 'Publication', phaseType: PhaseType.passation },

      {
        id: 'etape-10',
        nom: 'Signature du contrat',
        phaseType: PhaseType.contractualization,
      },
      {
        id: 'etape-11',
        nom: 'Notification du marché',
        phaseType: PhaseType.contractualization,
      },

      {
        id: 'etape-12',
        nom: 'Démarrage des travaux',
        phaseType: PhaseType.execution,
      },
      {
        id: 'etape-13',
        nom: 'Avancement des travaux',
        phaseType: PhaseType.execution,
      },
      {
        id: 'etape-14',
        nom: 'Réception provisoire',
        phaseType: PhaseType.execution,
      },
    ],
  });

  await prisma.etapeActivity.createMany({
    data: [
      {
        id: 'ea-1',
        activityId: 'act-1',
        etapeId: 'etape-1',
        status: Status.REALISE,
        commentaire: 'Planifié dans le PPM 2026',
        date: new Date('2026-01-10'),
        createdAt: new Date('2026-01-10'),
        updatedAt: new Date('2026-01-10'),
      },
      {
        id: 'ea-2',
        activityId: 'act-1',
        etapeId: 'etape-3',
        status: Status.EN_COURS,
        commentaire: 'Validation interne en attente',
        createdAt: new Date('2026-02-01'),
        updatedAt: new Date('2026-02-05'),
      },
      {
        id: 'ea-3',
        activityId: 'act-2',
        etapeId: 'etape-8',
        status: Status.NON_FAIT,
        createdAt: new Date('2026-02-15'),
        updatedAt: new Date('2026-02-15'),
      },
      {
        id: 'ea-4',
        activityId: 'act-2',
        etapeId: 'etape-10',
        status: Status.NON_FAIT,
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date('2026-03-01'),
      },
      {
        id: 'ea-5',
        activityId: 'act-3',
        etapeId: 'etape-12',
        status: Status.EN_COURS,
        commentaire: 'Travaux démarrés sur le site',
        date: new Date('2026-03-05'),
        createdAt: new Date('2026-03-05'),
        updatedAt: new Date('2026-03-06'),
      },
    ],
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
