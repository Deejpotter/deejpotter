import { describe, expect, it } from "vitest";
import { paymentReceivedAdminEmail, quoteActionEmail, quoteStatusUrl } from "./email";

describe("order flow emails", () => {
  it("quote email shows print, shipping, total and the payment link", () => {
    const { subject, html } = quoteActionEmail("send_quote", {
      name: "Sam",
      quoteNumber: 1005,
      price: 40,
      shippingCost: 11.7,
      shippingLabel: "Parcel Post",
      paymentLinkUrl: "https://buy.stripe.com/test_123",
      turnaround: "3 days",
    });
    expect(subject).toBe("Your quote #1005: $51.70 AUD");
    expect(html).toContain("Parcel Post:</strong> $11.70 AUD");
    expect(html).toContain("https://buy.stripe.com/test_123");
    expect(html).toContain("3 days");
  });

  it("shipped email links to tracking for known carriers", () => {
    const { html } = quoteActionEmail("ship", {
      name: "Sam",
      quoteNumber: 1005,
      carrier: "auspost",
      trackingNumber: "33AB",
      trackingUrl: "https://auspost.com.au/mypost/track/details/33AB",
    });
    expect(html).toContain("https://auspost.com.au/mypost/track/details/33AB");
  });

  it("ready email depends on delivery method", () => {
    expect(quoteActionEmail("ready", { name: "Sam", quoteNumber: 1, deliveryMethod: "pickup" }).subject).toContain("ready for pickup");
    expect(quoteActionEmail("ready", { name: "Sam", quoteNumber: 1, deliveryMethod: "local_delivery" }).subject).toContain("out for delivery");
  });

  it("escapes customer text and keeps subjects on one line", () => {
    const { html } = quoteActionEmail("decline", { name: "<b>Sam</b>", quoteNumber: 7, reason: "<script>x</script>" });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;b&gt;Sam&lt;/b&gt;");
    const admin = paymentReceivedAdminEmail({ quoteNumber: 7, name: "A\r\nBcc: x", amountPaid: 10 });
    expect(admin.subject).not.toMatch(/[\r\n]/);
  });

  it("status link carries the quote number", () => {
    expect(quoteStatusUrl(1005)).toMatch(/\/projects\/services\/3d-printing\?quote=1005#quote-status$/);
  });
});
