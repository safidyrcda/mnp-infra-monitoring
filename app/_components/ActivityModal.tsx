'use client';

import { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, ActivityType } from '@/app/_types/types';

interface ActivityModalProps {
  title: string;
  sites: string[];
  initialData?: Partial<Activity>;
  submitLabel?: string;
  onClose: () => void;
  onSubmit: (data: Partial<Activity>) => void;
}

export function ActivityModal({
  title,
  sites,
  initialData = {},
  submitLabel,
  onClose,
  onSubmit,
}: ActivityModalProps) {
  const [formData, setFormData] = useState<Partial<Activity>>(initialData);
  const isEdit = !!initialData?.id;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{title}</CardTitle>
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
              Nom de l'activité
            </label>
            <Input
              value={formData.name ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nom de l'activité"
              className="mt-1 bg-card border-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Site</label>
            <select
              value={formData.site ?? sites[0] ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, site: e.target.value })
              }
              className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
            >
              {sites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Type</label>
            <select
              value={formData.type ?? ActivityType.ECOT}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as ActivityType,
                })
              }
              className="w-full mt-1 p-2 border border-border rounded-md bg-card text-foreground"
            >
              {Object.values(ActivityType).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              onClick={() => onSubmit(formData)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isEdit ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {submitLabel ?? 'Enregistrer'}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {submitLabel ?? 'Créer'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
