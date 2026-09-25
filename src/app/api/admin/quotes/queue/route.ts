/**
 * GET  /api/admin/quotes/queue  — get queue stats
 * POST /api/admin/quotes/queue  — recalculate all turnarounds
 *
 * Admin-only.
 */

import { NextResponse } from "next/server";
import { getQuoteStats } from "@/lib/db-quotes";
import { recalculateAllTurnarounds } from "@/lib/turnaround";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error && e.message === "FORBIDDEN" ? "Forbidden" : "Unauthorized" },
      { status: e instanceof Error && e.message === "FORBIDDEN" ? 403 : 401 },
    );
  }

  try {
    const stats = await getQuoteStats();
    return NextResponse.json(stats);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load queue stats" },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    await requireAdmin();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error && e.message === "FORBIDDEN" ? "Forbidden" : "Unauthorized" },
      { status: e instanceof Error && e.message === "FORBIDDEN" ? 403 : 401 },
    );
  }

  try {
    await recalculateAllTurnarounds();
    return NextResponse.json({ success: true, message: "Turnarounds recalculated" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to recalculate" },
      { status: 500 },
    );
  }
}
