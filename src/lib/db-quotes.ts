/**
 * db-quotes.ts — MongoDB-backed quote storage
 *
 * Replaces the flat-file quote-storage.ts with a proper database backend.
 * Files are still stored on disk, but metadata lives in MongoDB.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { getCollection } from "./db";
import { downloadFromR2, getR2Key, isR2Configured, uploadToR2 } from "./r2-storage";
import {
  QuoteDocSchema,
  QuoteInputSchema,
  type ServiceType,
  type QuoteStatus,
  type QuoteStatusHistoryEntry,
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

async function fileToBuffer(file: File): Promise<Buffer> {
  if (typeof file.arrayBuffer === "function") {
    return Buffer.from(await file.arrayBuffer());
  }
  return Buffer.from(await new Response(file as unknown as Blob).arrayBuffer());
}

async function saveQuoteFile(
  quoteNumber: number,
  file: File,
): Promise<{ storedAs: string; storageType: "r2" | "local" }> {
  const storedAs = sanitizeFileName(file.name || "upload.bin");
  const buffer = await fileToBuffer(file);

  // Prefer R2 so files survive serverless deploys (local disk is not durable there).
  if (isR2Configured()) {
    const key = await uploadToR2(
      buffer,
      storedAs,
      file.type || "application/octet-stream",
      String(quoteNumber),
    );
    if (key) return { storedAs, storageType: "r2" };
  }

  // Fallback for local development: save to disk.
  const root = getQuoteStorageRoot();
  const quoteDir = path.join(root, String(quoteNumber));
  await fs.mkdir(quoteDir, { recursive: true });

  const filePath = path.join(quoteDir, storedAs);

  const resolved = path.resolve(filePath);
  const resolvedDir = path.resolve(quoteDir);
  if (!resolved.startsWith(resolvedDir)) {
    throw new Error("Security: file path traversal detected");
  }

  await fs.writeFile(filePath, buffer);

  return { storedAs, storageType: "local" };
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

export async function readQuoteFileBuffer(
  quoteNumber: number,
  fileStoredAs: string,
): Promise<Buffer | null> {
  if (!fileStoredAs) return null;

  // Files uploaded while R2 was configured live there; older ones may be on disk.
  if (isR2Configured()) {
    const fromR2 = await downloadFromR2(getR2Key(String(quoteNumber), fileStoredAs));
    if (fromR2) return fromR2;
  }

  try {
    const filePath = getQuoteFilePath(String(quoteNumber), fileStoredAs);
    return await fs.readFile(filePath);
  } catch {
    return null;
  }
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
      quoteNumber,
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
      paymentLinkId: null,
      paymentLinkUrl: null,
      stripeSessionId: null,
      amountPaid: null,
      paidAt: null,
    },
    statusHistory: [{ status: "new" as QuoteStatus, at: now, by: "customer" as const }],
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
    paymentLinkId?: string | null;
    paymentLinkUrl?: string | null;
    stripeSessionId?: string | null;
    amountPaid?: number | null;
    paidAt?: string | null;
    delivery?: {
      method?: "pickup" | "local_delivery" | "shipped";
      cost?: number | null;
      estimate?: string | null;
      service?: string | null;
      carrier?: string | null;
      trackingNumber?: string | null;
      shippedAt?: string | null;
    };
    /**
     * Who caused a status change. Only recorded when the status actually
     * changes, so editing a note doesn't add a timeline entry.
     */
    changedBy?: QuoteStatusHistoryEntry["by"];
    historyNote?: string;
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
  if (patch.paymentLinkId !== undefined) update["payment.paymentLinkId"] = patch.paymentLinkId;
  if (patch.paymentLinkUrl !== undefined) update["payment.paymentLinkUrl"] = patch.paymentLinkUrl;
  if (patch.stripeSessionId !== undefined) update["payment.stripeSessionId"] = patch.stripeSessionId;
  if (patch.amountPaid !== undefined) update["payment.amountPaid"] = patch.amountPaid;
  if (patch.paidAt !== undefined) update["payment.paidAt"] = patch.paidAt;
  if (patch.delivery) {
    for (const [key, value] of Object.entries(patch.delivery)) {
      if (value !== undefined) update[`delivery.${key}`] = value;
    }
  }

  const ops: Record<string, unknown> = { $set: update };
  if (patch.status !== undefined) {
    const entry: QuoteStatusHistoryEntry = {
      status: patch.status,
      at: now,
      by: patch.changedBy ?? "admin",
      ...(patch.historyNote ? { note: patch.historyNote } : {}),
    };
    ops.$push = { statusHistory: entry };
  }

  const result = await col.findOneAndUpdate({ quoteNumber }, ops, {
    returnDocument: "after",
  });
  return result;
}

/**
 * Move new quotes to "reviewing" the first time the admin list is loaded, so
 * customers can see their request has been looked at without Deej having to
 * click anything. Only "new" quotes change, so reloading does nothing more.
 */
export async function markQuotesReviewed(quoteNumbers: number[]): Promise<number> {
  if (quoteNumbers.length === 0) return 0;
  const col = await getCollection("quotes");
  const now = new Date().toISOString();
  const entry: QuoteStatusHistoryEntry = { status: "reviewing", at: now, by: "admin" };
  const result = await col.updateMany(
    { quoteNumber: { $in: quoteNumbers }, status: "new" },
    { $set: { status: "reviewing", updatedAt: now }, $push: { statusHistory: entry } } as never,
  );
  return result.modifiedCount;
}

/**
 * Records a Stripe event id and reports whether it was new. Stripe can send
 * the same event more than once, and Render restarts wipe memory, so the ids
 * live in MongoDB; the unique index makes the check safe if two deliveries
 * arrive at the same moment.
 */
export async function claimStripeEvent(eventId: string, type: string): Promise<boolean> {
  const col = await getCollection("stripe_events");
  try {
    await col.insertOne({ _id: eventId, type, receivedAt: new Date().toISOString() } as never);
    return true;
  } catch (err) {
    if ((err as { code?: number }).code === 11000) return false;
    throw err;
  }
}

/**
 * Forgets an event whose processing failed, so Stripe's retry is handled
 * instead of being skipped as a duplicate.
 */
export async function releaseStripeEvent(eventId: string): Promise<void> {
  const col = await getCollection("stripe_events");
  await col.deleteOne({ _id: eventId } as never);
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
