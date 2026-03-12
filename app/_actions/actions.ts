'use server';

import { prisma } from '@/lib/db-connect';
import {
  Status,
  ActivityType,
  TaskActivity,
  TaskActivityFollowUp,
} from '@/prisma/app/generated/prisma/client';

// ─── Activity ─────────────────────────────────────────────────────────────────

export async function getAllActivities() {
  return prisma.activity.findMany({
    include: {
      taskActivities: { include: { task: true } },
    },
  });
}

export async function getActivityById(activityId: string) {
  return prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      taskActivities: { include: { task: true } },
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

// ─── Task ─────────────────────────────────────────────────────────────────────

export async function getAllTasks() {
  return prisma.task.findMany({
    orderBy: [{ phaseType: 'asc' }, { order: 'asc' }],
  });
}

// ─── TaskActivity ─────────────────────────────────────────────────────────────

export async function getTaskActivitiesByActivity(activityId: string) {
  return prisma.taskActivity.findMany({
    where: { activityId },
    include: { task: true },
    orderBy: { task: { order: 'asc' } },
  });
}

export async function updateTaskActivity(
  id: string,
  data: Partial<Omit<TaskActivity, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  return prisma.taskActivity.update({ where: { id }, data });
}

// ─── TaskActivityFollowUp ─────────────────────────────────────────────────────

export async function getAllFollowUps() {
  return prisma.taskActivityFollowUp.findMany({
    orderBy: { createdAt: 'asc' },
  });
}

export async function getFollowUpsByTaskActivity(taskActivityId: string) {
  return prisma.taskActivityFollowUp.findMany({
    where: { taskActivityId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createTaskActivityFollowUp(
  data: Omit<TaskActivityFollowUp, 'id' | 'createdAt' | 'updatedAt'>,
) {
  return prisma.taskActivityFollowUp.create({ data });
}

export async function updateTaskActivityFollowUp(
  id: string,
  data: Partial<Omit<TaskActivityFollowUp, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  return prisma.taskActivityFollowUp.update({ where: { id }, data });
}

export async function deleteTaskActivityFollowUp(id: string) {
  return prisma.taskActivityFollowUp.delete({ where: { id } });
}
