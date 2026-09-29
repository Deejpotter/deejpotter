/**
 * GET /api/shipping/estimate — Delivery options for the quote form
 *
 * The form calls this with the part's size and weight (measured in the
 * browser) and the customer's postcode, and shows the returned prices live.
 * It runs on the server because the Australia Post key must stay private and
 * the pickup/local rules live in the admin settings. The prices shown here are
 * checked again when the quote is submitted, using the server's own
 * measurements of the uploaded file.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { getSettings } from "@/lib/db-config";
import { getDeliveryOptions, shippingSettingsFrom } from "@/lib/shipping";

const querySchema = z.object({
  postcode: z.string().regex(/^\d{4}$/, "Enter a 4-digit postcode."),
  x: z.coerce.number().positive().max(2000),
  y: z.coerce.number().positive().max(2000),
  z: z.coerce.number().positive().max(2000),
  grams: z.coerce.number().positive().max(50000),
  quantity: z.coerce.number().int().min(1).max(1000),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }
  const { postcode, x, y, z: height, grams, quantity } = parsed.data;

  // Settings are optional here: if the database is unreachable the defaults
  // (Frankston origin, nearby postcodes, free local delivery) still work.
  const dbShipping = await getSettings().then((s) => s.shipping).catch(() => null);

  const result = await getDeliveryOptions({
    postcode,
    sizeMm: { x, y, z: height },
    gramsEach: grams,
    quantity,
    settings: shippingSettingsFrom(dbShipping),
  });
  return NextResponse.json(result);
}
