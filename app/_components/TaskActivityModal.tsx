'use client';

import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Status, TaskActivity } from '@/app/_types/types';

const STATUS_LABELS: Record<Status, string> = {
  NON_FAIT: 'Non fait',
  EN_COURS: 'En cours',
  REALISE: 'Réalisé',
  VALIDE: 'Validé',
};

interface TaskActivityModalProps {
  taskName: string;
  taskActivity: TaskActivity;
  onClose: () => void;
  onSubmit: (data: Pick<TaskActivity, 'dueDate' | 'status' | 'commentaire'>) => void;
}

export function TaskActivityModal({
  taskName,
  taskActivity,
  onClose,
  onSubmit,
}: TaskActivityModalProps) {
  const [status, setStatus] = useState<Status>(taskActivity.status ?? Status.NON_FAIT);
  const [dueDate, setDueDate] = useState<string>(
    taskActivity.dueDate
      ? new Date(taskActivity.dueDate).toISOString().split('T')[0]
      : '',
  );
  const [commentaire, setCommentaire] = useState<string>(
    taskActivity.commentaire ?? '',
  );

  const handleSubmit = () => {
    onSubmit({
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      commentaire: commentaire || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Modifier la tâche</CardTitle>
            <p className="text-sm text-muted-foreground mt-1 font-medium">{taskName}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground mt-1">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Statut */}
          <div>
            <label className="text-sm font-medium text-foreground">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
            >
              {Object.values(Status).map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          {/* Date limite */}
          <div>
            <label className="text-sm font-medium text-foreground">Date limite</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
            />
            {dueDate && (
              <button
                type="button"
                onClick={() => setDueDate('')}
                className="text-xs text-muted-foreground hover:text-destructive mt-1"
              >
                Effacer la date
              </button>
            )}
          </div>

          {/* Commentaire interne */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Note interne (optionnel)
            </label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Contexte, rappel, précision sur cette tâche..."
              className="mt-1 w-full p-2 border border-border rounded-md bg-card text-foreground min-h-[72px] resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
