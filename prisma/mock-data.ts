import { Activity, Step, StepValueType } from './app/generated/prisma/client';

export const mockActivities: Partial<Activity>[] = [
  {
    name: "Travaux d'aménagement de points métriques",
    site: 'Ranomafana',
    type: 'ECOT',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    name: "Travaux d'aménagement site de camping",
    site: 'Ranomafana',
    type: 'ECOT',
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-01'),
  },
  {
    name: "Travaux d'entretien Centre de Recherche",
    site: 'Ranomafana',
    type: 'ECOT',
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-02-15'),
  },
  {
    name: 'Réhabilitation bureaux administratifs',
    site: 'Ranomafana',
    type: 'ADMIN',
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01'),
  },
];

export const mockSteps: Partial<Step>[] = [
  // ── Préparation ────────────────────────────────────────────────
  {
    name: 'Date prévue dans PPM',
    phaseType: 'preparation',
    order: 1,
    valueType: 'DATE',
  },
  {
    name: 'Type du document (APD/DEVIS/DAOR/DAON)',
    phaseType: 'preparation',
    order: 2,
    valueType: 'TEXT',
  },
  { name: 'DAS', phaseType: 'preparation', order: 3, valueType: 'STATUS' },
  { name: 'APD', phaseType: 'preparation', order: 4, valueType: 'STATUS' },
  {
    name: 'Réalisation du document %',
    phaseType: 'preparation',
    order: 5,
    valueType: 'PERCENTAGE',
  },
  {
    name: 'Échéance pour la phase de préparation',
    phaseType: 'preparation',
    order: 6,
    valueType: 'DATE',
  },

  // ── Passation ──────────────────────────────────────────────────
  {
    name: 'Échéance pour la phase de passation',
    phaseType: 'passation',
    order: 1,
    valueType: 'DATE',
  },
  {
    name: 'Prospection des fournisseurs',
    phaseType: 'passation',
    order: 2,
    valueType: 'STATUS',
  },
  {
    name: 'Publication',
    phaseType: 'passation',
    order: 3,
    valueType: 'STATUS',
  },

  // ── Contractualisation ─────────────────────────────────────────
  {
    name: 'Signature du contrat',
    phaseType: 'contractualization',
    order: 1,
    valueType: 'DATE',
  },
  {
    name: 'Notification du marché',
    phaseType: 'contractualization',
    order: 2,
    valueType: 'DATE',
  },

  // ── Exécution ──────────────────────────────────────────────────
  {
    name: 'Démarrage des travaux',
    phaseType: 'execution',
    order: 1,
    valueType: 'DATE',
  },
  {
    name: 'Avancement des travaux',
    phaseType: 'execution',
    order: 2,
    valueType: 'PERCENTAGE',
  },
  {
    name: 'Réception provisoire',
    phaseType: 'execution',
    order: 3,
    valueType: 'DATE',
  },
];
