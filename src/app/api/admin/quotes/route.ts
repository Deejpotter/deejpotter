/**
 * GET  /api/admin/quotes        — list quotes (and mark new ones as being reviewed)
 * PATCH /api/admin/quotes       — quiet edits: notes, turnaround, manual status fixes
 * POST /api/admin/quotes        — recalculate queue positions
 *
 * Admin-only. Customer-facing steps (sending a quote, shipping, etc.) go
 * through /api/admin/quotes/action, which sends the emails; PATCH never
 * emails, so fixing a mistake doesn't spam the customer.
 */

import { NextRequest, NextResponse } from "next/server";
import { listQuotes, markQuotesReviewed, updateQuote } from "@/lib/db-quotes";
import { recalculateAllTurnarounds } from "@/lib/turnaround";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";
import { QuoteStatusEnum } from "@/lib/db-schemas";

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
    const statusParam = req.nextUrl.searchParams.get("status");
    const typeParam = req.nextUrl.searchParams.get("type");
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 100;

    const filters = {
      status: (statusParam as never) || undefined,
      serviceType: (typeParam as never) || undefined,
      limit,
    };
    let quotes = await listQuotes(filters);

    // Deej opening the board is what "being reviewed" means to the customer,
    // so new quotes move on here instead of needing a click each. The list is
    // read again afterwards so the board shows the new timeline entries too.
    const newOnes = quotes.filter((q) => q.status === "new").map((q) => q.quoteNumber as number);
    if (newOnes.length > 0 && (await markQuotesReviewed(newOnes)) > 0) {
      quotes = await listQuotes(filters);
    }

    const safe = quotes.map((q) => ({
      ...q,
      _id: q._id?.toString?.(),
    }));
    return NextResponse.json(safe);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load quotes" },
      { status: 500 },
    );
  }
}

const patchSchema = z
  .object({
    quoteNumber: z.coerce.number().int().positive(),
    status: QuoteStatusEnum.optional(),
    turnaroundEstimate: z.string().max(200).nullable().optional(),
    adminNotes: z.string().max(5000).nullable().optional(),
    quotedPrice: z.number().min(0).max(100000).nullable().optional(),
  })
  .strict();

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
    // Only fields that are safe to change by hand, each validated, because a
    // bad status would drop the quote out of the workflow entirely. Payment
    // and shipping details come from the actions so they always match Stripe
    // and the emails.
    const parsed = patchSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join("; ") }, { status: 400 });
    }
    const { quoteNumber, ...patch } = parsed.data;
    const allowed: Parameters<typeof updateQuote>[1] = {};
    if (patch.status !== undefined) {
      allowed.status = patch.status;
      allowed.historyNote = "Changed by hand";
    }
    if (patch.turnaroundEstimate !== undefined) allowed.turnaroundEstimate = patch.turnaroundEstimate;
    if (patch.adminNotes !== undefined) allowed.adminNotes = patch.adminNotes;
    if (patch.quotedPrice !== undefined) allowed.quotedPrice = patch.quotedPrice;

    const updated = await updateQuote(Number(quoteNumber), allowed);
    if (!updated) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ...updated, _id: updated._id?.toString?.() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update" },
      { status: 400 },
    );
  }
}

export async function POST() {
  try {
    await requireAdmin();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error && e.message === "FORBIDDEN" ? "Forbidden" : "Unauthorized" },
      { status: e instanceof Error && e.message === "FORBIDDEN" ? 403 : 401 },
    );
  }

  try {
    await recalculateAllTurnarounds();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to recalculate" },
      { status: 500 },
    );
  }
}
