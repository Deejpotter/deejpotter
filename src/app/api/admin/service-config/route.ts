/**
 * GET  /api/admin/service-config          — get all service configs
 * GET  /api/admin/service-config?type=X   — get config for one service
 * PATCH /api/admin/service-config         — update a service config
 *
 * Admin-only.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getAllServiceConfigs,
  getServiceConfig,
  updateServiceConfig,
} from "@/lib/db-config";
import { isAdmin } from "@/lib/db-users";
import { ServiceTypeEnum } from "@/lib/db-schemas";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await isAdmin(session.userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const typeParam = req.nextUrl.searchParams.get("type");
    if (typeParam) {
      const parsed = ServiceTypeEnum.parse(typeParam);
      const config = await getServiceConfig(parsed);
      return NextResponse.json(config);
    }
    const all = await getAllServiceConfigs();
    return NextResponse.json(all);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 400 },
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
    const { serviceType, ...patch } = body;

    if (!serviceType) {
      return NextResponse.json(
        { error: "serviceType is required" },
        { status: 400 },
      );
    }

    const parsed = ServiceTypeEnum.parse(serviceType);
    const updated = await updateServiceConfig(parsed, patch);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update" },
      { status: 400 },
    );
  }
}
