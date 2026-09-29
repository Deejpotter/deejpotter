import { describe, expect, it } from "vitest";
import {
  adminActionsFor,
  canApplyAction,
  customerStatusLabel,
  nextStatus,
  trackingUrl,
} from "./quote-workflow";

describe("quote workflow", () => {
  it("only lets a quote be paid while a price is out", () => {
    expect(canApplyAction("awaiting_payment", "mark_paid")).toBe(true);
    expect(canApplyAction("cancelled", "mark_paid")).toBe(false);
    expect(canApplyAction("approved", "mark_paid")).toBe(false);
    expect(nextStatus("mark_paid")).toBe("approved");
  });

  it("won't start a job that hasn't been paid", () => {
    expect(canApplyAction("awaiting_payment", "start")).toBe(false);
    expect(canApplyAction("approved", "start")).toBe(true);
  });

  it("allows re-sending a quote to correct the price", () => {
    expect(canApplyAction("awaiting_payment", "send_quote")).toBe(true);
    expect(nextStatus("send_quote")).toBe("awaiting_payment");
  });

  it("closed quotes can't be cancelled again", () => {
    for (const status of ["completed", "declined", "cancelled"] as const) {
      expect(canApplyAction(status, "cancel")).toBe(false);
    }
  });

  it("hides manual 'paid' while a Stripe link is waiting", () => {
    const withLink = adminActionsFor("awaiting_payment", { deliveryMethod: "pickup", hasPaymentLink: true });
    const without = adminActionsFor("awaiting_payment", { deliveryMethod: "pickup", hasPaymentLink: false });
    expect(withLink).not.toContain("mark_paid");
    expect(without).toContain("mark_paid");
  });

  it("offers Ship for posted orders and Ready for local ones", () => {
    expect(adminActionsFor("in_progress", { deliveryMethod: "shipped", hasPaymentLink: false })).toEqual(
      expect.arrayContaining(["ship"]),
    );
    expect(adminActionsFor("in_progress", { deliveryMethod: "shipped", hasPaymentLink: false })).not.toContain("ready");
    expect(adminActionsFor("in_progress", { deliveryMethod: "pickup", hasPaymentLink: false })).toContain("ready");
    expect(adminActionsFor("in_progress", { deliveryMethod: "pickup", hasPaymentLink: false })).not.toContain("ship");
  });

  it("words 'ready' by delivery method", () => {
    expect(customerStatusLabel("ready", { deliveryMethod: "pickup" })).toBe("Ready for pickup");
    expect(customerStatusLabel("ready", { deliveryMethod: "local_delivery" })).toBe("Out for delivery");
    expect(customerStatusLabel("ready", { deliveryMethod: "shipped" })).toBe("Shipped");
  });

  it("builds tracking links for known carriers only", () => {
    expect(trackingUrl("auspost", "33AB 12")).toBe("https://auspost.com.au/mypost/track/details/33AB%2012");
    expect(trackingUrl("other courier", "X1")).toBeNull();
    expect(trackingUrl("auspost", "")).toBeNull();
  });
});
