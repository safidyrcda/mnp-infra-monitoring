'use server';

import { prisma } from '@/lib/db-connect';
import {
  PrismaClient,
  Status,
  PhaseType,
  ActivityType,
  Etape,
  EtapeActivity,
  EtapeActivityFollowUp,
} from '@/prisma/app/generated/prisma/client';

// ---------------------------
// ACTIVITY
// ---------------------------

export async function getAllActivities() {
  return prisma.activity.findMany({
    include: {
      etapeActivities: {
        include: {
          etape: true,
        },
      },
    },
  });
}

export async function getActivityById(activityId: string) {
  return prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      etapeActivities: {
        include: { etape: true },
      },
    },
  });
}

// ---------------------------
// ETAPE
// ---------------------------

export async function getAllEtapes(): Promise<Etape[]> {
  return prisma.etape.findMany({});
}

export async function getEtapeById(etapeId: string) {
  return prisma.etape.findUnique({
    where: { id: etapeId },
    include: {
      etapeActivities: true,
    },
  });
}

// ---------------------------
// ETAPE ACTIVITY
// ---------------------------

export async function getAllEtapeActivities() {
  return prisma.etapeActivity.findMany({
    include: { etape: true, activity: true },
  });
}

export async function getEtapeActivitiesByActivity(activityId: string) {
  return prisma.etapeActivity.findMany({
    where: { activityId },
    include: { etape: true },
  });
}

export async function getEtapeActivitiesByEtape(etapeId: string) {
  return prisma.etapeActivity.findMany({
    where: { etapeId },
    include: { activity: true },
  });
}

// ---------------------------
// CREATE / UPDATE / DELETE EXAMPLES
// ---------------------------

export async function createActivity(data: {
  id?: string;
  name: string;
  site: string;
  type: ActivityType;
}) {
  return prisma.activity.create({ data });
}

export async function updateActivity(
  id: string,
  data: Partial<{ name: string; site: string; type: ActivityType }>,
) {
  return prisma.activity.update({
    where: { id },
    data,
  });
}

export async function deleteActivity(id: string) {
  return prisma.activity.delete({
    where: { id },
  });
}

export async function createEtapeActivity(data: {
  id?: string;
  activityId: string;
  etapeId: string;
  status?: Status;
  commentaire?: string;
  fichierJoint?: string;
  date?: Date;
}) {
  return prisma.etapeActivity.create({
    data,
  });
}

export async function updateEtapeActivity(
  id: string,
  data: Partial<EtapeActivity>,
) {
  return prisma.etapeActivity.update({
    where: { id },
    data,
  });
}

export async function deleteEtapeActivity(id: string) {
  return prisma.etapeActivity.delete({
    where: { id },
  });
}

export async function getEtapeActivityFollowUpsByEtapeActivityId(id: string) {
  return prisma.etapeActivityFollowUp.findMany({
    where: { etapeActivityId: id },
  });
}

export async function createEtapeActivityFollowUp(data: EtapeActivityFollowUp) {
  return prisma.etapeActivityFollowUp.create({ data });
}

export async function getAllFollowUps() {
  return prisma.etapeActivityFollowUp.findMany();
}
