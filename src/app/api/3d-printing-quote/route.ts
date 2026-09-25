import { NextResponse } from "next/server";
import { z } from "zod";
import { createQuote } from "@/lib/db-quotes";
import { analyzeQuoteFile } from "@/lib/quote-analysis";
import { getMaterialIds } from "@/lib/printing-materials";
import { upsertUser } from "@/lib/db-users";
import { notifyQuoteReceived } from "@/lib/email";
import { escapeHtml } from "@/lib/utils";

const materialIds = getMaterialIds();
const materialEnum = z.enum(materialIds as [string, ...string[]]);

const quoteSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  suburb: z.string().trim().min(2).max(120),
  material: materialEnum,
  customMaterial: z.string().trim().max(200).optional().default(""),
  quantity: z.coerce.number().int().min(1).max(1000),
  localFulfilment: z.enum(["yes", "no", "unsure"]),
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
      localFulfilment: formData.get("localFulfilment"),
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
      }
    );

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
        method: parsed.data.localFulfilment === "yes" ? "local_delivery" : "shipped",
        suburb: parsed.data.suburb,
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


