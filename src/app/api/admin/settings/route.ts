/**
 * GET  /api/admin/settings  — get global settings
 * PATCH /api/admin/settings — update business hours, holidays, vacations, shipping
 *
 * Admin-only. Checks Clerk auth + role.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/db-config";
import { requireAdmin } from "@/lib/admin-auth";

async function requireAdminOrError() {
  try {
    await requireAdmin();
    return null;
  } catch (e) {
    return e instanceof Error && e.message === "FORBIDDEN"
      ? NextResponse.json({ error: "Forbidden" }, { status: 403 })
      : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function GET() {
  const error = await requireAdminOrError();
  if (error) return error;

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
  const error = await requireAdminOrError();
  if (error) return error;

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
