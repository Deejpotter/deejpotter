/**
 * GET  /api/admin/quotes        — list all quotes
 * PATCH /api/admin/quotes       — update quote (status, price, turnaround, notes)
 * POST /api/admin/quotes        — recalculate queue positions
 *
 * Admin-only.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { listQuotes, updateQuote, getQuote } from "@/lib/db-quotes";
import { recalculateAllTurnarounds } from "@/lib/turnaround";
import { isAdmin } from "@/lib/db-users";
import { notifyQuoteUpdated } from "@/lib/email";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await isAdmin(session.userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const statusParam = req.nextUrl.searchParams.get("status");
    const typeParam = req.nextUrl.searchParams.get("type");
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 100;

    const quotes = await listQuotes({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (statusParam as any) || undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      serviceType: (typeParam as any) || undefined,
      limit,
    });

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
    const { quoteNumber, ...patch } = body;
    if (!quoteNumber) {
      return NextResponse.json(
        { error: "quoteNumber is required" },
        { status: 400 },
      );
    }

    const updated = await updateQuote(Number(quoteNumber), patch);
    if (!updated) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 },
      );
    }

    // Send email notification if status or price changed
    if (patch.status || patch.quotedPrice !== undefined) {
      const quote = patch.status
        ? await getQuote(Number(quoteNumber))
        : await getQuote(Number(quoteNumber));
      if (quote) {
        notifyQuoteUpdated(
          quote.userName || quote.userEmail,
          quote.userEmail,
          quote.quoteNumber,
          patch.status || quote.status,
          patch.quotedPrice !== undefined ? patch.quotedPrice : quote.quotedPrice,
        ).catch((err) => console.error("[email] Failed to send update:", err));
      }
    }

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update" },
      { status: 400 },
    );
  }
}

export async function POST() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await isAdmin(session.userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
