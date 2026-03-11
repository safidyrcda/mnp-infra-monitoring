'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EtapeActivityFollowUp } from '@/prisma/app/generated/prisma/client';

interface FollowUpModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<EtapeActivityFollowUp>) => void;
}

export function FollowUpModal({ onClose, onSubmit }: FollowUpModalProps) {
  const [formData, setFormData] = useState<Partial<EtapeActivityFollowUp>>({});

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Ajouter un suivi</CardTitle>
          <button
            onClick={onClose}
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
              value={formData.commentaire || ''}
              onChange={(e) =>
                setFormData({ ...formData, commentaire: e.target.value })
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
              value={formData.status || 'EN_COURS'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as EtapeActivityFollowUp['status'],
                })
              }
              className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
            >
              <option value="NON_FAIT">Non fait</option>
              <option value="EN_COURS">En cours</option>
              <option value="REALISE">Réalisé</option>
              <option value="VALIDE">Validé</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Date</label>
            <input
              type="date"
              value={
                formData.date
                  ? new Date(formData.date).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) =>
                setFormData({ ...formData, date: new Date(e.target.value) })
              }
              className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Fichier joint (optionnel)
            </label>
            <Input
              value={formData.fichierJoint || ''}
              onChange={(e) =>
                setFormData({ ...formData, fichierJoint: e.target.value })
              }
              placeholder="Nom du fichier"
              className="mt-1 bg-card border-border"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              onClick={() => onSubmit(formData)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
