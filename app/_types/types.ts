// ⚠️ Réexporte uniquement des types TypeScript — safe dans les composants 'use client'
// Ne jamais importer directement depuis @/prisma/app/generated/prisma/client dans un composant client.

export type {
  Activity,
  Phase,
  Task,
  TaskActivity,
  TaskActivityFollowUp,
  User,
  UserActivity,
} from '@/prisma/app/generated/prisma/browser';

export {
  Status,
  PhaseType,
  ActivityType,
  TaskValueType,
  UserActivityRole,
} from '@/prisma/app/generated/prisma/enums';
