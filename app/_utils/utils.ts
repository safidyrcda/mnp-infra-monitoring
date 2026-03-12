import {
  PhaseType,
  Task,
  TaskActivity,
  TaskValueType,
} from '@/app/_types/types';

export type { PhaseType, TaskValueType };

export type TaskActivityWithName = TaskActivity & {
  taskName: string;
  valueType: TaskValueType;
};

export type PhasesMap = Record<
  PhaseType,
  { taskActivity: TaskActivityWithName; task?: Task }[]
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

export const PHASE_DESCRIPTIONS: Record<PhaseType, string> = {
  preparation: 'Élaboration des documents techniques (DAS, APD, DAO)',
  passation: 'Publication, réception et évaluation des offres',
  contractualization: 'Formalisation et notification du contrat',
  execution: 'Suivi des travaux, réceptions provisoire et définitive',
};

export const VALUE_TYPE_LABELS: Record<TaskValueType, string> = {
  DATE: 'Date',
  PERCENTAGE: 'Avancement (%)',
  STATUS: 'Statut',
  DOCUMENT: 'Référence document',
};

export function groupTasksByPhase(
  taskActivities: TaskActivity[],
  tasks: Task[],
): PhasesMap {
  const phasesMap: PhasesMap = {
    preparation: [],
    passation: [],
    contractualization: [],
    execution: [],
  };

  taskActivities.forEach((ta) => {
    const task = tasks.find((t) => t.id === ta.taskId);
    if (task?.phaseType && task.phaseType in phasesMap) {
      phasesMap[task.phaseType].push({
        taskActivity: { ...ta, taskName: task.name, valueType: task.valueType },
        task,
      });
    }
  });

  // Trier par order dans chaque phase
  (Object.keys(phasesMap) as PhaseType[]).forEach((phase) => {
    phasesMap[phase].sort(
      (a, b) => (a.task?.order ?? 0) - (b.task?.order ?? 0),
    );
  });

  return phasesMap;
}
