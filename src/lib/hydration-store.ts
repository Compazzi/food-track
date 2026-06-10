// OBSOLETE: This is no longer used.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HydrationLog } from '../types/models';

interface HydrationState {
  targetMl: number;
  logs: HydrationLog[];
  setTargetMl: (amount: number) => void;
  addHydration: (amountMl: number, date: string) => void;
  editDailyTotal: (amountMl: number, date: string) => void;
  getDailyTotal: (date: string) => number;
  getWeeklyData: (currentDate: string) => { date: string; amountMl: number }[];
}

export const useHydrationStore = create<HydrationState>()(
  persist(
    (set, get) => ({
      targetMl: 2500, // Default 2.5L goal
      logs: [],
      
      setTargetMl: (amount) => set({ targetMl: amount }),
      
      addHydration: (amountMl, date) => set((state) => ({
        logs: [
          ...state.logs,
          {
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
            date,
            amountMl,
            timestamp: Date.now(),
          }
        ]
      })),

      editDailyTotal: (amountMl, date) => set((state) => ({
        logs: [
          // Remove any existing logs for this specific date
          ...state.logs.filter((log) => log.date !== date),
          // Insert a single new log with the exact updated amount
          {
            id: crypto.randomUUID(),
            date,
            amountMl,
            timestamp: Date.now(),
          }
        ]
      })),

      getDailyTotal: (date) => {
        return get().logs
          .filter((log) => log.date === date)
          .reduce((total, log) => total + log.amountMl, 0);
      },

      getWeeklyData: (currentDate) => {
        // Simple helper to get the last 7 days
        const data = [];
        const current = new Date(currentDate);
        for (let i = 6; i >= 0; i--) {
          const d = new Date(current);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          data.push({
            date: dateStr,
            amountMl: get().getDailyTotal(dateStr),
          });
        }
        return data;
      }
    }),
    { name: 'hydration-storage' }
  )
);