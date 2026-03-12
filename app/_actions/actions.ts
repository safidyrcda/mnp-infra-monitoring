'use server';

import { prisma } from '@/lib/db-connect';
import {
  Status,
  ActivityType,
  StepActivity,
  StepActivityFollowUp,
} from '@/prisma/app/generated/prisma/client';

// ---------------------------
// ACTIVITY
// ---------------------------

export async function getAllActivities() {
  return prisma.activity.findMany({
    include: {
      stepActivities: {
        include: { step: true },
      },
    },
  });
}

export async function getActivityById(activityId: string) {
  return prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      stepActivities: {
        include: { step: true },
      },
    },
  });
}

export async function createActivity(data: {
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
  return prisma.activity.update({ where: { id }, data });
}

export async function deleteActivity(id: string) {
  return prisma.activity.delete({ where: { id } });
}

// ---------------------------
// STEP
// ---------------------------

export async function getAllSteps() {
  return prisma.step.findMany();
}

export async function getStepById(stepId: string) {
  return prisma.step.findUnique({
    where: { id: stepId },
    include: { stepActivities: true },
  });
}

// ---------------------------
// STEP ACTIVITY
// ---------------------------

export async function getAllStepActivities() {
  return prisma.stepActivity.findMany({
    include: { step: true, activity: true },
  });
}

export async function getStepActivitiesByActivity(activityId: string) {
  return prisma.stepActivity.findMany({
    where: { activityId },
    include: { step: true },
  });
}

export async function getStepActivitiesByStep(stepId: string) {
  return prisma.stepActivity.findMany({
    where: { stepId },
    include: { activity: true },
  });
}

export async function createStepActivity(data: {
  activityId: string;
  stepId: string;
  status?: Status;
  commentaire?: string;
  dueDate?: Date;
}) {
  return prisma.stepActivity.create({ data });
}

export async function updateStepActivity(
  id: string,
  data: Partial<Omit<StepActivity, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  return prisma.stepActivity.update({ where: { id }, data });
}

export async function deleteStepActivity(id: string) {
  return prisma.stepActivity.delete({ where: { id } });
}

// ---------------------------
// STEP ACTIVITY FOLLOW UP
// ---------------------------

export async function getAllFollowUps() {
  return prisma.stepActivityFollowUp.findMany();
}

export async function getFollowUpsByStepActivity(stepActivityId: string) {
  return prisma.stepActivityFollowUp.findMany({
    where: { stepActivityId },
  });
}

export async function createStepActivityFollowUp(
  data: Omit<StepActivityFollowUp, 'id' | 'createdAt' | 'updatedAt'>,
) {
  return prisma.stepActivityFollowUp.create({ data });
}

export async function updateStepActivityFollowUp(
  id: string,
  data: Partial<Omit<StepActivityFollowUp, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  return prisma.stepActivityFollowUp.update({ where: { id }, data });
}

export async function deleteStepActivityFollowUp(id: string) {
  return prisma.stepActivityFollowUp.delete({ where: { id } });
}
