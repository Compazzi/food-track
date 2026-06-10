 'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- GOAL SETTINGS ---

export async function getHydrationGoal() {
  const settings = await prisma.settings.findUnique({ where: { id: 'default' } });
  return settings?.hydrationTargetMl || 2500; // Returns default if not set
}

export async function setHydrationGoal(targetMl: number) {
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: { hydrationTargetMl: targetMl },
    create: { id: 'default', hydrationTargetMl: targetMl },
  });
  
  // Tells Next.js to instantly refresh the data on these pages
  revalidatePath('/'); 
  revalidatePath('/hydration');
}

// --- HYDRATION LOGGING ---

export async function getDailyTotal(date: string) {
  const logs = await prisma.hydrationLog.findMany({
    where: { date },
  });
  return logs.reduce((total: number, log: { amountMl: number }) => total + log.amountMl, 0);}

export async function addHydration(amountMl: number, date: string) {
  await prisma.hydrationLog.create({
    data: {
      date,
      amountMl,
      timestamp: Date.now(),
    }
  });
  
  revalidatePath('/');
  revalidatePath('/hydration');
}

export async function editDailyTotal(amountMl: number, date: string) {
  // First, delete all existing logs for this specific date
  await prisma.hydrationLog.deleteMany({
    where: { date }
  });
  
  // Then, if the new amount is greater than 0, create a single new log
  if (amountMl > 0) {
    await prisma.hydrationLog.create({
      data: {
        date,
        amountMl,
        timestamp: Date.now(),
      }
    });
  }
  
  revalidatePath('/');
  revalidatePath('/hydration');
}

// --- CHART DATA ---

export async function getWeeklyData(currentDate: string) {
  const current = new Date(currentDate);
  const past = new Date(current);
  past.setDate(past.getDate() - 6);
  const pastDateStr = past.toISOString().split('T')[0];

  // Fetch all logs from the last 7 days from the database
  const logs = await prisma.hydrationLog.findMany({
    where: {
      date: {
        gte: pastDateStr,
        lte: currentDate,
      }
    }
  });

  // Group the logs by date
  const grouped = logs.reduce((acc, log) => {
    acc[log.date] = (acc[log.date] || 0) + log.amountMl;
    return acc;
  }, {} as Record<string, number>);

  // Format into the array required by Recharts
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(current);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      amountMl: grouped[dateStr] || 0,
    });
  }
  return result;
}