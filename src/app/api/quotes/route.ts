/**
 * POST /api/quotes — Unified quote submission for all service types
 *
 * Supports: 3d_printing, laser, milling
 */

// @ts-nocheck — Zod v4 type defs differ at build time; runtime works
import { NextResponse } from "next/server";
import { z } from "zod";
import { createQuote } from "@/lib/db-quotes";
import { upsertUser } from "@/lib/db-users";
import { notifyQuoteReceived } from "@/lib/email";
import { ServiceTypeEnum } from "@/lib/db-schemas";
import { calculateTurnaround } from "@/lib/turnaround";

const quoteSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  suburb: z.string().trim().min(2).max(120),
  serviceType: ServiceTypeEnum,
  params: z.record(z.unknown()),
  delivery: z.object({
    method: z.enum(["pickup", "local_delivery", "shipped"]).default("shipped"),
    suburb: z.string().optional(),
    postcode: z.string().optional(),
  }),
  notes: z.string().max(3000).default(""),
});

const ALLOWED_EXTS_3D = [".stl", ".3mf", ".obj", ".step", ".stp"];
const ALLOWED_EXTS_2D = [".dxf", ".svg", ".ai", ".eps"];
const MAX_FILE_BYTES = 25 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const parsed = quoteSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      suburb: formData.get("suburb"),
      serviceType: formData.get("serviceType") || "3d_printing",
      params: {
        material: formData.get("material") || "PLA",
        quantity: Number(formData.get("quantity")) || 1,
        quality: formData.get("quality") || "standard",
        infill: Number(formData.get("infill")) || 15,
        scalePercent: Number(formData.get("scalePercent")) || 100,
        thickness: Number(formData.get("thickness")) || undefined,
        operation: formData.get("operation") || "cut",
      },
      delivery: {
        method: formData.get("delivery") || "shipped",
        suburb: formData.get("deliverySuburb") || undefined,
        postcode: formData.get("deliveryPostcode") || undefined,
      },
      notes: formData.get("notes") || "",
    });

    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message).join("; ");
      return NextResponse.json(
        { error: `Please complete required fields: ${errors}` },
        { status: 400 },
      );
    }

    // Validate file
    const modelFile = formData.get("modelFile");
    if (!modelFile || typeof modelFile === "string" || modelFile.size === 0) {
      return NextResponse.json(
        { error: "Please attach a file for quoting." },
        { status: 400 },
      );
    }

    const ext = "." + (modelFile.name.split(".").pop()?.toLowerCase() || "");
    const allowedExts =
      parsed.data.serviceType === "3d_printing"
        ? ALLOWED_EXTS_3D
        : ALLOWED_EXTS_2D;

    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        {
          error: `Unsupported file type. Accepted: ${allowedExts.join(", ")}`,
        },
        { status: 400 },
      );
    }

    if (modelFile.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Max 25MB." },
        { status: 400 },
      );
    }

    // Get user if authenticated
    let userId: string | null = null;
    try {
      const { auth } = await import("@clerk/nextjs/server");
      const session = await auth();
      userId = session.userId || null;
      if (userId) {
        await upsertUser({
          clerkId: userId,
          email: parsed.data.email,
          name: parsed.data.name,
        }).catch(() => {});
      }
    } catch {
      // Non-critical
    }

    // Calculate turnaround estimate
    const estimatedMinutes =
      parsed.data.serviceType === "3d_printing" ? 180 : 60;
    let turnaround: { label: string } | null = null;
    try {
      turnaround = await calculateTurnaround(estimatedMinutes);
    } catch {
      // Non-critical
    }

    const record = await createQuote({
      name: parsed.data.name,
      email: parsed.data.email,
      suburb: parsed.data.suburb,
      serviceType: parsed.data.serviceType,
      params: parsed.data.params,
      delivery: parsed.data.delivery,
      notes: parsed.data.notes,
      file: modelFile,
      userId,
    });

    // Update turnaround
    if (turnaround) {
      const { updateQuote } = await import("@/lib/db-quotes");
      await updateQuote(record.quoteNumber, {
        turnaroundEstimate: turnaround.label,
      });
    }

    // Email notifications
    notifyQuoteReceived(
      parsed.data.name,
      parsed.data.email,
      record.quoteNumber,
      parsed.data.serviceType,
    ).catch(console.error);

    return NextResponse.json({
      ok: true,
      quoteNumber: record.quoteNumber,
      turnaround: turnaround?.label || null,
      message: "Quote request received. I'll review your file and get back to you.",
    });
  } catch (error) {
    console.error("quotes error", error);
    return NextResponse.json(
      { error: "Could not process the quote request right now." },
      { status: 500 },
    );
  }
}
