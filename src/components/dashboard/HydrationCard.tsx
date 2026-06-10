'use client'; 

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { addHydration, getDailyTotal, getHydrationGoal } from '@/app/actions/hydration';

interface HydrationCardProps {
  currentDate: string;
}

export default function HydrationCard({ currentDate }: HydrationCardProps) {
  const router = useRouter();
  
  // 1. Create local state to hold the database values
  const [currentTotal, setCurrentTotal] = useState(0);
  const [targetMl, setTargetMl] = useState(2500);

  // 2. Fetch from the database whenever the date changes
  useEffect(() => {
    const loadDatabaseValues = async () => {
      const total = await getDailyTotal(currentDate);
      const goal = await getHydrationGoal();
      setCurrentTotal(total);
      setTargetMl(goal);
    };
    loadDatabaseValues();
  }, [currentDate]);

  // 3. Handle the button click with an instant UI update
  const handleAdd = async (amount: number) => {
    // Instantly update the numbers on the screen (Optimistic Update)
    setCurrentTotal((prev) => prev + amount); 
    // Save it to the SQLite database
    await addHydration(amount, currentDate);
  };

  const progressPercentage = Math.min((currentTotal / targetMl) * 100, 100);
  const statusLabel = currentTotal >= targetMl ? 'Goal reached' : 'Below minimum';

  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    router.push('/hydration');
  };

  return (
    <div 
      onClick={handleWrapperClick}
      className="group flex cursor-pointer flex-col gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-black/10 transition hover:scale-[1.01]"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <span className="inline-block font-semibold text-neutral-900 transition-colors group-hover:text-blue-600">
            Hydration
          </span>
          <p className="tabular-nums text-sm text-neutral-600">
            {currentTotal} ml &middot; &ge; {targetMl} ml
          </p>
          <p className="text-xs text-neutral-500">{statusLabel}</p>
        </div>
        
        <div className="h-10 w-10 shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#E5E7EB" strokeWidth="4" />
            <circle
              cx="18" cy="18" r="15.5" fill="none" stroke="#3b82f6" strokeWidth="4"
              strokeDasharray={`${(progressPercentage / 100) * 97.4} 97.4`}
              strokeLinecap="round"
              className="transition-all duration-500 ease-in-out"
            />
          </svg>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          type="button"
          onClick={() => handleAdd(500)}
          className="flex-1 rounded-xl bg-blue-50 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
        >
          + 500 ml
        </button>
        <button 
          type="button"
          onClick={() => handleAdd(1000)}
          className="flex-1 rounded-xl bg-blue-50 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
        >
          + 1 L
        </button>
      </div>
    </div>
  );
}