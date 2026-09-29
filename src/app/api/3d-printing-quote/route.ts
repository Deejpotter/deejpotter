/**
 * POST /api/3d-printing-quote — Submits a 3D printing quote request
 *
 * The browser has already shown the customer a live price, but nothing it
 * sends is trusted: this route re-measures the uploaded STL, prices it with
 * the materials and rates from MongoDB, and re-prices delivery before saving.
 * That stored estimate is what Deej sees and what "Send quote" prefills.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { createQuote } from "@/lib/db-quotes";
import { analyzeQuoteFile } from "@/lib/quote-analysis";
import { getEnabledMaterials, getSettings } from "@/lib/db-config";
import { getDeliveryOptions, isValidPostcode, shippingSettingsFrom } from "@/lib/shipping";
import { upsertUser } from "@/lib/db-users";
import { notifyQuoteReceived } from "@/lib/email";
import { escapeHtml } from "@/lib/utils";


const quoteSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  suburb: z.string().trim().min(2).max(120),
  // Checked against the enabled materials in MongoDB after parsing
  material: z.string().trim().min(1).max(60),
  customMaterial: z.string().trim().max(200).optional().default(""),
  quantity: z.coerce.number().int().min(1).max(1000),
  // Delivery: the postcode prices postage, and the option is what the
  // customer picked from the live list. Older form posts without them are
  // treated as pickup, and Deej sorts delivery out when sending the quote.
  postcode: z.string().trim().regex(/^\d{4}$/, "Enter a 4-digit postcode.").optional().or(z.literal("")),
  deliveryOption: z.enum(["pickup", "local_delivery", "AUS_PARCEL_REGULAR", "AUS_PARCEL_EXPRESS"]).optional().default("pickup"),
  localFulfilment: z.enum(["yes", "no", "unsure"]).optional(),
  needsNextDay: z.enum(["yes", "no"]),
  notes: z.string().max(3000).optional().default(""),
  // Interactive builder options
  quality: z.enum(["draft", "standard", "high"]).optional().default("standard"),
  infill: z.coerce.number().int().min(5).max(25).optional().default(15),
  scalePercent: z.coerce.number().int().min(50).max(200).optional().default(100),
}).refine(
  (data) => data.material !== "other" || data.customMaterial.length > 0,
  { message: "Please describe the material or colour you're looking for.", path: ["customMaterial"] }
);



const allowedExtensions = [".stl", ".3mf", ".obj", ".step", ".stp"];
const allowedMimeTypes = [
  "model/stl",
  "application/sla",
  "application/vnd.ms-package.3dmanufacturing-3dmodel+xml",
  "model/obj",
  "application/octet-stream",
  "",
];
const maxFileBytes = 25 * 1024 * 1024;

async function getAuthAsync() {
  try {
    const { auth } = await import("@clerk/nextjs/server");
    return await auth();
  } catch {
    return { userId: null };
  }
}

function hasAllowedExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return allowedExtensions.some((extension) => lower.endsWith(extension));
}

function hasAllowedFileType(file: File): boolean {
  return hasAllowedExtension(file.name) || allowedMimeTypes.includes(file.type || "");
}

function isFileLike(value: FormDataEntryValue | null): value is File {
  return !!value && typeof value !== "string" && "name" in value && "size" in value;
}

/**
 * Sanitise a filename to prevent path traversal on read-back.
 * Strips directory separators and limits length.
 */
function sanitiseFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "-").slice(0, 200);
}

/**
 * Works out the delivery price again on the server from the uploaded file,
 * rather than trusting the number the browser showed, so a tampered form
 * can't set its own shipping price. If the option isn't available any more
 * (e.g. Australia Post was down) the choice is kept but the cost is left
 * empty for Deej to fill in when sending the quote.
 */
async function priceDelivery(
  option: "pickup" | "local_delivery" | "AUS_PARCEL_REGULAR" | "AUS_PARCEL_EXPRESS",
  postcode: string,
  quantity: number,
  analysis: Awaited<ReturnType<typeof analyzeQuoteFile>>,
): Promise<{ method: "pickup" | "local_delivery" | "shipped"; cost: number | null; service: string | null; label: string | null }> {
  type Delivery = { method: "pickup" | "local_delivery" | "shipped"; cost: number | null; service: string | null; label: string | null };
  if (option === "pickup") return { method: "pickup", cost: 0, service: null, label: "Pickup" };

  const settings = shippingSettingsFrom(await getSettings().then((s) => s.shipping).catch(() => null));

  // Local delivery depends only on the postcode, so it's decided here from the
  // admin list rather than trusted from the form. A non-local postcode asking
  // for it becomes a posted order with no price yet, which Deej prices by hand.
  if (option === "local_delivery") {
    return settings.localPostcodes.includes(postcode.trim())
      ? { method: "local_delivery", cost: settings.localDeliveryFee, service: null, label: "Local delivery" }
      : { method: "shipped", cost: null, service: null, label: null };
  }

  // Posted: price it from the server's own measurements of the file.
  const unpriced: Delivery = { method: "shipped", cost: null, service: option, label: null };
  if (!isValidPostcode(postcode) || !analysis.boundingBoxMm || !analysis.estimatedMaterialGrams) return unpriced;
  try {
    const { options } = await getDeliveryOptions({
      postcode,
      sizeMm: analysis.boundingBoxMm,
      gramsEach: analysis.estimatedMaterialGrams / quantity,
      quantity,
      settings,
    });
    const match = options.find((o) => o.id === option);
    return match ? { method: "shipped", cost: match.price, service: option, label: match.label } : unpriced;
  } catch {
    return unpriced;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = quoteSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      suburb: formData.get("suburb"),
      material: formData.get("material"),
      customMaterial: formData.get("customMaterial") ?? "",
      quantity: formData.get("quantity"),
      postcode: formData.get("postcode") ?? "",
      deliveryOption: formData.get("deliveryOption") || undefined,
      localFulfilment: formData.get("localFulfilment") || undefined,
      needsNextDay: formData.get("needsNextDay"),
      notes: formData.get("notes") ?? "",
      quality: formData.get("quality") ?? "standard",
      infill: formData.get("infill") ?? 15,
      scalePercent: formData.get("scalePercent") ?? 100,
    });

    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message).join("; ");
      return NextResponse.json(
        { error: `Please complete the required quote fields: ${errors}` },
        { status: 400 }
      );
    }

    // Materials and prices are admin-editable (MongoDB service config)
    const materials = await getEnabledMaterials("3d_printing");
    const selectedMaterial = materials.find((m) => m.id === parsed.data.material);
    if (!selectedMaterial) {
      return NextResponse.json(
        { error: "That material isn't available. Please pick another or choose Other." },
        { status: 400 }
      );
    }

    const modelFile = formData.get("modelFile");
    if (!isFileLike(modelFile) || modelFile.size === 0) {
      return NextResponse.json(
        { error: "Please attach a model file for quoting." },
        { status: 400 }
      );
    }

    if (!hasAllowedFileType(modelFile)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload STL, 3MF, OBJ, STEP, or STP." },
        { status: 400 }
      );
    }

    if (modelFile.size > maxFileBytes) {
      return NextResponse.json(
        { error: "File is too large. Please keep uploads under 25 MB for now." },
        { status: 400 }
      );
    }

    const analysis = await analyzeQuoteFile(
      modelFile,
      parsed.data.quantity,
      parsed.data.material,
      {
        quality: parsed.data.quality,
        infill: parsed.data.infill,
        scalePercent: parsed.data.scalePercent,
        ratePerGram: selectedMaterial.ratePerGram,
        density: selectedMaterial.density,
      }
    );

    const delivery = await priceDelivery(parsed.data.deliveryOption, parsed.data.postcode || "", parsed.data.quantity, analysis);

    // Get Clerk user if authenticated
    const { userId } = await getAuthAsync();
    if (userId) {
      // Sync user on quote submission
      try {
        await upsertUser({
          clerkId: userId,
          email: parsed.data.email,
          name: parsed.data.name,
        });
      } catch {
        // Non-critical — user sync will happen via webhook anyway
      }
    }

    const record = await createQuote({
      name: parsed.data.name,
      email: parsed.data.email,
      suburb: parsed.data.suburb,
      serviceType: "3d_printing",
      params: {
        material: parsed.data.material,
        quantity: parsed.data.quantity,
        quality: parsed.data.quality,
        infill: parsed.data.infill,
        scalePercent: parsed.data.scalePercent,
      },
      delivery: {
        method: delivery.method,
        suburb: parsed.data.suburb,
        postcode: parsed.data.postcode || "",
        cost: delivery.cost,
        service: delivery.service,
        label: delivery.label,
      },
      notes: parsed.data.notes,
      file: modelFile,
      userId: userId || null,
      analysis: analysis
        ? {
            analysisAvailable: analysis.analysisAvailable,
            fileKind: analysis.fileKind,
            boundingBoxMm: analysis.boundingBoxMm,
            triangleCount: analysis.triangleCount,
            estimatedMaterialGrams: analysis.estimatedMaterialGrams,
            estimatedPrintHours: analysis.estimatedPrintHours,
            estimatedPriceAud: analysis.estimatedPriceAud,
            previewNote: analysis.previewNote,
            confidence: analysis.confidence,
            needsManualQuote: analysis.needsManualQuote,
          }
        : null,
    });

    console.info("3d-printing-quote", {
      quoteNumber: record.quoteNumber,
      name: parsed.data.name,
      fileName: record.fileName,
      fileSize: record.fileSize,
      analysisAvailable: analysis?.analysisAvailable,
      estimatedPriceAud: analysis?.estimatedPriceAud,
    });

    // Fire email notifications (non-blocking)
    notifyQuoteReceived(
      parsed.data.name,
      parsed.data.email,
      record.quoteNumber,
      "3d_printing",
    ).catch((err) => console.error("[email] Failed to send:", err));

    return NextResponse.json({
      ok: true,
      requestId: record.quoteNumber,
      message:
        "Quote request received. I will review the file and reply with pricing and turnaround.",
      estimate: analysis,
    });
  } catch (error) {
    console.error("3d-printing-quote error", error);
    return NextResponse.json(
      { error: "Could not process the quote request right now." },
      { status: 500 }
    );
  }
}


