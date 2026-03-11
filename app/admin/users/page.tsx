'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useUsers } from './hooks/use-users';

export default function UsersAdminPage() {
  const { users, createUser } = useUsers();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<(typeof users)[0] | null>(
    null,
  );
  const [formData, setFormData] = useState({ email: '', name: '' });

  const handleAddUser = () => {
    if (!formData.email || !formData.name) return;
    createUser({
      email: formData.email,
      name: formData.name,
    });
    setShowAddModal(false);
    setFormData({ email: '', name: '' });
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    // updateUser({
    //   ...editingUser,
    //   email: formData.email,
    //   name: formData.name,
    // });
    setShowEditModal(false);
    setEditingUser(null);
    setFormData({ email: '', name: '' });
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      // deleteUser(userId);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Gestion des Utilisateurs
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez les utilisateurs du système de suivi
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Utilisateur
          </Button>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Utilisateurs ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Nom
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Email
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            {user.name &&
                              user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                          </div>
                          <span className="font-medium text-foreground">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {user.email}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingUser(user);
                              setFormData({
                                email: user.email,
                                name: user.name || '',
                              });
                              setShowEditModal(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Nouvel Utilisateur</CardTitle>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ email: '', name: '' });
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Nom complet
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nom complet"
                    className="mt-1 bg-card border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@mnp.mg"
                    className="mt-1 bg-card border-border"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({ email: '', name: '' });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleAddUser}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Créer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Éditer l'utilisateur</CardTitle>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    setFormData({ email: '', name: '' });
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Nom complet
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nom complet"
                    className="mt-1 bg-card border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@mnp.mg"
                    className="mt-1 bg-card border-border"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
                      setFormData({ email: '', name: '' });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleEditUser}
                    className="bg-primary hover:bg-primary/90"
                  >
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
