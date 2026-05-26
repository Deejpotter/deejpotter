/**
 * db-quotes.ts — MongoDB-backed quote storage
 *
 * Replaces the flat-file quote-storage.ts with a proper database backend.
 * Files are still stored on disk, but metadata lives in MongoDB.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { getCollection } from "./db";
import {
  QuoteDocSchema,
  QuoteInputSchema,
  type ServiceType,
  type QuoteStatus,
} from "./db-schemas";

// ─── File Storage ───────────────────────────────────────────────────

function getQuoteStorageRoot(): string {
  return (
    process.env.QUOTE_STORAGE_DIR ||
    path.join(process.cwd(), "data", "quotes")
  );
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function saveQuoteFile(
  quoteId: string,
  file: File,
): Promise<{ storedAs: string; filePath: string }> {
  const root = getQuoteStorageRoot();
  const quoteDir = path.join(root, quoteId);
  await fs.mkdir(quoteDir, { recursive: true });

  const storedAs = sanitizeFileName(file.name || "upload.bin");
  const filePath = path.join(quoteDir, storedAs);

  // Path traversal defence
  const resolved = path.resolve(filePath);
  const resolvedDir = path.resolve(quoteDir);
  if (!resolved.startsWith(resolvedDir)) {
    throw new Error("Security: file path traversal detected");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return { storedAs, filePath };
}

export function getQuoteFilePath(
  quoteId: string,
  fileName: string,
): string {
  const root = getQuoteStorageRoot();
  const filePath = path.join(root, quoteId, fileName);
  const resolved = path.resolve(filePath);
  const resolvedRoot = path.resolve(root);
  if (!resolved.startsWith(resolvedRoot)) {
    throw new Error("Security: path traversal detected");
  }
  return resolved;
}

// ─── CRUD Operations ────────────────────────────────────────────────

export async function createQuote(input: {
  name: string;
  email: string;
  suburb: string;
  serviceType: ServiceType;
  params: Record<string, unknown>;
  delivery: {
    method: "pickup" | "local_delivery" | "shipped";
    suburb?: string;
    postcode?: string;
    address?: string;
  };
  notes?: string;
  file?: File;
  userId?: string | null;
  analysis?: Record<string, unknown> | null;
}) {
  const col = await getCollection("quotes");
  const now = new Date().toISOString();

  // Validate input
  const validated = QuoteInputSchema.parse({
    name: input.name,
    email: input.email,
    suburb: input.suburb,
    serviceType: input.serviceType,
    params: input.params,
    delivery: input.delivery,
    notes: input.notes || "",
  });

  const isLocal =
    input.delivery.suburb
      ?.toLowerCase()
      .includes("frankston") || false;

  // Generate sequential quote number
  const highest = await col
    .find()
    .sort({ quoteNumber: -1 })
    .limit(1)
    .toArray();
  const quoteNumber = (highest[0]?.quoteNumber || 1000) + 1;

  // Save file if provided
  let fileInfo:
    | { fileName: string; fileStoredAs: string; fileType: string; fileSize: number }
    | undefined;
  if (input.file) {
    const { storedAs } = await saveQuoteFile(
      String(quoteNumber),
      input.file,
    );
    fileInfo = {
      fileName: input.file.name,
      fileStoredAs: storedAs,
      fileType: input.file.type || "application/octet-stream",
      fileSize: input.file.size,
    };
  }

  const doc = {
    ...validated,
    quoteNumber,
    userId: input.userId || null,
    userEmail: input.email.toLowerCase().trim(),
    userName: input.name,
    status: "new" as QuoteStatus,
    fileName: fileInfo?.fileName || "",
    fileStoredAs: fileInfo?.fileStoredAs || "",
    fileType: fileInfo?.fileType || "",
    fileSize: fileInfo?.fileSize || 0,
    analysis: input.analysis || null,
    quotedPrice: null,
    delivery: {
      method: validated.delivery.method,
      suburb: validated.delivery.suburb || validated.suburb,
      postcode: validated.delivery.postcode || "",
      address: validated.delivery.address || "",
      isLocal,
      cost: null,
      estimate: null,
    },
    payment: {
      stripeCheckoutUrl: null,
      stripeSessionId: null,
      paidAt: null,
    },
    queuePosition: null,
    turnaroundEstimate: null,
    estimatedCompletionDate: null,
    notes: validated.notes,
    adminNotes: null,
    createdAt: now,
    updatedAt: now,
  };

  // Parse through schema for validation
  const parsed = QuoteDocSchema.parse(doc);
  const result = await col.insertOne(parsed);
  return { ...parsed, _id: result.insertedId };
}

export async function listQuotes(filters?: {
  status?: QuoteStatus | QuoteStatus[];
  serviceType?: ServiceType;
  userId?: string;
  userEmail?: string;
  limit?: number;
  offset?: number;
}) {
  const col = await getCollection("quotes");
  const query: Record<string, unknown> = {};

  if (filters?.status) {
    query.status = Array.isArray(filters.status)
      ? { $in: filters.status }
      : filters.status;
  }
  if (filters?.serviceType) query.serviceType = filters.serviceType;
  if (filters?.userId) query.userId = filters.userId;
  if (filters?.userEmail) query.userEmail = filters.userEmail.toLowerCase();

  return col
    .find(query)
    .sort({ createdAt: -1 })
    .skip(filters?.offset || 0)
    .limit(filters?.limit || 100)
    .toArray();
}

export async function getQuote(quoteNumber: number) {
  const col = await getCollection("quotes");
  return col.findOne({ quoteNumber });
}

export async function getQuoteById(id: string) {
  const col = await getCollection("quotes");
  return col.findOne({ _id: id } as never);
}

export async function updateQuote(
  quoteNumber: number,
  patch: {
    status?: QuoteStatus;
    quotedPrice?: number | null;
    turnaroundEstimate?: string | null;
    estimatedCompletionDate?: string | null;
    queuePosition?: number | null;
    adminNotes?: string | null;
    stripeCheckoutUrl?: string | null;
    stripeSessionId?: string | null;
    paidAt?: string | null;
    delivery?: {
      method?: "pickup" | "local_delivery" | "shipped";
      cost?: number | null;
      estimate?: string | null;
    };
  },
) {
  const col = await getCollection("quotes");
  const now = new Date().toISOString();

  const update: Record<string, unknown> = { updatedAt: now };

  if (patch.status !== undefined) update.status = patch.status;
  if (patch.quotedPrice !== undefined) update.quotedPrice = patch.quotedPrice;
  if (patch.turnaroundEstimate !== undefined) update.turnaroundEstimate = patch.turnaroundEstimate;
  if (patch.estimatedCompletionDate !== undefined) update.estimatedCompletionDate = patch.estimatedCompletionDate;
  if (patch.queuePosition !== undefined) update.queuePosition = patch.queuePosition;
  if (patch.adminNotes !== undefined) update.adminNotes = patch.adminNotes;
  if (patch.stripeCheckoutUrl !== undefined) update["payment.stripeCheckoutUrl"] = patch.stripeCheckoutUrl;
  if (patch.stripeSessionId !== undefined) update["payment.stripeSessionId"] = patch.stripeSessionId;
  if (patch.paidAt !== undefined) update["payment.paidAt"] = patch.paidAt;
  if (patch.delivery?.method !== undefined) update["delivery.method"] = patch.delivery.method;
  if (patch.delivery?.cost !== undefined) update["delivery.cost"] = patch.delivery.cost;
  if (patch.delivery?.estimate !== undefined) update["delivery.estimate"] = patch.delivery.estimate;

  const result = await col.findOneAndUpdate(
    { quoteNumber },
    { $set: update },
    { returnDocument: "after" },
  );
  return result;
}

export async function getQuoteForCustomer(
  quoteNumber: number,
  email: string,
) {
  const col = await getCollection("quotes");
  return col.findOne({
    quoteNumber,
    userEmail: email.toLowerCase().trim(),
  });
}

/**
 * Count active quotes ahead of a given quote for queue position.
 */
export async function getQueuePosition(): Promise<number> {
  const col = await getCollection("quotes");
  const activeStatuses: QuoteStatus[] = [
    "new",
    "reviewing",
    "quoted",
    "awaiting_payment",
    "approved",
    "in_progress",
  ];
  return col.countDocuments({ status: { $in: activeStatuses } });
}

/**
 * Get dashboard stats for admin.
 */
export async function getQuoteStats() {
  const col = await getCollection("quotes");
  const newQuotes = col.countDocuments({ status: "new" });
  const pendingQuotes = col.countDocuments({
    status: { $in: ["quoted", "awaiting_payment"] },
  });
  const activeJobs = col.countDocuments({
    status: { $in: ["approved", "in_progress"] },
  });
  const completedToday = col.countDocuments({
    status: "completed",
    updatedAt: { $gte: new Date().toISOString().split("T")[0] },
  });

  const [n, p, a, c] = await Promise.all([
    newQuotes,
    pendingQuotes,
    activeJobs,
    completedToday,
  ]);

  return { newQuotes: n, pendingQuotes: p, activeJobs: a, completedToday: c };
}
