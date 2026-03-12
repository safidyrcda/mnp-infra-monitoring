'use client';

import { ChevronDown, MessageCircle, Plus, Paperclip } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StepActivityWithName } from './utils';
import { FollowUpsMap } from './InfrastructureTracker';
import { StepActivityFollowUp } from '@/prisma/app/generated/prisma/browser';

interface StepListProps {
  items: { stepActivity: StepActivityWithName }[];
  followUps: FollowUpsMap;
  expandedStepActivityId: string | null;
  onToggleStep: (id: string) => void;
  onOpenFollowUp: (stepActivityId: string) => void;
}

export function StepList({
  items,
  followUps,
  expandedStepActivityId,
  onToggleStep,
  onOpenFollowUp,
}: StepListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground italic">Aucune étape</p>;
  }

  return (
    <div className="space-y-3">
      {items.map(({ stepActivity }) => {
        const isExpanded = expandedStepActivityId === stepActivity.id;
        const stepFollowUps: StepActivityFollowUp[] =
          followUps.get(stepActivity.id) ?? [];

        return (
          <div
            key={stepActivity.id}
            className="bg-background rounded border border-border p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <span className="font-semibold text-foreground">
                  {stepActivity.stepName}
                </span>
                <div className="mt-1 flex gap-2">
                  <Badge variant="outline">
                    {stepActivity.status ?? 'NON_FAIT'}
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => onToggleStep(stepActivity.id)}
                className="p-1 hover:bg-muted rounded"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {isExpanded && (
              <div className="mt-3 space-y-3 border-t border-border pt-3">
                <div className="text-sm">
                  <p className="text-muted-foreground">Commentaire :</p>
                  <p className="text-foreground mt-1">
                    {stepActivity.commentaire ?? 'Aucun commentaire'}
                  </p>
                </div>

                {stepActivity.dueDate && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Date limite :</p>
                    <p className="text-foreground">
                      {new Date(stepActivity.dueDate).toLocaleDateString(
                        'fr-FR',
                      )}
                    </p>
                  </div>
                )}

                <div className="bg-muted/50 rounded p-2 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Suivis ({stepFollowUps.length})
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenFollowUp(stepActivity.id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Ajouter
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {stepFollowUps.map((followUp) => (
                      <div
                        key={followUp.id}
                        className="bg-background border border-border rounded p-2 text-sm"
                      >
                        <p className="text-foreground font-medium">
                          {followUp.commentaire}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(followUp.createdAt).toLocaleDateString(
                            'fr-FR',
                          )}
                          {followUp.status ? ` — ${followUp.status}` : ''}
                        </p>
                        {followUp.fichierJoint && (
                          <p className="text-xs text-primary mt-1 flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            {followUp.fichierJoint}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
