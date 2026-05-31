"use client";

import { addDays, formatDisplayDate, isToday } from "@/lib/date-nav";

interface DateNavigatorProps {
  selectedDate: string;
  onDateChange: (iso: string) => void;
}

export default function DateNavigator({ selectedDate, onDateChange }: DateNavigatorProps) {
  const canGoNext = !isToday(selectedDate);

  return (
    <div className="mx-auto max-w-md">
      <div className="flex items-center justify-between gap-2 rounded-2xl bg-white/20 px-2 py-2 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => onDateChange(addDays(selectedDate, -1))}
          className="shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-white transition hover:bg-white/15 sm:text-sm"
        >
          ← Previous
        </button>

        <div className="min-w-0 flex-1 overflow-x-auto">
          <div className="flex justify-center gap-1">
            <button
              type="button"
              onClick={() => onDateChange(addDays(selectedDate, -1))}
              className="hidden rounded-lg px-2 py-1 text-[10px] font-semibold text-white/80 sm:inline"
              aria-hidden
            >
              {formatDisplayDate(addDays(selectedDate, -1))}
            </button>
            <span className="rounded-xl bg-white px-4 py-2 text-center text-sm font-bold text-neutral-900 shadow-md">
              {formatDisplayDate(selectedDate)}
            </span>
            {canGoNext && (
              <button
                type="button"
                onClick={() => onDateChange(addDays(selectedDate, 1))}
                className="hidden rounded-lg px-2 py-1 text-[10px] font-semibold text-white/80 sm:inline"
                aria-hidden
              >
                {formatDisplayDate(addDays(selectedDate, 1))}
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => canGoNext && onDateChange(addDays(selectedDate, 1))}
          disabled={!canGoNext}
          className="shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
