/**
 * email.ts — Email notification utility
 *
 * Uses Resend to send transactional emails for quote workflow events.
 * Requires RESEND_API_KEY in .env.
 */

import { Resend } from "resend";
import { escapeHtml } from "./utils";

const FROM_ADDRESS = process.env.EMAIL_FROM || "Deej Potter <noreply@deejpotter.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "deejpotter@gmail.com";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendEmail(to: string, subject: string, html: string) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping email to", to);
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [to],
      subject,
      html,
    });
    if (error) {
      console.error("[email] Failed:", error);
    } else {
      console.log("[email] Sent:", subject, "→", to);
    }
  } catch (err) {
    console.error("[email] Error:", err);
  }
}

// ─── Templates ─────────────────────────────────────────────────────

function emailShell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:20px;background:#f5f5f5">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
    <tr><td style="background:#1E9952;padding:24px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:20px">Deej Potter</h1>
    </td></tr>
    <tr><td style="padding:24px">
      <h2 style="margin:0 0 12px;font-size:18px;color:#111">${title}</h2>
      ${body}
    </td></tr>
    <tr><td style="background:#f9fafb;padding:16px 24px;border-top:1px solid #e5e7eb">
      <p style="margin:0;font-size:12px;color:#9ca3af">
        Deej Potter Designs · Frankston VIC · <a href="https://deejpotter.com" style="color:#1E9952">deejpotter.com</a>
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}

export function quoteReceivedEmail(name: string, quoteNumber: number): { subject: string; html: string } {
  const safeName = escapeHtml(name);
  const subject = `Quote #${quoteNumber} received — we'll review your file`;
  const body = `
    <p style="margin:0 0 12px;font-size:15px;color:#374151">Hi ${safeName},</p>
    <p style="margin:0 0 12px;font-size:15px;color:#374151">
      Thanks for your quote request. I've received your file and will review it within
      the next business day.
    </p>
    <p style="margin:0 0 12px;font-size:15px;color:#374151">
      <strong>Your quote number:</strong> #${quoteNumber}
    </p>
    <p style="margin:0 0 12px;font-size:15px;color:#374151">
      You can track your quote status at
      <a href="https://deejpotter.com/account" style="color:#1E9952">deejpotter.com/account</a>
    </p>
    <p style="margin:0;font-size:15px;color:#374151">
      If you have any questions, just reply to this email.
    </p>`;
  return { subject, html: emailShell(subject, body) };
}

export function quoteUpdatedEmail(name: string, quoteNumber: number, status: string, price?: number | null): { subject: string; html: string } {
  const safeName = escapeHtml(name);
  const statusLabels: Record<string, string> = {
    reviewing: "being reviewed",
    quoted: "ready with pricing",
    awaiting_payment: "awaiting payment",
    approved: "approved — print starting soon",
    in_progress: "in production",
    ready: "ready for pickup/delivery",
    completed: "completed",
    declined: "not proceeding at this time",
  };
  const statusLabel = statusLabels[status] || status.replace("_", " ");

  const subject = `Quote #${quoteNumber} update — ${statusLabel}`;
  const body = `
    <p style="margin:0 0 12px;font-size:15px;color:#374151">Hi ${safeName},</p>
    <p style="margin:0 0 12px;font-size:15px;color:#374151">
      Your quote <strong>#${quoteNumber}</strong> has been updated: <strong>${statusLabel}</strong>.
    </p>
    ${price ? `<p style="margin:0 0 12px;font-size:15px;color:#374151"><strong>Quoted price:</strong> $${price.toFixed(2)} AUD</p>` : ""}
    <p style="margin:0 0 12px;font-size:15px;color:#374151">
      <a href="https://deejpotter.com/account" style="display:inline-block;background:#1E9952;color:#fff;padding:10px 24px;border-radius:24px;text-decoration:none;font-weight:600">
        View your quote
      </a>
    </p>
    <p style="margin:0;font-size:15px;color:#374151">Questions? Reply to this email.</p>`;
  return { subject, html: emailShell(subject, body) };
}

export function newQuoteAdminEmail(name: string, email: string, quoteNumber: number, serviceType: string): { subject: string; html: string } {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const subject = `New quote #${quoteNumber} from ${safeName}`;
  const body = `
    <p style="margin:0 0 12px;font-size:15px;color:#374151">
      <strong>${safeName}</strong> (${safeEmail}) submitted a new ${serviceType.replace("_", " ")} quote.
    </p>
    <p style="margin:0 0 12px;font-size:15px;color:#374151">
      <strong>Quote:</strong> #${quoteNumber}
    </p>
    <p style="margin:0;font-size:15px;color:#374151">
      <a href="https://deejpotter.com/admin/3d-printing" style="display:inline-block;background:#1E9952;color:#fff;padding:10px 24px;border-radius:24px;text-decoration:none;font-weight:600">
        Review in admin
      </a>
    </p>`;
  return { subject, html: emailShell(subject, body) };
}

// ─── Convenience Triggers ──────────────────────────────────────────

export async function notifyQuoteReceived(
  name: string,
  email: string,
  quoteNumber: number,
  serviceType: string,
) {
  // Customer email
  const customer = quoteReceivedEmail(name, quoteNumber);
  await sendEmail(email, customer.subject, customer.html);

  // Admin email
  const admin = newQuoteAdminEmail(name, email, quoteNumber, serviceType);
  await sendEmail(ADMIN_EMAIL, admin.subject, admin.html);
}

export async function notifyQuoteUpdated(
  name: string,
  email: string,
  quoteNumber: number,
  status: string,
  price?: number | null,
) {
  const template = quoteUpdatedEmail(name, quoteNumber, status, price);
  await sendEmail(email, template.subject, template.html);
}
