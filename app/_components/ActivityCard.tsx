'use client';

import { ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity } from '@/app/_types/types';

import {
  PhasesMap,
  PHASE_LABELS,
  PHASE_BG_COLORS,
  PHASE_DESCRIPTIONS,
  PhaseType,
  TaskValueType,
} from '@/app/_utils/utils';
import { FollowUpsMap } from './InfrastructureTracker';
import { TaskList } from './TaskList';

interface ActivityCardProps {
  activity: Activity;
  isExpanded: boolean;
  onToggle: () => void;
  phases: PhasesMap;
  followUps: FollowUpsMap;
  expandedTaskActivityId: string | null;
  onToggleTask: (id: string) => void;
  onOpenFollowUp: (
    taskActivityId: string,
    valueType: TaskValueType,
    taskName: string,
  ) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ActivityCard({
  activity,
  isExpanded,
  onToggle,
  phases,
  followUps,
  expandedTaskActivityId,
  onToggleTask,
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
                className={`w-5 h-5 mt-1 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
        </CardHeader>
      </button>

      {isExpanded && (
        <CardContent className="pt-0 border-t border-border">
          <div className="mt-4 space-y-5">
            {(Object.keys(phases) as PhaseType[]).map((phaseType) => (
              <div
                key={phaseType}
                className={`p-4 mt-2 rounded-lg border-2 ${PHASE_BG_COLORS[phaseType]}`}
              >
                <div className="mb-3">
                  <h3 className="text-base font-bold text-foreground">
                    {PHASE_LABELS[phaseType]}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {PHASE_DESCRIPTIONS[phaseType]}
                  </p>
                </div>
                <TaskList
                  items={phases[phaseType]}
                  followUps={followUps}
                  expandedTaskActivityId={expandedTaskActivityId}
                  onToggleTask={onToggleTask}
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
