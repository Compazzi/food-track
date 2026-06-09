'use client'; 

import Link from 'next/link';
import { useHydrationStore } from '@/lib/hydration-store';

export default function HydrationCard({ currentDate }: { currentDate: string }) {
  const { targetMl, getDailyTotal, addHydration } = useHydrationStore();
  const currentTotal = getDailyTotal(currentDate);
  const progressPercentage = Math.min((currentTotal / targetMl) * 100, 100);
  
  const statusLabel = currentTotal >= targetMl ? 'Goal reached' : 'Below minimum';

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-black/10 transition hover:scale-[1.01]">
      {/* 
        The Invisible Overlay Link
        This stretches over the entire card area, making it clickable, 
        but sits BEHIND the buttons. 
      */}
      <Link 
        href="/hydration" 
        className="absolute inset-0 z-0 rounded-2xl" 
        aria-label="View Hydration Details" 
      />

      {/* Top Row: Info & Progress Ring */}
      <div className="pointer-events-none relative z-10 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <span className="inline-block font-semibold text-neutral-900 transition-colors group-hover:text-blue-600">
            Hydration
          </span>
          <p className="tabular-nums text-sm text-neutral-600">
            {currentTotal} ml &middot; &ge; {targetMl} ml
          </p>
          <p className="text-xs text-neutral-500">{statusLabel}</p>
        </div>
        
        {/* Progress Ring */}
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

      {/* Bottom Row: Quick Add Buttons (Sitting ABOVE the invisible link) */}
      <div className="relative z-10 flex gap-2">
        <button 
          type="button"
          onClick={() => addHydration(500, currentDate)}
          className="flex-1 rounded-xl bg-blue-50 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
        >
          + 500 ml
        </button>
        <button 
          type="button"
          onClick={() => addHydration(1000, currentDate)}
          className="flex-1 rounded-xl bg-blue-50 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
        >
          + 1 L
        </button>
      </div>
    </div>
  );
}