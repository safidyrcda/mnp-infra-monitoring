'use client';

import {
  ChevronDown,
  MessageCircle,
  Plus,
  Paperclip,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Pencil,
  Calendar,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FollowUpsMap } from './InfrastructureTracker';
import { TaskActivityFollowUp, TaskValueType, Status } from '../_types/types';
import { TaskActivityWithName, VALUE_TYPE_LABELS } from '../_utils/utils';

const STATUS_COLORS: Record<Status, string> = {
  NON_FAIT: 'text-muted-foreground',
  EN_COURS: 'text-blue-600 dark:text-blue-400',
  REALISE: 'text-amber-600 dark:text-amber-400',
  VALIDE: 'text-green-600 dark:text-green-500',
};

const STATUS_LABELS: Record<Status, string> = {
  NON_FAIT: 'Non fait',
  EN_COURS: 'En cours',
  REALISE: 'Réalisé',
  VALIDE: 'Validé',
};

interface TaskListProps {
  items: { taskActivity: TaskActivityWithName }[];
  followUps: FollowUpsMap;
  expandedTaskActivityId: string | null;
  onToggleTask: (id: string) => void;
  onOpenFollowUp: (taskActivityId: string, taskName: string) => void;
  onEditTaskActivity: (taskActivity: TaskActivityWithName) => void;
}

export function TaskList({
  items,
  followUps,
  expandedTaskActivityId,
  onToggleTask,
  onOpenFollowUp,
  onEditTaskActivity,
}: TaskListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground italic">Aucune tâche</p>;
  }

  return (
    <div className="space-y-2">
      {items.map(({ taskActivity }) => {
        const isExpanded = expandedTaskActivityId === taskActivity.id;
        const taskFollowUps: TaskActivityFollowUp[] =
          followUps.get(taskActivity.id) ?? [];
        const hasProblems = taskFollowUps.some((f) => f.problemDescription);
        const status: Status = taskActivity.status ?? 'NON_FAIT';

        return (
          <div
            key={taskActivity.id}
            className="bg-background rounded border border-border"
          >
            {/* Header de la tâche */}
            <div className="flex items-center justify-between p-3 gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground text-sm">
                    {taskActivity.taskName}
                  </span>
                  {hasProblems && (
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span
                    className={`text-xs font-medium ${STATUS_COLORS[status]}`}
                  >
                    {STATUS_LABELS[status]}
                  </span>
                  {taskActivity.dueDate && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(taskActivity.dueDate).toLocaleDateString(
                        'fr-FR',
                      )}
                    </span>
                  )}
                  {taskFollowUps.length > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {taskFollowUps.length} suivi
                      {taskFollowUps.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Modifier la tâche */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  title="Modifier la tâche"
                  onClick={() => onEditTaskActivity(taskActivity)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>

                {/* Ajouter un suivi */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() =>
                    onOpenFollowUp(taskActivity.id, taskActivity.taskName)
                  }
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Suivi
                </Button>

                {/* Déplier l'historique */}
                {taskFollowUps.length > 0 && (
                  <button
                    onClick={() => onToggleTask(taskActivity.id)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Historique des suivis */}
            {isExpanded && (
              <div className="border-t border-border px-3 pb-3 pt-2 space-y-2">
                {taskFollowUps.map((followUp) => (
                  <div
                    key={followUp.id}
                    className="rounded border border-border bg-muted/30 p-2.5 space-y-1.5"
                  >
                    {/* En-tête du suivi : statut + date */}
                    <div className="flex items-center justify-between gap-2">
                      {followUp.status && (
                        <span
                          className={`text-xs font-medium ${STATUS_COLORS[followUp.status]}`}
                        >
                          {STATUS_LABELS[followUp.status]}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(followUp.createdAt).toLocaleDateString(
                          'fr-FR',
                        )}
                      </span>
                    </div>

                    {/* Commentaire */}
                    {followUp.commentaire && (
                      <p className="text-xs text-foreground">
                        {followUp.commentaire}
                      </p>
                    )}

                    {/* Bloc problème / solution / suite */}
                    {followUp.problemDescription && (
                      <div className="space-y-1.5 border-t border-destructive/20 pt-2">
                        <div className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-destructive mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-foreground">
                            {followUp.problemDescription}
                          </p>
                        </div>
                        {followUp.proposedSolution && (
                          <div className="flex items-start gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-foreground">
                              {followUp.proposedSolution}
                            </p>
                          </div>
                        )}
                        {followUp.nextAction && (
                          <div className="flex items-start gap-1.5">
                            <ArrowRight className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-foreground">
                              {followUp.nextAction}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fichier joint */}
                    {followUp.fichierJoint && (
                      <p className="text-xs text-primary flex items-center gap-1">
                        <Paperclip className="w-3 h-3" />
                        {followUp.fichierJoint}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
