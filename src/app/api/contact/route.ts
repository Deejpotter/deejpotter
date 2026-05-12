import { NextResponse } from "next/server";
import { z } from "zod";
import {
  listContactLeads,
  saveContactLead,
  updateContactLeadStatus,
  type ContactLeadStatus,
} from "@/lib/contact-leads";

const leadContextSchema = z.object({
  currentPath: z.string().max(200).optional().default(""),
  referrer: z.string().max(500).optional().default(""),
  source: z.string().max(120).optional().default(""),
  utmSource: z.string().max(120).optional().default(""),
  utmMedium: z.string().max(120).optional().default(""),
  utmCampaign: z.string().max(120).optional().default(""),
  utmTerm: z.string().max(120).optional().default(""),
  utmContent: z.string().max(120).optional().default(""),
});

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  projectType: z.string().trim().max(60).optional().or(z.literal("")),
  source: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(2000),
  leadContext: leadContextSchema.optional(),
});

const contactStatuses = ["new", "reviewed", "replied", "closed"] as const;

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(contactStatuses),
});

async function getAuthAsync() {
  try {
    const clerk = await import("@clerk/nextjs");
    const anyClerk = clerk as any;
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

export async function GET() {
  const { userId } = await getAuthAsync();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await listContactLeads();
    return NextResponse.json(leads, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("contact route list error", error);
    return NextResponse.json({ error: "Could not load contact leads." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please complete the required contact fields." },
        { status: 400 }
      );
    }

    const lead = await saveContactLead({
      ...parsed.data,
      leadContext: parsed.data.leadContext || {
        currentPath: "",
        referrer: "",
        source: parsed.data.source || "",
        utmSource: "",
        utmMedium: "",
        utmCampaign: "",
        utmTerm: "",
        utmContent: "",
      },
    });

    return NextResponse.json(
      {
        ok: true,
        requestId: lead.id,
        message: "Message received. I will get back to you as soon as I can.",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("contact route error", error);
    return NextResponse.json(
      { error: "Could not process the contact form right now." },
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
      return NextResponse.json({ error: "Invalid lead update payload." }, { status: 400 });
    }

    const updated = await updateContactLeadStatus(parsed.data.id, parsed.data.status);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("contact route patch error", error);
    return NextResponse.json({ error: "Could not update the lead." }, { status: 500 });
  }
}
