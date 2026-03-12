'use client';

import {
  ChevronDown,
  MessageCircle,
  Plus,
  Paperclip,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FollowUpsMap } from './InfrastructureTracker';
import { TaskActivityFollowUp, TaskValueType } from '../_types/types';
import { TaskActivityWithName, VALUE_TYPE_LABELS } from '../_utils/utils';

// ─── Affichage de la valeur d'un suivi selon le valueType ─────────────────────

function FollowUpValue({
  followUp,
  valueType,
}: {
  followUp: TaskActivityFollowUp;
  valueType: TaskValueType;
}) {
  switch (valueType) {
    case 'DATE':
      return followUp.valueDate ? (
        <span className="font-medium text-foreground">
          {new Date(followUp.valueDate).toLocaleDateString('fr-FR')}
        </span>
      ) : null;
    case 'PERCENTAGE':
      return followUp.valueNumber != null ? (
        <div className="flex items-center gap-2 flex-1">
          <span className="font-semibold text-foreground">
            {followUp.valueNumber}%
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${Math.min(100, followUp.valueNumber)}%` }}
            />
          </div>
        </div>
      ) : null;
    case 'STATUS':
      return followUp.status ? (
        <Badge variant="outline">{followUp.status}</Badge>
      ) : null;
    case 'DOCUMENT':
      return followUp.valueString ? (
        <span className="font-medium text-foreground font-mono text-xs bg-muted px-2 py-0.5 rounded">
          {followUp.valueString}
        </span>
      ) : null;
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TaskListProps {
  items: { taskActivity: TaskActivityWithName }[];
  followUps: FollowUpsMap;
  expandedTaskActivityId: string | null;
  onToggleTask: (id: string) => void;
  onOpenFollowUp: (
    taskActivityId: string,
    valueType: TaskValueType,
    taskName: string,
  ) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskList({
  items,
  followUps,
  expandedTaskActivityId,
  onToggleTask,
  onOpenFollowUp,
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

        return (
          <div
            key={taskActivity.id}
            className="bg-background rounded border border-border"
          >
            {/* Header de la tâche */}
            <div className="flex items-center justify-between p-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground text-sm">
                    {taskActivity.taskName}
                  </span>
                  {hasProblems && (
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {taskActivity.status ?? 'NON_FAIT'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {VALUE_TYPE_LABELS[taskActivity.valueType]}
                  </span>
                  {taskFollowUps.length > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {taskFollowUps.length} suivi
                      {taskFollowUps.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() =>
                    onOpenFollowUp(
                      taskActivity.id,
                      taskActivity.valueType,
                      taskActivity.taskName,
                    )
                  }
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Suivi
                </Button>
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

            {/* Détail de la tâche + historique des suivis */}
            {isExpanded && (
              <div className="border-t border-border px-3 pb-3 pt-2 space-y-2">
                {taskActivity.commentaire && (
                  <p className="text-xs text-muted-foreground italic">
                    {taskActivity.commentaire}
                  </p>
                )}

                {taskFollowUps.map((followUp) => (
                  <div
                    key={followUp.id}
                    className="rounded border border-border bg-muted/30 p-2.5 text-sm space-y-2"
                  >
                    {/* Valeur + date */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <FollowUpValue
                        followUp={followUp}
                        valueType={taskActivity.valueType}
                      />
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(followUp.createdAt).toLocaleDateString(
                          'fr-FR',
                        )}
                      </span>
                    </div>

                    {/* Commentaire */}
                    {followUp.commentaire && (
                      <p className="text-foreground text-xs">
                        {followUp.commentaire}
                      </p>
                    )}

                    {/* Bloc problème/solution */}
                    {followUp.problemDescription && (
                      <div className="space-y-1.5 border-t border-destructive/20 pt-2 mt-1">
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
