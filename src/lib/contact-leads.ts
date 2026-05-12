import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

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

export type ContactLeadRecord = ContactLeadInput & {
  id: string;
  status: "new" | "reviewed" | "replied" | "closed";
  createdAt: string;
  updatedAt: string;
};

function getRootDir() {
  return process.env.CONTACT_LEADS_DIR || path.join(process.cwd(), "data", "contact-leads");
}

function getIndexPath(root = getRootDir()) {
  return path.join(root, "index.json");
}

async function ensureRoot(root = getRootDir()) {
  await fs.mkdir(root, { recursive: true });
}

async function readIndex(root = getRootDir()): Promise<ContactLeadRecord[]> {
  await ensureRoot(root);
  try {
    const raw = await fs.readFile(getIndexPath(root), "utf8");
    const parsed = JSON.parse(raw) as ContactLeadRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeIndex(records: ContactLeadRecord[], root = getRootDir()) {
  await ensureRoot(root);
  await fs.writeFile(getIndexPath(root), JSON.stringify(records, null, 2) + "\n", "utf8");
}

export async function saveContactLead(input: ContactLeadInput): Promise<ContactLeadRecord> {
  const root = getRootDir();
  const records = await readIndex(root);
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

  records.unshift(record);
  await writeIndex(records, root);
  return record;
}

export async function listContactLeads(): Promise<ContactLeadRecord[]> {
  return readIndex();
}
