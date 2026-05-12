import { NextResponse } from "next/server";
import { z } from "zod";
import { saveContactLead } from "@/lib/contact-leads";

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
