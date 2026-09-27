import { NextResponse } from "next/server";
import { z } from "zod";
import { getQuoteForCustomer } from "@/lib/db-quotes";

const querySchema = z.object({
  requestId: z.coerce.number().int().positive(),
  email: z.string().trim().email(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    requestId: url.searchParams.get("requestId"),
    email: url.searchParams.get("email"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid quote number and matching email address." },
      { status: 400 }
    );
  }

  const record = await getQuoteForCustomer(
    parsed.data.requestId,
    parsed.data.email
  );

  if (!record) {
    return NextResponse.json(
      { error: "Quote request not found for that quote number and email." },
      { status: 404 }
    );
  }

  const params = (record.params || {}) as Record<string, unknown>;

  return NextResponse.json({
    requestId: String(record.quoteNumber),
    status: record.status,
    quotedPrice: record.quotedPrice ?? null,
    turnaroundEstimate: record.turnaroundEstimate ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    fileName: record.fileName,
    material: String(params.material || ""),
    quantity: Number(params.quantity || 1),
    estimate: record.analysis ?? null,
    // What the customer needs to act on or follow the order. Internal fields
    // (admin notes, Stripe ids) stay out of this public response.
    deliveryMethod: record.delivery?.method ?? "pickup",
    shippingCost: record.delivery?.cost ?? null,
    shippingLabel: record.delivery?.estimate ?? null,
    carrier: record.delivery?.carrier ?? null,
    trackingNumber: record.delivery?.trackingNumber ?? null,
    paymentLinkUrl: record.status === "awaiting_payment" ? record.payment?.paymentLinkUrl ?? null : null,
    paidAt: record.payment?.paidAt ?? null,
    history: (record.statusHistory ?? []).map((h: { status: string; at: string }) => ({ status: h.status, at: h.at })),
  });
}
