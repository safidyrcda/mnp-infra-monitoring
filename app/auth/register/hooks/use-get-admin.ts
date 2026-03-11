'use client';

import { getOneAdmin } from '@/app/_actions/auth';
import { User } from '@/prisma/app/generated/prisma/client';
import { useEffect, useState } from 'react';

export const useGetAdmin = () => {
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      const res = await getOneAdmin();
      setAdmin(res);
      setLoading(false);
    };
    fetchAdmin();
  }, []);

  return { admin, loading };
};
