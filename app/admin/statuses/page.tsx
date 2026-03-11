'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, X, Save, RotateCcw } from 'lucide-react';

interface Status {
  id: string;
  name: string;
  color: string;
  description: string;
}

const defaultStatuses: Status[] = [
  { id: '1', name: 'Non fait', color: '#EF4444', description: 'Activité non commencée' },
  { id: '2', name: 'En cours', color: '#F59E0B', description: 'Activité en progression' },
  { id: '3', name: 'Réalisé', color: '#10B981', description: 'Activité terminée' },
  { id: '4', name: 'Validé', color: '#3B82F6', description: 'Activité validée' },
  { id: '5', name: 'Bloqué', color: '#8B5CF6', description: 'Activité bloquée' },
];

export default function StatusAdminPage() {
  const [statuses, setStatuses] = useState<Status[]>(defaultStatuses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [formData, setFormData] = useState<Partial<Status>>({});

  const handleAddStatus = () => {
    const newStatus: Status = {
      id: Date.now().toString(),
      name: formData.name || 'Nouveau statut',
      color: formData.color || '#3B82F6',
      description: formData.description || '',
    };
    setStatuses([...statuses, newStatus]);
    setShowAddModal(false);
    setFormData({});
  };

  const handleEditStatus = () => {
    if (!editingStatus) return;
    setStatuses(statuses.map((s) => (s.id === editingStatus.id ? editingStatus : s)));
    setEditingStatus(null);
    setFormData({});
  };

  const handleDeleteStatus = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce statut ?')) {
      setStatuses(statuses.filter((s) => s.id !== id));
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser les statuts par défaut ?')) {
      setStatuses(defaultStatuses);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des Statuts</h1>
          <p className="text-muted-foreground">Configurez les statuts disponibles pour toutes les phases d'infrastructures</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un statut
          </Button>
          <Button onClick={handleResetToDefaults} variant="outline" className="border-border">
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>

        <div className="grid gap-4">
          {statuses.map((status) => (
            <Card key={status.id} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: status.color }}
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{status.name}</h3>
                      <p className="text-sm text-muted-foreground">{status.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingStatus(status);
                        setFormData(status);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteStatus(status.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingStatus) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>{editingStatus ? 'Éditer le statut' : 'Ajouter un statut'}</CardTitle>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStatus(null);
                  setFormData({});
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Nom du statut</label>
                <Input
                  value={editingStatus?.name || formData.name || ''}
                  onChange={(e) => {
                    if (editingStatus) {
                      setEditingStatus({ ...editingStatus, name: e.target.value });
                    } else {
                      setFormData({ ...formData, name: e.target.value });
                    }
                  }}
                  placeholder="Ex: En cours"
                  className="mt-1 bg-card border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Couleur</label>
                <div className="mt-1 flex gap-2 items-center">
                  <input
                    type="color"
                    value={editingStatus?.color || formData.color || '#3B82F6'}
                    onChange={(e) => {
                      if (editingStatus) {
                        setEditingStatus({ ...editingStatus, color: e.target.value });
                      } else {
                        setFormData({ ...formData, color: e.target.value });
                      }
                    }}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <code className="text-sm text-muted-foreground">{editingStatus?.color || formData.color}</code>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={editingStatus?.description || formData.description || ''}
                  onChange={(e) => {
                    if (editingStatus) {
                      setEditingStatus({ ...editingStatus, description: e.target.value });
                    } else {
                      setFormData({ ...formData, description: e.target.value });
                    }
                  }}
                  placeholder="Description du statut"
                  className="mt-1 w-full p-2 border border-border rounded-md bg-card text-foreground text-sm"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingStatus(null);
                    setFormData({});
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={editingStatus ? handleEditStatus : handleAddStatus}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingStatus ? 'Enregistrer' : 'Créer'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
