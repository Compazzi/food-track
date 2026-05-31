import { mockMealLogs } from "@/data/mock";
import { TODAY } from "@/lib/constants";
import type { MealLog, MealLogEntry } from "@/types/models";

const MEAL_LOGS_KEY = "food-track-meal-logs";

function readStoredLogs(): MealLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MEAL_LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MealLog[];
  } catch {
    return [];
  }
}

function writeStoredLogs(logs: MealLog[]): void {
  localStorage.setItem(MEAL_LOGS_KEY, JSON.stringify(logs));
}

/** Mock logs plus user-logged entries from localStorage. */
export function getAllMealLogs(): MealLog[] {
  return [...mockMealLogs, ...readStoredLogs()];
}

export function getMealLogsForDate(date: string): MealLog[] {
  return getAllMealLogs().filter((log) => log.date === date);
}

export function logFoodEntry(entry: MealLogEntry, date: string = TODAY): MealLog {
  const logs = readStoredLogs();
  const existing = logs.find((log) => log.date === date && log.userId === "user-1");

  if (existing) {
    existing.entries.push(entry);
    writeStoredLogs(logs);
    return existing;
  }

  const newLog: MealLog = {
    id: `meal-user-${Date.now()}`,
    userId: "user-1",
    date,
    entries: [entry],
  };
  writeStoredLogs([...logs, newLog]);
  return newLog;
}
