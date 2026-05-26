/**
 * turnaround.ts — Business hours & queue-aware turnaround calculator
 *
 * Calculates estimated completion dates based on:
 * - Current queue depth (active jobs ahead of this one)
 * - Estimated print/cut time for each job
 * - Configured business hours
 * - Holidays and vacation periods
 *
 * Customer-facing output is intentionally minimal ("ETA: 3 Business days").
 * Full details are available in the admin dashboard.
 */

import { getSettings } from "./db-config";
import { getCollection } from "./db";
import type { QuoteStatus } from "./db-schemas";

interface BusinessHours {
  day: string;
  start: string;
  end: string;
  closed: boolean;
}

interface Settings {
  businessHours: BusinessHours[];
  holidays: { date: string; name: string }[];
  vacations: { start: string; end: string; reason?: string }[];
}

/**
 * Parse "HH:MM" to minutes since midnight.
 */
function parseMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Check if a given date is a day off (holiday, vacation, or closed day).
 */
export function isDayOff(date: Date, settings: Settings): boolean {
  const dateStr = date.toISOString().split("T")[0];
  const dayName = date
    .toLocaleDateString("en-AU", { weekday: "long" })
    .toLowerCase();

  // Check holidays
  if (settings.holidays.some((h) => h.date === dateStr)) return true;

  // Check vacation periods
  if (
    settings.vacations.some(
      (v) => dateStr >= v.start && dateStr <= v.end,
    )
  )
    return true;

  // Check closed day
  const dayConfig = settings.businessHours.find(
    (d) => d.day === dayName,
  );
  if (!dayConfig || dayConfig.closed) return true;

  return false;
}

/**
 * Get the configured business minutes for a specific day.
 * Returns 0 if the day is closed or a day off.
 */
export function getBusinessMinutesForDate(
  date: Date,
  settings: Settings,
): number {
  if (isDayOff(date, settings)) return 0;

  const dayName = date
    .toLocaleDateString("en-AU", { weekday: "long" })
    .toLowerCase();
  const day = settings.businessHours.find((d) => d.day === dayName);
  if (!day || day.closed) return 0;

  const start = parseMinutes(day.start);
  const end = parseMinutes(day.end);
  return Math.max(0, end - start);
}

/**
 * Calculate the total estimated minutes for all active jobs ahead
 * in the queue (including the current job's estimate).
 */
export async function getQueueMinutesAhead(
  estimatedMinutes: number,
): Promise<number> {
  const col = await getCollection("quotes");
  const ACTIVE_STATUSES: QuoteStatus[] = [
    "new",
    "reviewing",
    "quoted",
    "awaiting_payment",
    "approved",
    "in_progress",
  ];

  const activeJobs = await col
    .find({ status: { $in: ACTIVE_STATUSES } })
    .project({ "analysis.estimatedPrintHours": 1, "analysis.estimatedTimeMinutes": 1 })
    .toArray();

  let totalMinutes = 0;
  for (const job of activeJobs) {
    // Use estimatedTimeMinutes for laser/milling, hours*60 for 3D printing
    const jobMins =
      (job.analysis as Record<string, unknown>)?.estimatedTimeMinutes as number ||
      ((job.analysis as Record<string, unknown>)?.estimatedPrintHours as number || 0) * 60 ||
      120; // Default 2 hours if no estimate
    totalMinutes += Math.max(30, jobMins); // Minimum 30 min per job
  }

  // Add the current job's estimate
  totalMinutes += Math.max(30, estimatedMinutes);

  return totalMinutes;
}

/**
 * Calculate the estimated completion date.
 *
 * Takes the total minutes of work, distributes them across business days,
 * and returns the date when the work would be completed.
 */
export async function calculateTurnaround(
  estimatedMinutes: number,
): Promise<{
  queuePosition: number;
  totalMinutesAhead: number;
  estimatedCompletionDate: string;
  businessDays: number;
  label: string;
}> {
  const settings = await getSettings();
  const totalMinutes = await getQueueMinutesAhead(estimatedMinutes);

  // Count active jobs for queue position
  const col = await getCollection("quotes");
  const queuePosition = await col.countDocuments({
    status: {
      $in: ["new", "reviewing", "quoted", "awaiting_payment", "approved", "in_progress"],
    },
  });

  // Walk through business days accumulating minutes
  let remaining = totalMinutes;
  let cursor = new Date();
  let businessDays = 0;

  // Start from tomorrow (today is already in progress)
  cursor.setDate(cursor.getDate() + 1);

  while (remaining > 0) {
    // Skip non-business days
    while (isDayOff(cursor, settings)) {
      cursor.setDate(cursor.getDate() + 1);
    }

    const dayMinutes = getBusinessMinutesForDate(cursor, settings);
    if (dayMinutes > 0) {
      if (remaining <= dayMinutes) {
        // Work completes on this day
        const dayStart = settings.businessHours.find(
          (d) => d.day === cursor
            .toLocaleDateString("en-AU", { weekday: "long" })
            .toLowerCase(),
        );
        if (dayStart) {
          const startMin = parseMinutes(dayStart.start);
          const completionMin = startMin + remaining;
          const hours = Math.floor(completionMin / 60);
          const minutes = completionMin % 60;
          cursor.setHours(hours, minutes, 0, 0);
        }
        remaining = 0;
        businessDays++;
      } else {
        remaining -= dayMinutes;
        businessDays++;
      }
    }
    if (remaining > 0) {
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  const completionDate = cursor.toISOString();
  const label = `ETA: ${businessDays} Business day${businessDays !== 1 ? "s" : ""}`;

  return {
    queuePosition,
    totalMinutesAhead: totalMinutes,
    estimatedCompletionDate: completionDate,
    businessDays,
    label,
  };
}

/**
 * Recalculate queue positions and turnaround for all active quotes.
 * Call this whenever business hours change or jobs are added/completed.
 */
export async function recalculateAllTurnarounds(): Promise<void> {
  const col = await getCollection("quotes");
  const ACTIVE_STATUSES: QuoteStatus[] = [
    "new",
    "reviewing",
    "quoted",
    "awaiting_payment",
    "approved",
    "in_progress",
  ];

  const activeJobs = await col
    .find({ status: { $in: ACTIVE_STATUSES } })
    .sort({ createdAt: 1 })
    .project({ quoteNumber: 1 })
    .toArray();

  const now = new Date().toISOString();

  for (let i = 0; i < activeJobs.length; i++) {
    const job = activeJobs[i];
    // Simple sequential position
    await col.updateOne(
      { quoteNumber: job.quoteNumber },
      {
        $set: {
          queuePosition: i + 1,
          updatedAt: now,
        },
      },
    );
  }
}
