/**
 * /api/groceries/list — List all parsed grocery orders
 * /api/groceries/delete — Delete an order
 */

import { NextResponse } from "next/server";
import { adminApiGuard } from "@/lib/admin-auth";
import { listOrders, deleteOrder, getSpendingSummary } from "@/lib/groceries-storage";

export async function GET() {
  const denied = await adminApiGuard();
  if (denied) return denied;

  try {
    const [orders, summary] = await Promise.all([
      listOrders(),
      getSpendingSummary(),
    ]);
    return NextResponse.json({ orders, summary });
  } catch (error) {
    console.error("Groceries list error:", error);
    return NextResponse.json({ error: "Could not list orders." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const denied = await adminApiGuard();
  if (denied) return denied;

  try {
    const { order_number } = await request.json();
    if (!order_number) {
      return NextResponse.json({ error: "order_number is required." }, { status: 400 });
    }
    const deleted = await deleteOrder(order_number);
    if (!deleted) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Groceries delete error:", error);
    return NextResponse.json({ error: "Could not delete order." }, { status: 500 });
  }
}
