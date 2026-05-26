/**
 * GET  /api/admin/settings  — get global settings
 * PATCH /api/admin/settings — update business hours, holidays, vacations, shipping
 *
 * Admin-only. Checks Clerk auth + role.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSettings, updateSettings } from "@/lib/db-config";
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
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await isAdmin(session.userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = await updateSettings(body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update settings" },
      { status: 400 },
    );
  }
}
