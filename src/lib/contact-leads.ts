/**
 * lib/contact-leads.ts — Contact form leads, stored in MongoDB.
 *
 * Leads used to live in a JSON file on disk, which Render wipes on every
 * deploy. They now live in the "contact_leads" collection. Each lead keeps
 * a string `id` (UUID) so the admin inbox and status updates don't depend
 * on Mongo's ObjectId.
 */

import { randomUUID } from "node:crypto";
import { getCollection } from "./db";

export type LeadContext = {
  currentPath: string;
  referrer: string;
  source: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
};

export type ContactLeadInput = {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  source?: string;
  message: string;
  leadContext?: LeadContext;
};

export type ContactLeadStatus = "new" | "reviewed" | "replied" | "closed";

export type ContactLeadRecord = ContactLeadInput & {
  id: string;
  status: ContactLeadStatus;
  createdAt: string;
  updatedAt: string;
};

const COLLECTION = "contact_leads";

// Leave Mongo's internal _id out of everything we return.
const withoutMongoId = { projection: { _id: 0 } } as const;

function leadsCollection() {
  return getCollection<ContactLeadRecord>(COLLECTION);
}

export async function saveContactLead(input: ContactLeadInput): Promise<ContactLeadRecord> {
  const now = new Date().toISOString();
  const record: ContactLeadRecord = {
    id: randomUUID(),
    status: "new",
    createdAt: now,
    updatedAt: now,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    company: input.company?.trim() || "",
    projectType: input.projectType?.trim() || "",
    source: input.source?.trim() || "",
    message: input.message.trim(),
    leadContext: input.leadContext || {
      currentPath: "",
      referrer: "",
      source: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
    },
  };

  const leads = await leadsCollection();
  // insertOne adds _id to the object it's given, so insert a copy.
  await leads.insertOne({ ...record });
  return record;
}

export async function listContactLeads(): Promise<ContactLeadRecord[]> {
  const leads = await leadsCollection();
  return leads.find({}, withoutMongoId).sort({ createdAt: -1 }).toArray();
}

export async function updateContactLeadStatus(
  id: string,
  status: ContactLeadStatus
): Promise<ContactLeadRecord | null> {
  const leads = await leadsCollection();
  return leads.findOneAndUpdate(
    { id },
    { $set: { status, updatedAt: new Date().toISOString() } },
    { returnDocument: "after", ...withoutMongoId }
  );
}
