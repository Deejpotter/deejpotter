import fs from "node:fs/promises";
import path from "node:path";

export type QuoteStatus =
  | "new"
  | "reviewing"
  | "quoted"
  | "awaiting_payment"
  | "approved"
  | "printing"
  | "ready"
  | "completed"
  | "declined";

import type { QuoteAnalysis } from "./quote-analysis";

export interface QuoteRequestRecord {
  id: string;
  name: string;
  email: string;
  suburb: string;
  material: string;
  customMaterial?: string;
  quantity: number;
  localFulfilment: "yes" | "no" | "unsure";
  needsNextDay: "yes" | "no";
  notes: string;
  fileName: string;
  fileStoredAs: string;
  fileType: string;
  fileSize: number;
  status: QuoteStatus;
  quotedPrice?: number | null;
  turnaroundEstimate?: string | null;
  adminNotes?: string | null;
  analysis?: QuoteAnalysis | null;
  createdAt: string;
  updatedAt: string;
  // Interactive builder params
  quality?: "draft" | "standard" | "high";
  infill?: number;
  scalePercent?: number;
  // Stripe checkout
  stripeCheckoutUrl?: string | null;
  stripeSessionId?: string | null;
}

export interface QuoteRequestInput {
  name: string;
  email: string;
  suburb: string;
  material: string;
  customMaterial?: string;
  quantity: number;
  localFulfilment: "yes" | "no" | "unsure";
  needsNextDay: "yes" | "no";
  notes: string;
  quality?: "draft" | "standard" | "high";
  infill?: number;
  scalePercent?: number;
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export function getQuoteStorageRoot(): string {
  return process.env.QUOTE_STORAGE_DIR || path.join(process.cwd(), "data", "3d-printing-quotes");
}

function getIndexPath(root = getQuoteStorageRoot()): string {
  return path.join(root, "index.json");
}

async function ensureRoot(root = getQuoteStorageRoot()): Promise<void> {
  await fs.mkdir(root, { recursive: true });
}

async function readIndex(root = getQuoteStorageRoot()): Promise<QuoteRequestRecord[]> {
  await ensureRoot(root);
  const indexPath = getIndexPath(root);

  try {
    const raw = await fs.readFile(indexPath, "utf8");
    const parsed = JSON.parse(raw) as QuoteRequestRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

async function writeIndex(records: QuoteRequestRecord[], root = getQuoteStorageRoot()): Promise<void> {
  await ensureRoot(root);
  await fs.writeFile(getIndexPath(root), JSON.stringify(records, null, 2) + "\n", "utf8");
}

/**
 * Maximum records to keep in the index to prevent unbounded growth.
 * Older records are trimmed. Files on disk are retained for archival.
 */
const MAX_INDEX_RECORDS = 1000;

export async function saveQuoteRequest(
  input: QuoteRequestInput,
  file: File,
  analysis?: QuoteAnalysis | null
): Promise<QuoteRequestRecord> {
  const root = getQuoteStorageRoot();
  await ensureRoot(root);

  const id = crypto.randomUUID();
  const requestDir = path.join(root, id);
  await fs.mkdir(requestDir, { recursive: true });

  // Sanitised filename prevents path traversal — only safe chars allowed
  const fileStoredAs = sanitizeFileName(file.name || "upload.bin");
  const filePath = path.join(requestDir, fileStoredAs);

  // Verify the resolved path is within the request directory (defence in depth)
  const resolvedPath = path.resolve(filePath);
  const resolvedDir = path.resolve(requestDir);
  if (!resolvedPath.startsWith(resolvedDir)) {
    throw new Error("Security: file path traversal detected");
  }

  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  const now = new Date().toISOString();
  // Only spread known safe fields — not the raw file object or any unknown keys
  const record: QuoteRequestRecord = {
    id,
    name: input.name,
    email: input.email,
    suburb: input.suburb,
    material: input.material,
    customMaterial: input.customMaterial,
    quantity: input.quantity,
    localFulfilment: input.localFulfilment,
    needsNextDay: input.needsNextDay,
    notes: input.notes,
    quality: input.quality,
    infill: input.infill,
    scalePercent: input.scalePercent,
    fileName: file.name || fileStoredAs,
    fileStoredAs,
    fileType: file.type || "application/octet-stream",
    fileSize: file.size,
    status: "new",
    quotedPrice: null,
    turnaroundEstimate: null,
    adminNotes: null,
    analysis: analysis ?? null,
    createdAt: now,
    updatedAt: now,
  };

  const records = await readIndex(root);
  records.unshift(record);

  // Cap the index at MAX_INDEX_RECORDS to prevent unbounded growth
  // (files on disk are retained for archival)
  if (records.length > MAX_INDEX_RECORDS) {
    records.length = MAX_INDEX_RECORDS;
  }

  await writeIndex(records, root);

  return record;
}

export async function listQuoteRequests(): Promise<QuoteRequestRecord[]> {
  const records = await readIndex();
  return [...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getQuoteRequest(id: string): Promise<QuoteRequestRecord | null> {
  const records = await readIndex();
  return records.find((record) => record.id === id) || null;
}

export async function getQuoteRequestForCustomer(
  id: string,
  email: string
): Promise<QuoteRequestRecord | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const records = await readIndex();
  return (
    records.find(
      (record) =>
        record.id === id && record.email.trim().toLowerCase() === normalizedEmail
    ) || null
  );
}

export async function updateQuoteRequest(
  id: string,
  patch: Partial<Pick<QuoteRequestRecord, "status" | "quotedPrice" | "turnaroundEstimate" | "adminNotes" | "stripeCheckoutUrl" | "stripeSessionId">>
): Promise<QuoteRequestRecord | null> {
  const records = await readIndex();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return null;

  const next: QuoteRequestRecord = {
    ...records[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  records[index] = next;
  await writeIndex(records);
  return next;
}

export function getQuoteRequestFilePath(record: QuoteRequestRecord): string {
  const filePath = path.join(getQuoteStorageRoot(), record.id, record.fileStoredAs);
  // Verify resolved path is within the storage root (path traversal prevention)
  const resolved = path.resolve(filePath);
  const root = path.resolve(getQuoteStorageRoot());
  if (!resolved.startsWith(root)) {
    throw new Error("Security: path traversal detected");
  }
  return resolved;
}
