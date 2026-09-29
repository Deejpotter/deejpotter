/**
 * email.ts — Email notification utility
 *
 * Uses Resend to send transactional emails for quote workflow events.
 * Requires RESEND_API_KEY in .env.
 */

import { Resend } from "resend";
import { escapeHtml } from "./utils";
import type { QuoteAction, DeliveryMethod } from "./quote-workflow";

const FROM_ADDRESS = process.env.EMAIL_FROM || "Deej Potter <noreply@deejpotter.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "deejpotter@gmail.com";
// Links in emails must point at the site that sent them, so a test quote on
// staging doesn't send the customer to production (a different database).
const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "https://deejpotter.com").replace(/\/$/, "");

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
      <h2 style="margin:0 0 12px;font-size:18px;color:#111">${escapeHtml(title)}</h2>
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
      You can check your quote any time
      <a href="${quoteStatusUrl(quoteNumber)}" style="color:#1E9952">on the 3D printing page</a>
      with your quote number and email.
    </p>
    <p style="margin:0;font-size:15px;color:#374151">
      If you have any questions, just reply to this email.
    </p>`;
  return { subject, html: emailShell(subject, body) };
}

export function newQuoteAdminEmail(name: string, email: string, quoteNumber: number, serviceType: string): { subject: string; html: string } {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  // Subjects are plain text: strip line breaks (header injection) but don't HTML-escape.
  const subject = `New quote #${quoteNumber} from ${name.replace(/[\r\n]+/g, " ")}`;
  const body = `
    <p style="margin:0 0 12px;font-size:15px;color:#374151">
      <strong>${safeName}</strong> (${safeEmail}) submitted a new ${serviceType.replace("_", " ")} quote.
    </p>
    <p style="margin:0 0 12px;font-size:15px;color:#374151">
      <strong>Quote:</strong> #${quoteNumber}
    </p>
    <p style="margin:0;font-size:15px;color:#374151">
      <a href="${SITE_URL}/admin/3d-printing" style="display:inline-block;background:#1E9952;color:#fff;padding:10px 24px;border-radius:24px;text-decoration:none;font-weight:600">
        Review in admin
      </a>
    </p>`;
  return { subject, html: emailShell(subject, body) };
}

// ─── Order flow emails ─────────────────────────────────────────────

/** Everything an order email might need; each action uses the parts it cares about. */
export interface QuoteEmailContext {
  name: string;
  quoteNumber: number;
  price?: number | null;
  shippingCost?: number | null;
  shippingLabel?: string | null;
  paymentLinkUrl?: string | null;
  turnaround?: string | null;
  deliveryMethod?: DeliveryMethod;
  carrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  amountPaid?: number | null;
  reason?: string | null;
}

const para = (html: string) => `<p style="margin:0 0 12px;font-size:15px;color:#374151">${html}</p>`;
const button = (href: string, label: string) =>
  para(`<a href="${escapeHtml(href)}" style="display:inline-block;background:#1E9952;color:#fff;padding:10px 24px;border-radius:24px;text-decoration:none;font-weight:600">${escapeHtml(label)}</a>`);
const money = (value: number) => `$${value.toFixed(2)} AUD`;

/**
 * Where a customer checks their order. It works without an account (quote
 * number + email), which matters because most customers never sign up.
 */
export function quoteStatusUrl(quoteNumber: number): string {
  return `${SITE_URL}/projects/services/3d-printing?quote=${quoteNumber}#quote-status`;
}

/**
 * The customer email for each admin action (and for the Stripe payment).
 * Wording is plain and first person because it comes from Deej, and each email
 * says what happens next so the customer never has to ask.
 */
export function quoteActionEmail(action: QuoteAction, ctx: QuoteEmailContext): { subject: string; html: string } {
  const hi = para(`Hi ${escapeHtml(ctx.name)},`);
  const n = ctx.quoteNumber;
  const status = button(quoteStatusUrl(n), "Check your order");
  let subject: string;
  let body: string;

  switch (action) {
    case "send_quote": {
      const total = (ctx.price ?? 0) + (ctx.shippingCost ?? 0);
      subject = `Your quote #${n}: ${money(total)}`;
      body = [
        hi,
        para(`I've checked your file and your quote is ready.`),
        ctx.price != null ? para(`<strong>Print:</strong> ${money(ctx.price)}`) : "",
        ctx.shippingCost ? para(`<strong>${escapeHtml(ctx.shippingLabel || "Shipping")}:</strong> ${money(ctx.shippingCost)}`) : "",
        para(`<strong>Total:</strong> ${money(total)}`),
        ctx.turnaround ? para(`<strong>Turnaround:</strong> ${escapeHtml(ctx.turnaround)} after payment`) : "",
        ctx.paymentLinkUrl ? button(ctx.paymentLinkUrl, "Pay securely with Stripe") : "",
        para(`I'll start as soon as it's paid. If anything looks wrong, just reply to this email.`),
      ].join("");
      break;
    }
    case "mark_paid":
      subject = `Payment received for #${n}`;
      body = [
        hi,
        para(`Thanks, your payment${ctx.amountPaid ? ` of ${money(ctx.amountPaid)}` : ""} came through. Your job is in the queue and I'll let you know when I start it.`),
        status,
      ].join("");
      break;
    case "start":
      subject = `I've started on #${n}`;
      body = [hi, para(`Your job is now being made.${ctx.turnaround ? ` Expected: ${escapeHtml(ctx.turnaround)}.` : ""}`), status].join("");
      break;
    case "ready":
      if (ctx.deliveryMethod === "local_delivery") {
        subject = `#${n} is out for delivery`;
        body = [hi, para(`Your order is done and on its way to you.`), status].join("");
      } else {
        subject = `#${n} is ready for pickup`;
        body = [hi, para(`Your order is done and ready to collect in Frankston. Reply to this email to arrange a time.`), status].join("");
      }
      break;
    case "ship": {
      subject = `#${n} has shipped`;
      const tracking = ctx.trackingNumber
        ? ctx.trackingUrl
          ? button(ctx.trackingUrl, `Track parcel ${ctx.trackingNumber}`)
          : para(`<strong>Tracking number:</strong> ${escapeHtml(ctx.trackingNumber)}${ctx.carrier ? ` (${escapeHtml(ctx.carrier)})` : ""}`)
        : "";
      body = [hi, para(`Your order is on its way.`), tracking, status].join("");
      break;
    }
    case "complete":
      subject = `#${n} is complete`;
      body = [hi, para(`Thanks for your order. If anything isn't right with the part, reply to this email and I'll sort it out.`)].join("");
      break;
    case "decline":
      subject = `About your quote #${n}`;
      body = [
        hi,
        para(`Sorry, I can't take on this job.${ctx.reason ? ` ${escapeHtml(ctx.reason)}` : ""}`),
        para(`If you'd like to change something and try again, reply to this email.`),
      ].join("");
      break;
    case "cancel":
      subject = `#${n} has been cancelled`;
      body = [
        hi,
        para(`Your order has been cancelled.${ctx.reason ? ` ${escapeHtml(ctx.reason)}` : ""}`),
        para(`If you've already paid, I'll arrange a refund. Reply to this email with any questions.`),
      ].join("");
      break;
  }

  // Subjects are plain text: strip line breaks (header injection), don't HTML-escape.
  subject = subject.replace(/[\r\n]+/g, " ");
  return { subject, html: emailShell(subject, body) };
}

/** Tells Deej a payment landed, so a paid job never sits unnoticed. */
export function paymentReceivedAdminEmail(ctx: { quoteNumber: number; name: string; amountPaid: number | null }): { subject: string; html: string } {
  const subject = `Paid: quote #${ctx.quoteNumber}${ctx.amountPaid ? ` (${money(ctx.amountPaid)})` : ""}`;
  const body = [
    para(`<strong>${escapeHtml(ctx.name)}</strong> paid quote #${ctx.quoteNumber}. It's now in the queue.`),
    button(`${SITE_URL}/admin/3d-printing`, "Open the quote board"),
  ].join("");
  return { subject, html: emailShell(subject, body) };
}

/**
 * A payment Deej has to act on by hand, e.g. a customer paid an old link for
 * an order that was since cancelled, so they may be owed a refund.
 */
export async function notifyAdminPaymentProblem(quoteNumber: number, problem: string) {
  const subject = `Check payment on quote #${quoteNumber}`;
  const body = [para(escapeHtml(problem)), button(`${SITE_URL}/admin/3d-printing`, "Open the quote board")].join("");
  await sendEmail(ADMIN_EMAIL, subject, emailShell(subject, body));
}

export async function notifyQuoteAction(email: string, action: QuoteAction, ctx: QuoteEmailContext) {
  const template = quoteActionEmail(action, ctx);
  await sendEmail(email, template.subject, template.html);
}

export async function notifyAdminPaymentReceived(ctx: { quoteNumber: number; name: string; amountPaid: number | null }) {
  const template = paymentReceivedAdminEmail(ctx);
  await sendEmail(ADMIN_EMAIL, template.subject, template.html);
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
