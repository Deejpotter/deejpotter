/**
 * GET /api/health — Health check endpoint
 *
 * Used by Render for service monitoring.
 * Checks database connectivity.
 */

import { NextResponse } from "next/server";

export async function GET() {
  let dbStatus: "connected" | "disconnected" = "disconnected";

  try {
    const { healthCheck } = await import("@/lib/db");
    const result = await healthCheck();
    dbStatus = result.connected ? "connected" : "disconnected";
  } catch {
    dbStatus = "disconnected";
  }

  const healthy = dbStatus === "connected";

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      db: dbStatus,
      uptime: process.uptime(),
    },
    { status: healthy ? 200 : 503 },
  );
}
