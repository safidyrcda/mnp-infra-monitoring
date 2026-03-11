'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

interface PhaseField {
  id: string;
  name: string;
  type: 'text' | 'date' | 'number' | 'percentage' | 'select' | 'textarea';
  required: boolean;
  order: number;
  options?: string[]; // for select type
}

interface PhaseConfig {
  name: string;
  fields: PhaseField[];
}

const defaultPhases: Record<string, PhaseConfig> = {
  preparation: {
    name: 'Phase de Préparation',
    fields: [
      { id: '1', name: 'Date prévue dans PPM', type: 'date', required: false, order: 1 },
      { id: '2', name: 'Type du document (APD/DEVIS/DAOR/DAON)', type: 'select', required: false, order: 2, options: ['APD', 'DEVIS', 'DAOR', 'DAON'] },
      { id: '3', name: 'DAS (Jj/mm/aa)', type: 'date', required: false, order: 3 },
      { id: '4', name: 'APD', type: 'text', required: false, order: 4 },
      { id: '5', name: 'Réalisation du document %', type: 'percentage', required: false, order: 5 },
      { id: '6', name: 'Échéance pour la phase', type: 'date', required: false, order: 6 },
      { id: '7', name: 'Situation globale sur la phase', type: 'textarea', required: false, order: 7 },
    ],
  },
  passation: {
    name: 'Phase de Passation',
    fields: [
      { id: '8', name: 'Échéance pour la phase', type: 'date', required: false, order: 1 },
      { id: '9', name: 'Prospection des fournisseurs', type: 'text', required: false, order: 2 },
      { id: '10', name: 'Lancement des offres', type: 'date', required: false, order: 3 },
      { id: '11', name: 'Ebauche contrat %', type: 'percentage', required: false, order: 4 },
      { id: '12', name: 'Évaluation des offres', type: 'text', required: false, order: 5 },
      { id: '13', name: 'Validation (DANO et DFI)', type: 'date', required: false, order: 6 },
      { id: '14', name: 'DED', type: 'date', required: false, order: 7 },
      { id: '15', name: 'Situation globale de la phase', type: 'textarea', required: false, order: 8 },
    ],
  },
  contractualization: {
    name: 'Phase de Contractualisation',
    fields: [
      { id: '16', name: 'Finalisation du contrat', type: 'date', required: false, order: 1 },
      { id: '17', name: 'Notification / Attribution', type: 'date', required: false, order: 2 },
      { id: '18', name: 'Phase de contractualisation avec MOS/MOT ou fournisseur', type: 'textarea', required: false, order: 3 },
    ],
  },
  execution: {
    name: 'Phase d\'Exécution',
    fields: [
      { id: '19', name: 'Demarrage du travail (JJ/MM/AA)', type: 'date', required: false, order: 1 },
      { id: '20', name: 'Fin d\'exécution prévus dans contrat (JJ/MM/AA)', type: 'date', required: false, order: 2 },
      { id: '21', name: 'Avancement', type: 'percentage', required: false, order: 3 },
      { id: '22', name: 'Réception des travaux', type: 'textarea', required: false, order: 4 },
      { id: '23', name: 'OBS', type: 'textarea', required: false, order: 5 },
    ],
  },
};

export default function FieldsAdminPage() {
  const [phases, setPhases] = useState<Record<string, PhaseConfig>>(defaultPhases);
  const [selectedPhase, setSelectedPhase] = useState<string>('preparation');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingField, setEditingField] = useState<PhaseField | null>(null);
  const [formData, setFormData] = useState<Partial<PhaseField>>({});

  const currentPhase = phases[selectedPhase];

  const handleAddField = () => {
    if (!formData.name) return;
    const newField: PhaseField = {
      id: Date.now().toString(),
      name: formData.name || '',
      type: formData.type || 'text',
      required: formData.required || false,
      order: Math.max(...currentPhase.fields.map((f) => f.order), 0) + 1,
      options: formData.options,
    };
    setPhases({
      ...phases,
      [selectedPhase]: {
        ...currentPhase,
        fields: [...currentPhase.fields, newField],
      },
    });
    setShowAddModal(false);
    setFormData({});
  };

  const handleEditField = () => {
    if (!editingField) return;
    setPhases({
      ...phases,
      [selectedPhase]: {
        ...currentPhase,
        fields: currentPhase.fields.map((f) => (f.id === editingField.id ? editingField : f)),
      },
    });
    setEditingField(null);
    setFormData({});
  };

  const handleDeleteField = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce champ ?')) {
      setPhases({
        ...phases,
        [selectedPhase]: {
          ...currentPhase,
          fields: currentPhase.fields.filter((f) => f.id !== id),
        },
      });
    }
  };

  const handleMoveField = (id: string, direction: 'up' | 'down') => {
    const fields = [...currentPhase.fields];
    const index = fields.findIndex((f) => f.id === id);
    if (direction === 'up' && index > 0) {
      [fields[index], fields[index - 1]] = [fields[index - 1], fields[index]];
    } else if (direction === 'down' && index < fields.length - 1) {
      [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];
    }
    setPhases({
      ...phases,
      [selectedPhase]: { ...currentPhase, fields },
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des Champs Dynamiques</h1>
          <p className="text-muted-foreground">Configurez les sous-champs pour chaque phase</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {Object.entries(phases).map(([key, phase]) => (
            <button
              key={key}
              onClick={() => setSelectedPhase(key)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                selectedPhase === key
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="font-semibold text-foreground">{phase.name}</h3>
              <p className="text-sm text-muted-foreground">{phase.fields.length} champs</p>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un champ
          </Button>
        </div>

        <div className="space-y-3">
          {currentPhase.fields
            .sort((a, b) => a.order - b.order)
            .map((field, index) => (
              <Card key={field.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground font-mono">{index + 1}.</span>
                        <h3 className="font-semibold text-foreground">{field.name}</h3>
                        {field.required && (
                          <span className="text-xs px-2 py-1 bg-destructive/20 text-destructive rounded">Requis</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Type: {field.type}</p>
                      {field.options && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Options: {field.options.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveField(field.id, 'up')}
                        disabled={index === 0}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveField(field.id, 'down')}
                        disabled={index === currentPhase.fields.length - 1}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ↓
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingField(field);
                          setFormData(field);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteField(field.id)}
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
      {(showAddModal || editingField) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>{editingField ? 'Éditer le champ' : 'Ajouter un champ'}</CardTitle>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingField(null);
                  setFormData({});
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Nom du champ</label>
                <Input
                  value={editingField?.name || formData.name || ''}
                  onChange={(e) => {
                    if (editingField) {
                      setEditingField({ ...editingField, name: e.target.value });
                    } else {
                      setFormData({ ...formData, name: e.target.value });
                    }
                  }}
                  placeholder="Ex: Date de démarrage"
                  className="mt-1 bg-card border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Type de champ</label>
                <select
                  value={editingField?.type || formData.type || 'text'}
                  onChange={(e) => {
                    if (editingField) {
                      setEditingField({ ...editingField, type: e.target.value as any });
                    } else {
                      setFormData({ ...formData, type: e.target.value as any });
                    }
                  }}
                  className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
                >
                  <option value="text">Texte</option>
                  <option value="date">Date</option>
                  <option value="number">Nombre</option>
                  <option value="percentage">Pourcentage</option>
                  <option value="select">Liste déroulante</option>
                  <option value="textarea">Zone de texte</option>
                </select>
              </div>
              {(editingField?.type === 'select' || formData.type === 'select') && (
                <div>
                  <label className="text-sm font-medium text-foreground">Options (séparées par des virgules)</label>
                  <Input
                    value={(editingField?.options || formData.options || []).join(', ')}
                    onChange={(e) => {
                      const options = e.target.value.split(',').map((o) => o.trim());
                      if (editingField) {
                        setEditingField({ ...editingField, options });
                      } else {
                        setFormData({ ...formData, options });
                      }
                    }}
                    placeholder="Option1, Option2, Option3"
                    className="mt-1 bg-card border-border"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={editingField?.required || formData.required || false}
                  onChange={(e) => {
                    if (editingField) {
                      setEditingField({ ...editingField, required: e.target.checked });
                    } else {
                      setFormData({ ...formData, required: e.target.checked });
                    }
                  }}
                  className="rounded"
                />
                <label htmlFor="required" className="text-sm font-medium text-foreground cursor-pointer">
                  Champ obligatoire
                </label>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingField(null);
                    setFormData({});
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={editingField ? handleEditField : handleAddField}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingField ? 'Enregistrer' : 'Créer'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
