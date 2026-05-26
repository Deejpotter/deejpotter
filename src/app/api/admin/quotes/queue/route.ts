/**
 * GET  /api/admin/quotes/queue  — get queue stats
 * POST /api/admin/quotes/queue  — recalculate all turnarounds
 *
 * Admin-only.
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getQuoteStats } from "@/lib/db-quotes";
import { recalculateAllTurnarounds } from "@/lib/turnaround";
import { isAdmin } from "@/lib/db-users";

export async function GET() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await isAdmin(session.userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await isAdmin(session.userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
