'use client';

import { ChevronDown, MessageCircle, Plus, Paperclip } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EtapeActivityFollowUp } from '@/prisma/app/generated/prisma/client';

import { EtapeActivityWithName } from './utils';
import { FollowUpsMap } from './InfrastructureTracker';

interface EtapeListProps {
  items: { etape: EtapeActivityWithName }[];
  followUps: FollowUpsMap;
  expandedEtapeActivityId: string | null;
  onToggleEtape: (id: string) => void;
  onOpenFollowUp: (etapeActivityId: string) => void;
}

export function EtapeList({
  items,
  followUps,
  expandedEtapeActivityId,
  onToggleEtape,
  onOpenFollowUp,
}: EtapeListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground italic">Aucune étape</p>;
  }

  return (
    <div className="space-y-3">
      {items.map(({ etape }) => {
        const isExpanded = expandedEtapeActivityId === etape.id;
        const etapeFollowUps: EtapeActivityFollowUp[] = followUps.get(etape.id) || [];

        return (
          <div key={etape.id} className="bg-background rounded border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <span className="font-semibold text-foreground">{etape.etapeName}</span>
                <div className="mt-1 flex gap-2">
                  <Badge variant="outline">{etape.status || 'NON_FAIT'}</Badge>
                </div>
              </div>
              <button
                onClick={() => onToggleEtape(etape.id)}
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
                  <p className="text-muted-foreground">Commentaire:</p>
                  <p className="text-foreground mt-1">
                    {etape.commentaire || 'Aucun commentaire'}
                  </p>
                </div>

                {etape.dueDate && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Date limite:</p>
                    <p className="text-foreground">
                      {new Date(etape.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}

                <div className="bg-muted/50 rounded p-2 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Suivis ({etapeFollowUps.length})
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenFollowUp(etape.id)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Ajouter
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {etapeFollowUps.map((followUp) => (
                      <div
                        key={followUp.id}
                        className="bg-background border border-border rounded p-2 text-sm"
                      >
                        <p className="text-foreground font-medium">{followUp.commentaire}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(followUp.date || new Date()).toLocaleDateString('fr-FR')} —{' '}
                          {followUp.status}
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
