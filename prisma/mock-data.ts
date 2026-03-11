import { Activity, Etape, EtapeActivity } from './app/generated/prisma/client';

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

export const mockEtapes: Partial<Etape>[] = [
  { nom: 'Date prévue dans PPM', phaseType: 'preparation' },
  {
    nom: 'Type du document (APD/DEVIS/DAOR/DAON)',
    phaseType: 'preparation',
  },
  { nom: 'DAS', phaseType: 'preparation' },
  { nom: 'APD', phaseType: 'preparation' },
  { nom: 'Réalisation du document %', phaseType: 'preparation' },
  {
    nom: 'Échéance pour la phase de préparation',
    phaseType: 'preparation',
  },

  {
    nom: 'Échéance pour la phase de passation',
    phaseType: 'passation',
  },
  {
    nom: 'Prospection des fournisseurs',
    phaseType: 'passation',
  },
  { nom: 'Publication', phaseType: 'passation' },

  {
    nom: 'Signature du contrat',
    phaseType: 'contractualization',
  },
  {
    nom: 'Notification du marché',
    phaseType: 'contractualization',
  },

  { nom: 'Démarrage des travaux', phaseType: 'execution' },
  { nom: 'Avancement des travaux', phaseType: 'execution' },
  { nom: 'Réception provisoire', phaseType: 'execution' },
];
