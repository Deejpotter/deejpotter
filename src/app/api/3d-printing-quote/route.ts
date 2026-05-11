import { NextResponse } from "next/server";
import { z } from "zod";

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

    const requestId = crypto.randomUUID();

    console.info("3d-printing-quote", {
      requestId,
      ...parsed.data,
      fileName: modelFile.name,
      fileSize: modelFile.size,
      fileType: modelFile.type || "unknown",
    });

    return NextResponse.json({
      ok: true,
      requestId,
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
