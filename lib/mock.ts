import { Activity, Etape, EtapeActivity } from './type';

export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    name: "Travaux d'aménagement de points métriques",
    site: 'Ranomafana',
    type: 'ECOT',
  },
  {
    id: 'act-2',
    name: "Travaux d'aménagement site de camping",
    site: 'Ranomafana',
    type: 'ECOT',
  },
  {
    id: 'act-3',
    name: "Travaux d'entretien Centre de Recherche",
    site: 'Ranomafana',
    type: 'ECOT',
  },
  {
    id: 'act-4',
    name: 'Réhabilitation bureaux administratifs',
    site: 'Ranomafana',
    type: 'ADMIN',
  },
];

export const mockEtapes: Etape[] = [
  { id: 'etape-1', nom: 'Date prévue dans PPM', phaseType: 'preparation' },
  {
    id: 'etape-2',
    nom: 'Type du document (APD/DEVIS/DAOR/DAON)',
    phaseType: 'preparation',
  },
  { id: 'etape-3', nom: 'DAS', phaseType: 'preparation' },
  { id: 'etape-4', nom: 'APD', phaseType: 'preparation' },
  { id: 'etape-5', nom: 'Réalisation du document %', phaseType: 'preparation' },
  {
    id: 'etape-6',
    nom: 'Échéance pour la phase de préparation',
    phaseType: 'preparation',
  },

  {
    id: 'etape-7',
    nom: 'Échéance pour la phase de passation',
    phaseType: 'passation',
  },
  {
    id: 'etape-8',
    nom: 'Prospection des fournisseurs',
    phaseType: 'passation',
  },
  { id: 'etape-9', nom: 'Publication', phaseType: 'passation' },

  {
    id: 'etape-10',
    nom: 'Signature du contrat',
    phaseType: 'contractualization',
  },
  {
    id: 'etape-11',
    nom: 'Notification du marché',
    phaseType: 'contractualization',
  },

  { id: 'etape-12', nom: 'Démarrage des travaux', phaseType: 'execution' },
  { id: 'etape-13', nom: 'Avancement des travaux', phaseType: 'execution' },
  { id: 'etape-14', nom: 'Réception provisoire', phaseType: 'execution' },
];

export const mockEtapeActivities: EtapeActivity[] = [
  {
    id: 'ea-1',
    activityId: 'act-1',
    etapeId: 'etape-1',
    status: 'Réalisé',
    commentaire: 'Planifié dans le PPM 2026',
    date: '2026-01-10',
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10',
  },
  {
    id: 'ea-2',
    activityId: 'act-1',
    etapeId: 'etape-3',
    status: 'En cours',
    commentaire: 'Validation interne en attente',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-05',
  },
  {
    id: 'ea-3',
    activityId: 'act-2',
    etapeId: 'etape-8',
    status: 'Non fait',
    createdAt: '2026-02-15',
    updatedAt: '2026-02-15',
  },
  {
    id: 'ea-4',
    activityId: 'act-2',
    etapeId: 'etape-10',
    status: 'Non fait',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01',
  },
  {
    id: 'ea-5',
    activityId: 'act-3',
    etapeId: 'etape-12',
    status: 'En cours',
    commentaire: 'Travaux démarrés sur le site',
    date: '2026-03-05',
    createdAt: '2026-03-05',
    updatedAt: '2026-03-06',
  },
];
