import { TODAY } from "@/lib/constants";

export function parseISODate(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

export function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, delta: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + delta);
  return formatISODate(date);
}

export function isToday(iso: string): boolean {
  return iso === TODAY;
}

export function getYesterdayDate(): string {
  return addDays(TODAY, -1);
}

export function isYesterday(iso: string): boolean {
  return iso === getYesterdayDate();
}

/** Prevent selecting future dates; past is unlimited. */
export function clampToAllowedRange(iso: string): string {
  if (iso > TODAY) return TODAY;
  return iso;
}

export function canGoToPreviousDay(): boolean {
  return true;
}

export function canGoToNextDay(iso: string): boolean {
  return !isToday(iso);
}

export function formatDisplayDate(iso: string): string {
  if (isToday(iso)) return "Today";

  if (isYesterday(iso)) return "Yesterday";

  return parseISODate(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatProminentDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortChartLabel(iso: string): string {
  return parseISODate(iso).toLocaleDateString("en-US", { weekday: "short" });
}

export function formatDayOfMonth(iso: string): string {
  return String(parseISODate(iso).getDate());
}

export function getDateRangeEndingOn(endDate: string, dayCount: number): string[] {
  const clampedEnd = clampToAllowedRange(endDate);
  const dates: string[] = [];
  for (let i = dayCount - 1; i >= 0; i--) {
    dates.push(addDays(clampedEnd, -i));
  }
  return dates;
}
