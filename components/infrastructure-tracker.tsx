'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Check,
  Clock,
  AlertCircle,
  X,
  Save,
} from 'lucide-react';
import { Activity, EtapeActivity } from '@/lib/type';
import { mockActivities } from '@/lib/mock';
import { getAllEtapes } from '@/app/_actions/actions';
import { Etape } from '@/prisma/app/generated/prisma/client';

const createActivityWithEtapes = (
  id: string,
  name: string,
  site: string,
  type: 'ECOT' | 'ADMIN',
): Activity => ({
  id,
  name,
  site,
  type,
});

const statusColors = {
  'Non fait': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  'En cours':
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Réalisé: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Validé: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const statusIcons = {
  'Non fait': AlertCircle,
  'En cours': Clock,
  Réalisé: Check,
  Validé: Check,
};

export function InfrastructureTracker() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [selectedSite, setSelectedSite] = useState('Tous les sites');
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(
    null,
  );
  const [expandedEtapeId, setExpandedEtapeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<Partial<Activity>>({});
  const [etapes, setEtapes] = useState<Etape[]>([]);

  const fetchEtapes = async () => {
    const res = await getAllEtapes();
    setEtapes(res);
  };

  useEffect(() => {
    fetchEtapes();
  }, []);
  const groupEtapesByPhase = (activity: Activity) => {
    const phasesMap: Record<
      'preparation' | 'passation' | 'contractualization' | 'execution',
      EtapeActivity[]
    > = {
      preparation: [],
      passation: [],
      contractualization: [],
      execution: [],
    };

    return phasesMap;
  };

  const sites = useMemo(() => {
    const uniqueSites = [
      'Tous les sites',
      ...new Set(activities.map((a) => a.site)),
    ];
    return uniqueSites;
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSite =
        selectedSite === 'Tous les sites' || activity.site === selectedSite;
      const matchesSearch = activity.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSite && matchesSearch;
    });
  }, [activities, selectedSite, searchTerm]);

  const handleAddActivity = () => {
    const newActivity = createActivityWithEtapes(
      Date.now().toString(),
      formData.name || 'Nouvelle activité',
      formData.site || 'Ranomafana',
      formData.type || 'ECOT',
    );
    setActivities([...activities, newActivity]);
    setShowAddModal(false);
    setFormData({});
  };

  const handleEditActivity = () => {
    if (!editingActivity) return;
    const updatedActivities = activities.map((a) =>
      a.id === editingActivity.id ? editingActivity : a,
    );
    setActivities(updatedActivities);
    setShowEditModal(false);
    setEditingActivity(null);
    setFormData({});
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const handleUpdateEtapeStatus = (activityId: string) => {
    const updatedActivities = activities.map((activity) => {
      if (activity.id === activityId) {
        return {
          ...activity,
        };
      }
      return activity;
    });
    setActivities(updatedActivities);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-background to-muted/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
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
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Activité
              </Button>
            </div>
          </div>

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

        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <Card className="border-border">
              <CardContent className="pt-6 text-center text-muted-foreground">
                Aucune activité trouvée
              </CardContent>
            </Card>
          ) : (
            filteredActivities.map((activity) => (
              <Card key={activity.id} className="border-border overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedActivityId(
                      expandedActivityId === activity.id ? null : activity.id,
                    )
                  }
                  className="w-full text-left hover:bg-muted/50 transition-colors"
                >
                  <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <ChevronDown
                          className={`w-5 h-5 mt-1 text-muted-foreground transition-transform ${
                            expandedActivityId === activity.id
                              ? 'rotate-180'
                              : ''
                          }`}
                        />
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {activity.name}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary">{activity.site}</Badge>
                            <Badge variant="outline">{activity.type}</Badge>
                            <Badge variant="outline"></Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Progression
                      </p>
                    </div>
                  </CardHeader>
                </button>

                {expandedActivityId === activity.id && (
                  <CardContent className="pt-0 border-t border-border">
                    <div className="mt-4 space-y-4">
                      {etapes.map((et) => {
                        return (
                          <div
                            key={et.id}
                            className="p-4 bg-muted/30 rounded-lg border border-border"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-semibold">{et.nom}</span>
                            </div>

                            {/* {et.etapeActivities.length > 0 && (
                              <div className="space-y-2 mt-3">
                                {etapes.map((etapeActivite) => {
                                  const etape = etapeActivite.etape;

                                  return (
                                    <button
                                      key={etapeActivite.id}
                                      onClick={() =>
                                        setExpandedEtapeId(
                                          expandedEtapeId === etapeActivite.id
                                            ? null
                                            : etapeActivite.id,
                                        )
                                      }
                                      className="w-full text-left p-2 bg-background rounded hover:bg-muted/50 transition-colors border border-border/50"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                          <p className="text-sm font-medium">
                                            {etape.nom}
                                          </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <Badge
                                            className={
                                              statusColors[etapeActivite.status]
                                            }
                                          >
                                            {etapeActivite.status}
                                          </Badge>

                                          <ChevronDown
                                            className={`w-4 h-4 text-muted-foreground transition-transform ${
                                              expandedEtapeId ===
                                              etapeActivite.id
                                                ? 'rotate-180'
                                                : ''
                                            }`}
                                          />
                                        </div>
                                      </div>

                                      {expandedEtapeId === etapeActivite.id && (
                                        <div className="mt-3 pt-3 border-t border-border/50 space-y-2 text-sm">
                                          <select
                                            value={etapeActivite.status}
                                            onChange={(e) =>
                                              handleUpdateEtapeStatus(
                                                activity.id,
                                              )
                                            }
                                            className="p-1 text-xs border border-border rounded bg-background"
                                          >
                                            <option value="Non fait">
                                              Non fait
                                            </option>
                                            <option value="En cours">
                                              En cours
                                            </option>
                                            <option value="Réalisé">
                                              Réalisé
                                            </option>
                                            <option value="Validé">
                                              Validé
                                            </option>
                                          </select>
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )} */}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex justify-end gap-2 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingActivity(activity);
                          setFormData(activity);
                          setShowEditModal(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Éditer
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteActivity(activity.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Nouvelle Activité</CardTitle>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({});
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Nom de l'activité
                  </label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nom de l'activité"
                    className="mt-1 bg-card border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Site
                  </label>
                  <select
                    value={formData.site || 'Ranomafana'}
                    onChange={(e) =>
                      setFormData({ ...formData, site: e.target.value })
                    }
                    className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
                  >
                    {sites.slice(1).map((site) => (
                      <option key={site} value={site}>
                        {site}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Type
                    </label>
                    <select
                      value={formData.type || 'ECOT'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as 'ECOT' | 'ADMIN',
                        })
                      }
                      className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
                    >
                      <option value="ECOT">ECOT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      UG
                    </label>
                    {/* <Input
                      value={formData.unitaryGroup || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          unitaryGroup: e.target.value,
                        })
                      }
                      placeholder="UG"
                      className="mt-1 bg-card border-border"
                    /> */}
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({});
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleAddActivity}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showEditModal && editingActivity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Éditer l'activité</CardTitle>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingActivity(null);
                    setFormData({});
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Nom de l'activité
                  </label>
                  <Input
                    value={editingActivity.name}
                    onChange={(e) =>
                      setEditingActivity({
                        ...editingActivity,
                        name: e.target.value,
                      })
                    }
                    placeholder="Nom de l'activité"
                    className="mt-1 bg-card border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Site
                  </label>
                  <select
                    value={editingActivity.site}
                    onChange={(e) =>
                      setEditingActivity({
                        ...editingActivity,
                        site: e.target.value,
                      })
                    }
                    className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
                  >
                    {sites.slice(1).map((site) => (
                      <option key={site} value={site}>
                        {site}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Type
                    </label>
                    <select
                      value={editingActivity.type}
                      onChange={(e) =>
                        setEditingActivity({
                          ...editingActivity,
                          type: e.target.value as 'ECOT' | 'ADMIN',
                        })
                      }
                      className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
                    >
                      <option value="ECOT">ECOT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      UG
                    </label>
                    {/* <Input
                      value={editingActivity.unitaryGroup}
                      onChange={(e) =>
                        setEditingActivity({
                          ...editingActivity,
                          unitaryGroup: e.target.value,
                        })
                      }
                      placeholder="UG"
                      className="mt-1 bg-card border-border"
                    /> */}
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingActivity(null);
                      setFormData({});
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleEditActivity}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
