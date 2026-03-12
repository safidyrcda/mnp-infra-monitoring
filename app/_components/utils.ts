import { PhaseType, Step, StepActivity } from '@/app/_components/types';

export type { PhaseType };

export type StepActivityWithName = StepActivity & { stepName: string };

export type PhasesMap = Record<
  PhaseType,
  { stepActivity: StepActivityWithName; step?: Step }[]
>;

export const PHASE_LABELS: Record<PhaseType, string> = {
  preparation: 'Phase de Préparation',
  passation: 'Phase de Passation',
  contractualization: 'Phase de Contractualisation',
  execution: "Phase d'Exécution",
};

export const PHASE_BG_COLORS: Record<PhaseType, string> = {
  preparation: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
  passation: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
  contractualization: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
  execution: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
};

export function groupStepsByPhase(
  stepActivities: StepActivity[],
  steps: Step[],
): PhasesMap {
  const phasesMap: PhasesMap = {
    preparation: [],
    passation: [],
    contractualization: [],
    execution: [],
  };

  stepActivities.forEach((sa) => {
    const step = steps.find((s) => s.id === sa.stepId);
    if (step?.phaseType && step.phaseType in phasesMap) {
      phasesMap[step.phaseType].push({
        stepActivity: { ...sa, stepName: step.name },
        step,
      });
    }
  });

  return phasesMap;
}
