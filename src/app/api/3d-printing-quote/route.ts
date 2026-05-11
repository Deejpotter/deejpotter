import { NextResponse } from "next/server";
import { z } from "zod";
import {
  listQuoteRequests,
  saveQuoteRequest,
  updateQuoteRequest,
  type QuoteStatus,
} from "@/lib/quote-storage";

const quoteSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  suburb: z.string().trim().min(2).max(120),
  material: z.enum(["PLA", "PETG", "ABS", "TPU", "Unsure"]),
  quantity: z.coerce.number().int().min(1).max(1000),
  localFulfilment: z.enum(["yes", "no", "unsure"]),
  needsNextDay: z.enum(["yes", "no"]),
  notes: z.string().max(3000).optional().default(""),
});

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "new",
    "reviewing",
    "quoted",
    "approved",
    "printing",
    "ready",
    "completed",
    "declined",
  ] satisfies QuoteStatus[]),
  quotedPrice: z.number().nonnegative().nullable().optional(),
  turnaroundEstimate: z.string().max(200).nullable().optional(),
  adminNotes: z.string().max(3000).nullable().optional(),
});

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
    const _clerk = await import("@clerk/nextjs");
    const anyClerk = _clerk as any;
    const getter =
      typeof anyClerk?.auth === "function"
        ? anyClerk.auth
        : typeof anyClerk?.getAuth === "function"
          ? anyClerk.getAuth
          : () => ({ userId: null });
    return getter();
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

export async function GET() {
  const { userId } = await getAuthAsync();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const records = await listQuoteRequests();
    return NextResponse.json(records, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("3d-printing-quote list error", error);
    return NextResponse.json({ error: "Could not load quote requests." }, { status: 500 });
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
      quantity: formData.get("quantity"),
      localFulfilment: formData.get("localFulfilment"),
      needsNextDay: formData.get("needsNextDay"),
      notes: formData.get("notes") ?? "",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please complete the required quote fields." },
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

    const record = await saveQuoteRequest(parsed.data, modelFile);

    console.info("3d-printing-quote", {
      requestId: record.id,
      ...parsed.data,
      fileName: record.fileName,
      fileSize: record.fileSize,
      fileType: record.fileType,
    });

    return NextResponse.json({
      ok: true,
      requestId: record.id,
      message:
        "Quote request received. I will review the file and reply with pricing and turnaround.",
    });
  } catch (error) {
    console.error("3d-printing-quote error", error);
    return NextResponse.json(
      { error: "Could not process the quote request right now." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { userId } = await getAuthAsync();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid quote update payload." }, { status: 400 });
    }

    const updated = await updateQuoteRequest(parsed.data.id, {
      status: parsed.data.status,
      quotedPrice: parsed.data.quotedPrice,
      turnaroundEstimate: parsed.data.turnaroundEstimate,
      adminNotes: parsed.data.adminNotes,
    });

    if (!updated) {
      return NextResponse.json({ error: "Quote request not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("3d-printing-quote patch error", error);
    return NextResponse.json({ error: "Could not update the quote request." }, { status: 500 });
  }
}
