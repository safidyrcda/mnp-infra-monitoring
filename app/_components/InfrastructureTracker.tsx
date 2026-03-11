'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import {
  createEtapeActivityFollowUp,
  getAllActivities,
  getAllEtapes,
  getAllFollowUps,
  getEtapeActivitiesByActivity,
} from '@/app/_actions/actions';
import {
  Activity,
  Etape,
  EtapeActivity,
  EtapeActivityFollowUp,
} from '@/prisma/app/generated/prisma/client';

import { ActivityCard } from './ActivityCard';
import { ActivityModal } from './ActivityModal';
import { FollowUpModal } from './FollowUpModal';
import { groupEtapesByPhase } from './utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type FollowUpsMap = Map<string, EtapeActivityFollowUp[]>;

// ─── Component ───────────────────────────────────────────────────────────────

export function InfrastructureTracker() {
  // Data state
  const [activities, setActivities] = useState<Activity[]>([]);
  const [etapes, setEtapes] = useState<Etape[]>([]);
  const [etapeActivities, setEtapeActivities] = useState<EtapeActivity[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpsMap>(new Map());

  // UI state
  const [selectedSite, setSelectedSite] = useState('Tous les sites');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(
    null,
  );
  const [expandedEtapeActivityId, setExpandedEtapeActivityId] = useState<
    string | null
  >(null);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedEtapeActivityId, setSelectedEtapeActivityId] = useState<
    string | null
  >(null);

  // ─── Data fetching ──────────────────────────────────────────────────────────

  useEffect(() => {
    getAllEtapes().then(setEtapes);
    getAllActivities().then(setActivities);
    getAllFollowUps().then((data) => {
      const map = new Map<string, EtapeActivityFollowUp[]>();
      data.forEach((f) => {
        map.set(f.etapeActivityId, [...(map.get(f.etapeActivityId) ?? []), f]);
      });
      setFollowUps(map);
    });
  }, []);

  useEffect(() => {
    if (!expandedActivityId) return;
    getEtapeActivitiesByActivity(expandedActivityId).then(setEtapeActivities);
  }, [expandedActivityId]);

  // ─── Derived state ──────────────────────────────────────────────────────────

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
    () => groupEtapesByPhase(etapeActivities, etapes),
    [etapeActivities, etapes],
  );

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleAddActivity = (formData: Partial<Activity>) => {
    const newActivity: Activity = {
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

  const handleAddFollowUp = async (data: Partial<EtapeActivityFollowUp>) => {
    if (!selectedEtapeActivityId) return;
    const newFollowUp: EtapeActivityFollowUp = {
      id: Date.now().toString(),
      etapeActivityId: selectedEtapeActivityId,
      commentaire: data.commentaire || '',
      date: data.date || new Date(),
      status: data.status || 'EN_COURS',
      fichierJoint: data.fichierJoint || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: null,
      validatedById: null,
    };

    await createEtapeActivityFollowUp(newFollowUp);
    setFollowUps((prev) => {
      const updated = new Map(prev);
      updated.set(selectedEtapeActivityId, [
        ...(updated.get(selectedEtapeActivityId) || []),
        newFollowUp,
      ]);
      return updated;
    });
    setShowFollowUpModal(false);
    setSelectedEtapeActivityId(null);
  };

  const handleToggleActivity = (id: string) => {
    setExpandedActivityId((prev) => (prev === id ? null : id));
  };

  const handleOpenFollowUp = (etapeActivityId: string) => {
    setSelectedEtapeActivityId(etapeActivityId);
    setShowFollowUpModal(true);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

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

          {/* Filters */}
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

        {/* Activity List */}
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
                onToggle={() => handleToggleActivity(activity.id)}
                phases={phases}
                followUps={followUps}
                expandedEtapeActivityId={expandedEtapeActivityId}
                onToggleEtape={(id) =>
                  setExpandedEtapeActivityId((prev) =>
                    prev === id ? null : id,
                  )
                }
                onOpenFollowUp={handleOpenFollowUp}
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

      {showFollowUpModal && (
        <FollowUpModal
          onClose={() => {
            setShowFollowUpModal(false);
            setSelectedEtapeActivityId(null);
          }}
          onSubmit={handleAddFollowUp}
        />
      )}
    </div>
  );
}
