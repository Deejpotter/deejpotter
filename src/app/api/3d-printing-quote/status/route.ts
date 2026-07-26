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
    stripeCheckoutUrl: record.payment?.stripeCheckoutUrl ?? null,
  });
}
