'use client';

import { ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { PhasesMap, PHASE_LABELS, PHASE_BG_COLORS, PhaseType } from './utils';
import { FollowUpsMap } from './InfrastructureTracker';
import { StepList } from './StepList';
import { Activity } from '@/prisma/app/generated/prisma/browser';

interface ActivityCardProps {
  activity: Activity;
  isExpanded: boolean;
  onToggle: () => void;
  phases: PhasesMap;
  followUps: FollowUpsMap;
  expandedStepActivityId: string | null;
  onToggleStep: (id: string) => void;
  onOpenFollowUp: (stepActivityId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ActivityCard({
  activity,
  isExpanded,
  onToggle,
  phases,
  followUps,
  expandedStepActivityId,
  onToggleStep,
  onOpenFollowUp,
  onEdit,
  onDelete,
}: ActivityCardProps) {
  return (
    <Card className="border-border overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left hover:bg-muted/50 transition-colors"
      >
        <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <ChevronDown
                className={`w-5 h-5 mt-1 text-muted-foreground transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
              <div className="flex-1">
                <CardTitle className="text-lg">{activity.name}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{activity.site}</Badge>
                  <Badge variant="outline">{activity.type}</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Progression</p>
          </div>
        </CardHeader>
      </button>

      {isExpanded && (
        <CardContent className="pt-0 border-t border-border">
          <div className="mt-4 space-y-6">
            {(Object.keys(phases) as PhaseType[]).map((phaseType) => (
              <div
                key={phaseType}
                className={`p-4 rounded-lg border-2 ${PHASE_BG_COLORS[phaseType]}`}
              >
                <h3 className="text-lg font-bold mb-4 text-foreground">
                  {PHASE_LABELS[phaseType]}
                </h3>
                <StepList
                  items={phases[phaseType]}
                  followUps={followUps}
                  expandedStepActivityId={expandedStepActivityId}
                  onToggleStep={onToggleStep}
                  onOpenFollowUp={onOpenFollowUp}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="w-4 h-4 mr-2" />
              Éditer
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
