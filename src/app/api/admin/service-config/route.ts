/**
 * GET  /api/admin/service-config          — get all service configs
 * GET  /api/admin/service-config?type=X   — get config for one service
 * PATCH /api/admin/service-config         — update a service config
 *
 * Admin-only.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getAllServiceConfigs,
  getServiceConfig,
  updateServiceConfig,
} from "@/lib/db-config";
import { requireAdmin } from "@/lib/admin-auth";
import { ServiceTypeEnum } from "@/lib/db-schemas";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error && e.message === "FORBIDDEN" ? "Forbidden" : "Unauthorized" },
      { status: e instanceof Error && e.message === "FORBIDDEN" ? 403 : 401 },
    );
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
  try {
    await requireAdmin();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error && e.message === "FORBIDDEN" ? "Forbidden" : "Unauthorized" },
      { status: e instanceof Error && e.message === "FORBIDDEN" ? 403 : 401 },
    );
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
