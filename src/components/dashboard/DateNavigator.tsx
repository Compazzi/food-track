"use client";

import { useEffect, useRef, useState } from "react";
import { TODAY } from "@/lib/constants";
import {
  addDays,
  canGoToNextDay,
  clampToAllowedRange,
  getYesterdayDate,
  isToday,
  isYesterday,
} from "@/lib/date-nav";

interface DateNavigatorProps {
  selectedDate: string;
  onDateChange: (iso: string) => void;
}

export default function DateNavigator({ selectedDate, onDateChange }: DateNavigatorProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const yesterday = getYesterdayDate();

  const canNext = canGoToNextDay(selectedDate);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setCalendarOpen(false);
    }
    if (calendarOpen) {
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, [calendarOpen]);

  function pickDate(iso: string) {
    onDateChange(clampToAllowedRange(iso));
    setCalendarOpen(false);
  }

  const navButton =
    "shrink-0 rounded-xl px-2.5 py-2 text-xs font-bold transition sm:px-3 sm:text-sm";
  const activeDay =
    "bg-white text-neutral-900 shadow-md";
  const inactiveDay =
    "text-white hover:bg-white/15";

  return (
    <>
      <div className="mx-auto flex max-w-md justify-center">
        <div
          className="inline-flex items-center justify-center gap-1 rounded-2xl bg-white/20 px-2 py-2 backdrop-blur-sm sm:gap-2 sm:px-3"
          role="group"
          aria-label="Date navigation"
        >
          <button
            type="button"
            onClick={() => pickDate(addDays(selectedDate, -1))}
            className={`${navButton} text-white hover:bg-white/15`}
            aria-label="Previous day"
          >
            ‹ Previous
          </button>

          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            className="flex shrink-0 items-center justify-center rounded-xl bg-white/20 p-2 text-white transition hover:bg-white/30"
            aria-label="Open calendar"
          >
            <CalendarIcon />
          </button>

          <button
            type="button"
            onClick={() => pickDate(yesterday)}
            className={`${navButton} ${
              isYesterday(selectedDate) ? activeDay : inactiveDay
            }`}
          >
            Yesterday
          </button>

          <button
            type="button"
            onClick={() => pickDate(TODAY)}
            className={`${navButton} ${isToday(selectedDate) ? activeDay : inactiveDay}`}
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => canNext && pickDate(addDays(selectedDate, 1))}
            disabled={!canNext}
            className={`${navButton} text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40`}
            aria-label="Next day"
          >
            Next ›
          </button>
        </div>
      </div>

      {calendarOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setCalendarOpen(false)}
          role="presentation"
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Choose a date"
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Jump to date</h3>
              <button
                type="button"
                onClick={() => setCalendarOpen(false)}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-800"
              >
                Close
              </button>
            </div>

            <label className="block">
              <span className="text-xs font-semibold text-neutral-600">Select day</span>
              <input
                type="date"
                value={selectedDate}
                max={TODAY}
                onChange={(e) => e.target.value && pickDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </label>

            <p className="mt-3 text-center text-xs text-neutral-500">
              Browse any past date. Future dates are not available.
            </p>

            <button
              type="button"
              onClick={() => pickDate(TODAY)}
              className="mt-4 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Go to today
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
