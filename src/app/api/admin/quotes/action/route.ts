/**
 * POST /api/admin/quotes/action — One admin button press on a quote
 *
 * Body: { quoteNumber, action, ...inputs }. The work (status, Stripe link,
 * emails) is done by performQuoteAction so the buttons behave exactly like the
 * Stripe webhook does for payments. Errors come back as a readable message
 * because they're shown to Deej as-is (e.g. "Enter the tracking number.").
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { performQuoteAction, QuoteActionError } from "@/lib/quote-actions";

const bodySchema = z.object({
  quoteNumber: z.coerce.number().int().positive(),
  action: z.enum(["send_quote", "mark_paid", "start", "ready", "ship", "complete", "decline", "cancel"]),
  price: z.coerce.number().min(0).max(100000).optional(),
  shippingCost: z.coerce.number().min(0).max(10000).nullable().optional(),
  shippingLabel: z.string().max(100).nullable().optional(),
  turnaround: z.string().max(200).nullable().optional(),
  carrier: z.string().max(50).nullable().optional(),
  trackingNumber: z.string().max(100).nullable().optional(),
  reason: z.string().max(1000).nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e) {
    const forbidden = e instanceof Error && e.message === "FORBIDDEN";
    return NextResponse.json({ error: forbidden ? "Forbidden" : "Unauthorized" }, { status: forbidden ? 403 : 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join("; ") }, { status: 400 });
  }

  const { quoteNumber, action, ...input } = parsed.data;
  try {
    const updated = await performQuoteAction(quoteNumber, action, input, "admin");
    return NextResponse.json({ ...updated, _id: updated._id?.toString?.() });
  } catch (err) {
    if (err instanceof QuoteActionError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error(`[admin action] ${action} on #${quoteNumber} failed:`, err);
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
