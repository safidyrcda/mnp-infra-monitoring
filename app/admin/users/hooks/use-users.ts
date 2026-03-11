'use client';

import { getAllUsers, register } from '@/app/_actions/auth';
import { User } from '@/prisma/app/generated/prisma/client';
import { useEffect, useState } from 'react';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [refresh, setRefresh] = useState(false);

  const createUser = async (user: Partial<User>) => {
    if (!user.email) return;
    await register({
      email: user.email,
      password: 'Password123!',
      role: 'USER',
    });

    setRefresh(!refresh);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUsers();

      setUsers(res);
    };

    fetchUsers();
  }, [refresh]);

  return { users, createUser };
};
