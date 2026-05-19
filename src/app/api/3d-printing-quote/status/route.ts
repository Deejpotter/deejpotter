import { NextResponse } from "next/server";
import { z } from "zod";
import { getQuoteRequestForCustomer } from "@/lib/quote-storage";

const querySchema = z.object({
  requestId: z.string().uuid(),
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
      { error: "Enter a valid request ID and matching email address." },
      { status: 400 }
    );
  }

  const record = await getQuoteRequestForCustomer(
    parsed.data.requestId,
    parsed.data.email
  );

  if (!record) {
    return NextResponse.json(
      { error: "Quote request not found for that request ID and email." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    requestId: record.id,
    status: record.status,
    quotedPrice: record.quotedPrice,
    turnaroundEstimate: record.turnaroundEstimate,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    fileName: record.fileName,
    material: record.material,
    quantity: record.quantity,
    estimate: record.analysis ?? null,
    stripeCheckoutUrl: record.stripeCheckoutUrl ?? null,
  });
}
