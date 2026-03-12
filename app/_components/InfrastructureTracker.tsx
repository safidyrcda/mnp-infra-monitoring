'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import {
  createTaskActivityFollowUp,
  getAllActivities,
  getAllTasks,
  getAllFollowUps,
  getTaskActivitiesByActivity,
} from '@/app/_actions/actions';
import {
  Activity,
  Task,
  TaskActivity,
  TaskActivityFollowUp,
  TaskValueType,
} from '@/app/_types/types';

import { ActivityCard } from './ActivityCard';
import { ActivityModal } from './ActivityModal';
import { FollowUpModal } from './FollowUpModal';
import { groupTasksByPhase } from '../_utils/utils';

export type FollowUpsMap = Map<string, TaskActivityFollowUp[]>;

export function InfrastructureTracker() {
  // ─── Data state ─────────────────────────────────────────────────────────────
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskActivities, setTaskActivities] = useState<TaskActivity[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpsMap>(new Map());

  // ─── UI state ────────────────────────────────────────────────────────────────
  const [selectedSite, setSelectedSite] = useState('Tous les sites');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(
    null,
  );
  const [expandedTaskActivityId, setExpandedTaskActivityId] = useState<
    string | null
  >(null);

  // ─── Modal state ─────────────────────────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [followUpContext, setFollowUpContext] = useState<{
    taskActivityId: string;
    valueType: TaskValueType;
    taskName: string;
  } | null>(null);

  // ─── Data fetching ───────────────────────────────────────────────────────────

  useEffect(() => {
    getAllTasks().then(setTasks);
    getAllActivities().then(setActivities);
    getAllFollowUps().then((data) => {
      const map = new Map<string, TaskActivityFollowUp[]>();
      data.forEach((f) => {
        map.set(f.taskActivityId, [...(map.get(f.taskActivityId) ?? []), f]);
      });
      setFollowUps(map);
    });
  }, []);

  useEffect(() => {
    if (!expandedActivityId) return;
    getTaskActivitiesByActivity(expandedActivityId).then(setTaskActivities);
  }, [expandedActivityId]);

  // ─── Derived state ───────────────────────────────────────────────────────────

  const sites = useMemo(
    () => ['Tous les sites', ...new Set(activities.map((a) => a.site))],
    [activities],
  );

  const filteredActivities = useMemo(
    () =>
      activities.filter((a) => {
        const matchesSite =
          selectedSite === 'Tous les sites' || a.site === selectedSite;
        const matchesSearch = a.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchesSite && matchesSearch;
      }),
    [activities, selectedSite, searchTerm],
  );

  const phases = useMemo(
    () => groupTasksByPhase(taskActivities, tasks),
    [taskActivities, tasks],
  );

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleAddActivity = (formData: Partial<Activity>) => {
    const newActivity = {
      id: Date.now().toString(),
      name: formData.name || 'Nouvelle activité',
      site: formData.site || 'Ranomafana',
      type: formData.type || 'ECOT',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Activity;
    setActivities((prev) => [...prev, newActivity]);
    setShowAddModal(false);
  };

  const handleEditActivity = (updated: Activity) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a)),
    );
    setShowEditModal(false);
    setEditingActivity(null);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddFollowUp = async (data: Partial<TaskActivityFollowUp>) => {
    if (!followUpContext) return;
    const { taskActivityId } = followUpContext;

    const newFollowUp: TaskActivityFollowUp = {
      id: Date.now().toString(),
      taskActivityId,
      commentaire: data.commentaire ?? null,
      status: data.status ?? null,
      valueString: data.valueString ?? null,
      valueNumber: data.valueNumber ?? null,
      valueDate: data.valueDate ?? null,
      problemDescription: data.problemDescription ?? null,
      proposedSolution: data.proposedSolution ?? null,
      nextAction: data.nextAction ?? null,
      fichierJoint: data.fichierJoint ?? null,
      createdById: null,
      validatedById: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await createTaskActivityFollowUp(newFollowUp);

    setFollowUps((prev) => {
      const updated = new Map(prev);
      updated.set(taskActivityId, [
        ...(updated.get(taskActivityId) ?? []),
        newFollowUp,
      ]);
      return updated;
    });
    setFollowUpContext(null);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-background to-muted/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Suivi des Infrastructures
              </h1>
              <p className="text-muted-foreground mt-1">
                Madagascar National Parks
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Activité
            </Button>
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une activité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-card border-border"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {sites.map((site) => (
                <Button
                  key={site}
                  variant={selectedSite === site ? 'default' : 'outline'}
                  onClick={() => setSelectedSite(site)}
                  className={
                    selectedSite === site
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : 'border-border hover:bg-muted'
                  }
                >
                  {site}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des activités */}
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <Card className="border-border">
              <CardContent className="pt-6 text-center text-muted-foreground">
                Aucune activité trouvée
              </CardContent>
            </Card>
          ) : (
            filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isExpanded={expandedActivityId === activity.id}
                onToggle={() =>
                  setExpandedActivityId((prev) =>
                    prev === activity.id ? null : activity.id,
                  )
                }
                phases={phases}
                followUps={followUps}
                expandedTaskActivityId={expandedTaskActivityId}
                onToggleTask={(id) =>
                  setExpandedTaskActivityId((prev) => (prev === id ? null : id))
                }
                onOpenFollowUp={(taskActivityId, valueType, taskName) =>
                  setFollowUpContext({ taskActivityId, valueType, taskName })
                }
                onEdit={() => {
                  setEditingActivity(activity);
                  setShowEditModal(true);
                }}
                onDelete={() => handleDeleteActivity(activity.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <ActivityModal
          title="Nouvelle Activité"
          sites={sites.slice(1)}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddActivity}
        />
      )}

      {showEditModal && editingActivity && (
        <ActivityModal
          title="Éditer l'activité"
          sites={sites.slice(1)}
          initialData={editingActivity}
          onClose={() => {
            setShowEditModal(false);
            setEditingActivity(null);
          }}
          onSubmit={(data) =>
            handleEditActivity({ ...editingActivity, ...data })
          }
          submitLabel="Enregistrer"
        />
      )}

      {followUpContext && (
        <FollowUpModal
          taskName={followUpContext.taskName}
          valueType={followUpContext.valueType}
          onClose={() => setFollowUpContext(null)}
          onSubmit={handleAddFollowUp}
        />
      )}
    </div>
  );
}
