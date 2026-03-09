export interface EtapeActivity {
  id: string;
  activityId: string;
  etapeId: string;
  status?: 'Non fait' | 'En cours' | 'Réalisé' | 'Validé';
  commentaire?: string;
  fichierJoint?: string;
  date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Etape {
  id: string;
  nom: string;
  phaseType?: 'preparation' | 'passation' | 'contractualization' | 'execution';
}

export interface Activity {
  id: string;
  name: string;
  site: string;
  type: 'ECOT' | 'ADMIN';
}
