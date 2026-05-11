import fs from "node:fs/promises";
import path from "node:path";

export type QuoteStatus =
  | "new"
  | "reviewing"
  | "quoted"
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
}

export interface QuoteRequestInput {
  name: string;
  email: string;
  suburb: string;
  material: string;
  quantity: number;
  localFulfilment: "yes" | "no" | "unsure";
  needsNextDay: "yes" | "no";
  notes: string;
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

  const fileStoredAs = sanitizeFileName(file.name || "upload.bin");
  const filePath = path.join(requestDir, fileStoredAs);
  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  const now = new Date().toISOString();
  const record: QuoteRequestRecord = {
    id,
    ...input,
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
  patch: Partial<Pick<QuoteRequestRecord, "status" | "quotedPrice" | "turnaroundEstimate" | "adminNotes">>
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
  return path.join(getQuoteStorageRoot(), record.id, record.fileStoredAs);
}
