'use client'; // Required since we are using useRouter and event handlers

import { useRouter } from 'next/navigation';
import { useHydrationStore } from '@/lib/hydration-store';

export default function HydrationCard({ currentDate }: { currentDate: string }) {
  const router = useRouter();
  const { targetMl, getDailyTotal, addHydration } = useHydrationStore();
  const currentTotal = getDailyTotal(currentDate);
  const progressPercentage = Math.min((currentTotal / targetMl) * 100, 100);
  
  const statusLabel = currentTotal >= targetMl ? 'Goal reached' : 'Below minimum';

  // Navigate to the hydration page when the card is clicked
  const handleCardClick = () => {
    router.push('/hydration');
  };

  // Add water, but prevent the card click event from firing
  const handleAdd = (e: React.MouseEvent, amount: number) => {
    e.preventDefault();
    e.stopPropagation(); 
    addHydration(amount, currentDate);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="cursor-pointer rounded-2xl bg-white px-4 py-3 shadow-lg shadow-black/10 transition hover:scale-[1.01] flex flex-col gap-3"
    >
      {/* Top Row: Info & Progress Ring */}
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <span className="font-semibold text-neutral-900 inline-block">
            Hydration
          </span>
          <p className="text-sm tabular-nums text-neutral-600">
            {currentTotal} ml &middot; &ge; {targetMl} ml
          </p>
          <p className="text-xs text-neutral-500">{statusLabel}</p>
        </div>
        
        {/* Progress Ring */}
        <div className="h-10 w-10 shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="4"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeDasharray={`${(progressPercentage / 100) * 97.4} 97.4`}
              strokeLinecap="round"
              className="transition-all duration-500 ease-in-out"
            />
          </svg>
        </div>
      </div>

      {/* Bottom Row: Quick Add Buttons */}
      <div className="flex gap-2">
        <button 
          type="button"
          onClick={(e) => handleAdd(e, 500)}
          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold py-2 rounded-xl transition-colors"
        >
          + 500 ml
        </button>
        <button 
          type="button"
          onClick={(e) => handleAdd(e, 1000)}
          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold py-2 rounded-xl transition-colors"
        >
          + 1 L
        </button>
      </div>
    </div>
  );
}