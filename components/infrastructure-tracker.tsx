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
  X,
  Save,
  MessageCircle,
  Paperclip,
} from 'lucide-react';

import {
  getAllActivities,
  getAllEtapes,
  getEtapeActivitiesByActivity,
} from '@/app/_actions/actions';
import {
  Activity,
  Etape,
  EtapeActivity,
  EtapeActivityFollowUp,
} from '@/prisma/app/generated/prisma/client';

const createActivityWithEtapes = (
  id: string,
  name: string,
  site: string,
  type: 'ECOT' | 'ADMIN',
): Partial<Activity> => ({
  id,
  name,
  site,
  type,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export function InfrastructureTracker() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedSite, setSelectedSite] = useState('Tous les sites');
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<Partial<Activity>>({});
  const [etapes, setEtapes] = useState<Etape[]>([]);
  const [followUps, setFollowUps] = useState<
    Map<string, EtapeActivityFollowUp[]>
  >(new Map());
  const [expandedEtapeActivityId, setExpandedEtapeActivityId] = useState<
    string | null
  >(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedEtapeActivityId, setSelectedEtapeActivityId] = useState<
    string | null
  >(null);
  const [followUpFormData, setFollowUpFormData] = useState<
    Partial<EtapeActivityFollowUp>
  >({});

  const fetchEtapes = async () => {
    const res = await getAllEtapes();
    setEtapes(res);
  };

  const fetchActivities = async () => {
    const res = await getAllActivities();
    setActivities(res);
  };

  const fetchEtapeActivities = async (activityId: string) => {
    const res = await getEtapeActivitiesByActivity(activityId);

    return res;
  };

  const [etapeActivities, setEtapeActivities] = useState<EtapeActivity[]>([]);

  const handleAddFollowUp = () => {
    if (!selectedEtapeActivityId) return;
    const newFollowUp: EtapeActivityFollowUp = {
      id: Date.now().toString(),
      etapeActivityId: selectedEtapeActivityId,
      commentaire: followUpFormData.commentaire || '',
      date: followUpFormData.date || new Date(),
      status: followUpFormData.status || 'EN_COURS',
      fichierJoint: followUpFormData.fichierJoint || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: null,
      validatedById: null,
    };

    const updated = new Map(followUps);
    const current = updated.get(selectedEtapeActivityId) || [];
    updated.set(selectedEtapeActivityId, [...current, newFollowUp]);
    setFollowUps(updated);

    setShowFollowUpModal(false);
    setFollowUpFormData({});
    setSelectedEtapeActivityId(null);
  };

  useEffect(() => {
    if (expandedActivityId) {
      fetchEtapeActivities(expandedActivityId).then((data) => {
        setEtapeActivities(data);
      });
    }
  }, [expandedActivityId]);

  useEffect(() => {
    fetchEtapes();
    fetchActivities();
  }, []);

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
    setActivities([...activities, newActivity as Activity]);
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

  const groupEtapesByPhase = () => {
    const phasesMap: Record<
      'preparation' | 'passation' | 'contractualization' | 'execution',
      { etape: EtapeActivity & { etapeName: string }; etapeObj?: Etape }[]
    > = {
      preparation: [],
      passation: [],
      contractualization: [],
      execution: [],
    };

    etapeActivities.forEach((et) => {
      const etape = etapes.find((e) => e.id === et.etapeId);
      if (etape?.phaseType) {
        phasesMap[etape.phaseType].push({
          etape: { ...et, etapeName: etape.nom },
          etapeObj: etape,
        });
      }
    });

    return phasesMap;
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
                    <div className="mt-4 space-y-6">
                      {(() => {
                        const phases = groupEtapesByPhase();
                        const phaseLabels: Record<string, string> = {
                          preparation: 'Phase de Préparation',
                          passation: 'Phase de Passation',
                          contractualization: 'Phase de Contractualisation',
                          execution: "Phase d'Exécution",
                        };
                        const phaseBgColors: Record<string, string> = {
                          preparation:
                            'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
                          passation:
                            'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
                          contractualization:
                            'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
                          execution:
                            'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
                        };

                        return (
                          Object.keys(phases) as Array<keyof typeof phases>
                        ).map((phaseType) => (
                          <div
                            key={phaseType}
                            className={`p-4 rounded-lg border-2 ${phaseBgColors[phaseType]}`}
                          >
                            <h3 className="text-lg font-bold mb-4 text-foreground">
                              {phaseLabels[phaseType]}
                            </h3>
                            <div className="space-y-3">
                              {phases[phaseType].length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">
                                  Aucune étape
                                </p>
                              ) : (
                                phases[phaseType].map((item) => (
                                  <div
                                    key={item.etape.id}
                                    className="bg-background rounded border border-border p-3"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex-1">
                                        <span className="font-semibold text-foreground">
                                          {item.etape.etapeName}
                                        </span>
                                        <div className="mt-1 flex gap-2">
                                          <Badge variant="outline">
                                            {item.etape.status || 'NON_FAIT'}
                                          </Badge>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() =>
                                          setExpandedEtapeActivityId(
                                            expandedEtapeActivityId ===
                                              item.etape.id
                                              ? null
                                              : item.etape.id,
                                          )
                                        }
                                        className="p-1 hover:bg-muted rounded"
                                      >
                                        <ChevronDown
                                          className={`w-4 h-4 transition-transform ${
                                            expandedEtapeActivityId ===
                                            item.etape.id
                                              ? 'rotate-180'
                                              : ''
                                          }`}
                                        />
                                      </button>
                                    </div>

                                    {expandedEtapeActivityId ===
                                      item.etape.id && (
                                      <div className="mt-3 space-y-3 border-t border-border pt-3">
                                        <div className="text-sm">
                                          <p className="text-muted-foreground">
                                            Commentaire:
                                          </p>
                                          <p className="text-foreground mt-1">
                                            {item.etape.commentaire ||
                                              'Aucun commentaire'}
                                          </p>
                                        </div>

                                        {item.etape.dueDate && (
                                          <div className="text-sm">
                                            <p className="text-muted-foreground">
                                              Date limite:
                                            </p>
                                            <p className="text-foreground">
                                              {new Date(
                                                item.etape.dueDate,
                                              ).toLocaleDateString('fr-FR')}
                                            </p>
                                          </div>
                                        )}

                                        <div className="bg-muted/50 rounded p-2 mt-2">
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold flex items-center gap-2">
                                              <MessageCircle className="w-4 h-4" />
                                              Suivis (
                                              {
                                                (
                                                  followUps.get(
                                                    item.etape.id,
                                                  ) || []
                                                ).length
                                              }
                                              )
                                            </span>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => {
                                                setSelectedEtapeActivityId(
                                                  item.etape.id,
                                                );
                                                setShowFollowUpModal(true);
                                              }}
                                            >
                                              <Plus className="w-3 h-3 mr-1" />
                                              Ajouter
                                            </Button>
                                          </div>

                                          <div className="space-y-2">
                                            {(
                                              followUps.get(item.etape.id) || []
                                            ).map((followUp) => (
                                              <div
                                                key={followUp.id}
                                                className="bg-background border border-border rounded p-2 text-sm"
                                              >
                                                <div className="flex items-start justify-between">
                                                  <div className="flex-1">
                                                    <p className="text-foreground font-medium">
                                                      {followUp.commentaire}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                      {new Date(
                                                        followUp.date ||
                                                          new Date(),
                                                      ).toLocaleDateString(
                                                        'fr-FR',
                                                      )}{' '}
                                                      -{followUp.status}
                                                    </p>
                                                    {followUp.fichierJoint && (
                                                      <p className="text-xs text-primary mt-1 flex items-center gap-1">
                                                        <Paperclip className="w-3 h-3" />
                                                        {followUp.fichierJoint}
                                                      </p>
                                                    )}
                                                  </div>
                                                  {/* <button
                                                    onClick={() =>
                                                      handleDeleteFollowUp(
                                                        item.etape.id,
                                                        followUp.id,
                                                      )
                                                    }
                                                    className="text-destructive hover:text-destructive/80 p-1"
                                                  >
                                                    <X className="w-4 h-4" />
                                                  </button> */}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        ));
                      })()}
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

        {showFollowUpModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Ajouter un suivi</CardTitle>
                <button
                  onClick={() => {
                    setShowFollowUpModal(false);
                    setFollowUpFormData({});
                    setSelectedEtapeActivityId(null);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Commentaire
                  </label>
                  <textarea
                    value={followUpFormData.commentaire || ''}
                    onChange={(e) =>
                      setFollowUpFormData({
                        ...followUpFormData,
                        commentaire: e.target.value,
                      })
                    }
                    placeholder="Entrez votre commentaire"
                    className="mt-1 w-full p-2 border border-border rounded-md bg-card text-foreground min-h-24"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Statut
                  </label>
                  <select
                    value={followUpFormData.status || 'EN_COURS'}
                    onChange={(e) =>
                      setFollowUpFormData({
                        ...followUpFormData,
                        status: e.target
                          .value as EtapeActivityFollowUp['status'],
                      })
                    }
                    className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
                  >
                    <option value="NON_FAIT">{'Non fait'}</option>
                    <option value="EN_COURS">{'En cours'}</option>
                    <option value="REALISE">{'Réalisé'}</option>
                    <option value="VALIDE">{'Validé'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Date
                  </label>
                  <input
                    type="date"
                    value={
                      followUpFormData.date
                        ? new Date(followUpFormData.date)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setFollowUpFormData({
                        ...followUpFormData,
                        date: new Date(e.target.value),
                      })
                    }
                    className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Fichier joint (optionnel)
                  </label>
                  <Input
                    value={followUpFormData.fichierJoint || ''}
                    onChange={(e) =>
                      setFollowUpFormData({
                        ...followUpFormData,
                        fichierJoint: e.target.value,
                      })
                    }
                    placeholder="Nom du fichier"
                    className="mt-1 bg-card border-border"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowFollowUpModal(false);
                      setFollowUpFormData({});
                      setSelectedEtapeActivityId(null);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleAddFollowUp}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
