'use client';

import { useState } from 'react';
import { Plus, X, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Status, TaskActivityFollowUp } from '@/app/_types/types';

const STATUS_LABELS: Record<Status, string> = {
  NON_FAIT: 'Non fait',
  EN_COURS: 'En cours',
  REALISE: 'Réalisé',
  VALIDE: 'Validé',
};

interface FollowUpModalProps {
  taskName: string;
  onClose: () => void;
  onSubmit: (data: Partial<TaskActivityFollowUp>) => void;
}

export function FollowUpModal({
  taskName,
  onClose,
  onSubmit,
}: FollowUpModalProps) {
  const [formData, setFormData] = useState<Partial<TaskActivityFollowUp>>({});
  const [hasProblem, setHasProblem] = useState(false);

  const set = (patch: Partial<TaskActivityFollowUp>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-[800px] max-w-lg border-border">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Ajouter un suivi</CardTitle>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              {taskName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground mt-1"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent className="">
          {/* Statut */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Statut
            </label>
            <select
              value={formData.status ?? ''}
              onChange={(e) =>
                set({
                  status: e.target.value
                    ? (e.target.value as Status)
                    : undefined,
                })
              }
              className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
            >
              <option value="">— Inchangé —</option>
              {Object.values(Status).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {/* Commentaire */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Commentaire
            </label>
            <textarea
              value={formData.commentaire ?? ''}
              onChange={(e) => set({ commentaire: e.target.value })}
              placeholder="Observations, remarques sur l'avancement..."
              className="mt-1 w-full p-2 border border-border rounded-md bg-card text-foreground min-h-[80px] resize-none"
            />
          </div>

          {/* Problème */}
          <div className="border-t border-border pt-4">
            <Button
              onClick={() => setHasProblem((v) => !v)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                hasProblem ? '' : ''
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              {hasProblem
                ? 'Problème signalé'
                : 'Signaler un problème (optionnel)'}
            </Button>

            {hasProblem && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                    Problème rencontré
                  </label>
                  <textarea
                    value={formData.problemDescription ?? ''}
                    onChange={(e) =>
                      set({ problemDescription: e.target.value })
                    }
                    placeholder="Décrivez le problème ou blocage rencontré..."
                    className="mt-1 w-full p-2 border border-destructive/40 rounded-md bg-card text-foreground min-h-[60px] resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Solution proposée
                  </label>
                  <textarea
                    value={formData.proposedSolution ?? ''}
                    onChange={(e) => set({ proposedSolution: e.target.value })}
                    placeholder="Quelle solution ou mesure corrective est envisagée ?"
                    className="mt-1 w-full p-2 border border-amber-300/50 rounded-md bg-card text-foreground min-h-[60px] resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-1">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                    Suite à donner
                  </label>
                  <textarea
                    value={formData.nextAction ?? ''}
                    onChange={(e) => set({ nextAction: e.target.value })}
                    placeholder="Action planifiée, responsable, échéance..."
                    className="mt-1 w-full p-2 border border-blue-300/50 rounded-md bg-card text-foreground min-h-[60px] resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Fichier joint */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Fichier joint (optionnel)
            </label>
            <Input
              value={formData.fichierJoint ?? ''}
              onChange={(e) => set({ fichierJoint: e.target.value })}
              placeholder="Nom du fichier ou lien"
              className="mt-1 bg-card border-border"
            />
          </div>

          <div className="flex gap-2 justify-end pt-1">
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
