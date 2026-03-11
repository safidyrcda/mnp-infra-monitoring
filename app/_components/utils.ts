import { Etape, EtapeActivity } from '@/prisma/app/generated/prisma/client';

export type PhaseType =
  | 'preparation'
  | 'passation'
  | 'contractualization'
  | 'execution';

export type EtapeActivityWithName = EtapeActivity & { etapeName: string };

export type PhasesMap = Record<
  PhaseType,
  { etape: EtapeActivityWithName; etapeObj?: Etape }[]
>;

export const PHASE_LABELS: Record<PhaseType, string> = {
  preparation: 'Phase de Préparation',
  passation: 'Phase de Passation',
  contractualization: 'Phase de Contractualisation',
  execution: "Phase d'Exécution",
};

export const PHASE_BG_COLORS: Record<PhaseType, string> = {
  preparation:
    'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
  passation:
    'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
  contractualization:
    'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
  execution:
    'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
};

export function groupEtapesByPhase(
  etapeActivities: EtapeActivity[],
  etapes: Etape[],
): PhasesMap {
  const phasesMap: PhasesMap = {
    preparation: [],
    passation: [],
    contractualization: [],
    execution: [],
  };

  etapeActivities.forEach((et) => {
    const etape = etapes.find((e) => e.id === et.etapeId);
    if (etape?.phaseType && etape.phaseType in phasesMap) {
      phasesMap[etape.phaseType as PhaseType].push({
        etape: { ...et, etapeName: etape.nom },
        etapeObj: etape,
      });
    }
  });

  return phasesMap;
}
