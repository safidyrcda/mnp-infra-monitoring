import { Activity, Task, TaskValueType } from './app/generated/prisma/client';

export const mockActivities: Partial<Activity>[] = [
  {
    name: "Travaux d'aménagement de points métriques",
    site: 'Ranomafana',
    type: 'ECOT',
  },
  {
    name: "Travaux d'aménagement site de camping",
    site: 'Ranomafana',
    type: 'ECOT',
  },
  {
    name: "Travaux d'entretien Centre de Recherche",
    site: 'Ranomafana',
    type: 'ECOT',
  },
  {
    name: 'Réhabilitation bureaux administratifs',
    site: 'Ranomafana',
    type: 'ADMIN',
  },
];

// ─── Tâches par phase ─────────────────────────────────────────────────────────
// Chaque tâche représente un livrable ou une validation concrète.
// valueType détermine comment on saisit l'avancement dans les suivis.

export const mockTasks: Partial<Task>[] = [
  {
    name: 'Élaboration du DAS',
    phaseType: 'preparation',
    order: 2,
    valueType: 'STATUS', // NON_FAIT → EN_COURS → REALISE → VALIDE
  },

  {
    name: "Élaboration du dossier d'appel d'offres (DAO)",
    phaseType: 'preparation',
    order: 4,
    valueType: 'STATUS',
  },

  // ── PASSATION : publication et évaluation des offres ─────────────────────
  // On suit les dates clés de la procédure et le statut des étapes réglementaires.
  {
    name: "Publication de l'avis d'appel d'offres",
    phaseType: 'passation',
    order: 1,
    valueType: 'DATE', // Date effective de publication
  },
  {
    name: 'Réception des offres',
    phaseType: 'passation',
    order: 2,
    valueType: 'DATE', // Date limite de dépôt des offres
  },
  {
    name: 'Dépouillement et évaluation des offres',
    phaseType: 'passation',
    order: 3,
    valueType: 'STATUS',
  },
  {
    name: "Rapport d'évaluation et attribution",
    phaseType: 'passation',
    order: 4,
    valueType: 'DOCUMENT', // Référence du rapport d'attribution
  },

  // ── CONTRACTUALISATION : formalisation du contrat ────────────────────────
  // On suit les documents contractuels et leurs dates de signature/notification.
  {
    name: 'Élaboration et validation du contrat',
    phaseType: 'contractualization',
    order: 1,
    valueType: 'STATUS',
  },
  {
    name: 'Signature du contrat',
    phaseType: 'contractualization',
    order: 2,
    valueType: 'DATE', // Date effective de signature
  },
  {
    name: 'Référence du contrat',
    phaseType: 'contractualization',
    order: 3,
    valueType: 'DOCUMENT', // N° de marché / référence contractuelle
  },
  {
    name: "Notification du marché à l'entrepreneur",
    phaseType: 'contractualization',
    order: 4,
    valueType: 'DATE', // Date de notification
  },

  // ── EXÉCUTION : suivi des travaux et réceptions ───────────────────────────
  // On suit l'avancement physique, les jalons et les réceptions.

  {
    name: 'Avancement physique des travaux',
    phaseType: 'execution',
    order: 2,
    valueType: 'PERCENTAGE', // % d'avancement chantier
  },
  {
    name: 'Réception provisoire',
    phaseType: 'execution',
    order: 3,
    valueType: 'DATE',
  },
  {
    name: 'Réception définitive',
    phaseType: 'execution',
    order: 4,
    valueType: 'DATE',
  },
];
