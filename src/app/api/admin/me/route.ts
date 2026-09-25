/**
 * GET /api/admin/me — Tells the client whether the signed-in user is an admin.
 *
 * Uses the same check as the admin pages (Mongo role or Clerk metadata), so
 * the navbar's Admin link matches what /admin actually allows.
 */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdminUser } from "@/lib/admin-auth";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ isAdmin: false });
  }
  try {
    return NextResponse.json({ isAdmin: await isAdminUser(userId) });
  } catch {
    // If the admin check fails (e.g. database down), just hide the link.
    return NextResponse.json({ isAdmin: false });
  }
}
