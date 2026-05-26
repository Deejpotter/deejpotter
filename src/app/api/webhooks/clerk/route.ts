/**
 * POST /api/webhooks/clerk — Clerk webhook receiver
 *
 * Keeps the local users collection in sync with Clerk.
 * Handles: user.created, user.updated, user.deleted
 *
 * Set this URL in Clerk Dashboard > Webhooks:
 *   https://deejpotter.com/api/webhooks/clerk
 *
 * Requires: CLERK_WEBHOOK_SECRET in env for signature verification.
 *
 * NOTE: The Stripe webhook at /api/webhooks/stripe already exists
 * and uses raw body parsing in its route handler.
 */

import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { upsertUser, deleteUser } from "@/lib/db-users";

export async function POST(req: NextRequest) {
  // Verify webhook signature
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 },
    );
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: { type: string; data: Record<string, unknown> };

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as { type: string; data: Record<string, unknown> };
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 },
    );
  }

  // Handle events
  const eventType = evt.type;

  try {
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const data = evt.data;
        const primaryEmail =
          (data.email_addresses as Array<{ email_address: string }>)?.[0]
            ?.email_address || "";
        const publicMetadata = data.public_metadata as
          | { role?: string }
          | undefined;

        if (primaryEmail) {
          await upsertUser({
            clerkId: data.id as string,
            email: primaryEmail,
            name: `${(data.first_name as string) || ""} ${(data.last_name as string) || ""}`.trim() || primaryEmail,
            role:
              publicMetadata?.role === "admin" ? "admin" : "customer",
          });
          console.log(`[clerk] User ${eventType}: ${primaryEmail}`);
        }
        break;
      }

      case "user.deleted": {
        if (evt.data.id) {
          await deleteUser(evt.data.id as string);
          console.log(`[clerk] User deleted: ${evt.data.id}`);
        }
        break;
      }

      default:
        console.log(`[clerk] Unhandled event: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[clerk] Webhook handler error:", err);
    return NextResponse.json(
      { error: "Handler error" },
      { status: 500 },
    );
  }
}
