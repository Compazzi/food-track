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

export function formatDisplayDate(iso: string): string {
  if (isToday(iso)) return "Today";

  const date = parseISODate(iso);
  const today = parseISODate(TODAY);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (formatISODate(yesterday) === iso) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatShortChartLabel(iso: string): string {
  return parseISODate(iso).toLocaleDateString("en-US", { weekday: "short" });
}

export function formatDayOfMonth(iso: string): string {
  return String(parseISODate(iso).getDate());
}

export function getDateRangeEndingOn(endDate: string, dayCount: number): string[] {
  const dates: string[] = [];
  for (let i = dayCount - 1; i >= 0; i--) {
    dates.push(addDays(endDate, -i));
  }
  return dates;
}
