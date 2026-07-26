import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listOrders, updateOrderStatus } from "@/lib/db-shop-orders";
import type { OrderStatus } from "@/lib/shop-schemas";

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
    const status = req.nextUrl.searchParams.get("status") as OrderStatus | null;
    const orders = await listOrders({
      status: status || undefined,
      limit: 100,
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
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
    const { orderId, status, notes } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId and status are required" }, { status: 400 });
    }

    const updated = await updateOrderStatus(orderId, status, { notes });
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
