import { vi } from "vitest";
import { createQuote, updateQuote, getQuote } from "@/lib/db-quotes";
import { setupMongoMemoryServer, teardownMongoMemoryServer } from "@/lib/mongoMemoryServer";

const createSessionMock = vi.fn();

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(function StripeMock() {
    return {
      checkout: {
        sessions: {
          create: createSessionMock,
        },
      },
    };
  }),
}));

describe("POST /api/quotes/checkout", () => {
  let POST: typeof import("./route").POST;
  const originalMongoUri = process.env.MONGODB_URI;
  const originalDbName = process.env.DB_NAME;
  const originalStripeKey = process.env.STRIPE_SECRET_KEY;

  beforeAll(async () => {
    const { uri } = await setupMongoMemoryServer();
    process.env.MONGODB_URI = uri;
    process.env.DB_NAME = "test";
    // Module reads STRIPE_SECRET_KEY at import time, so it must be set first.
    process.env.STRIPE_SECRET_KEY = "sk_test_123";
    ({ POST } = await import("./route"));
  });

  afterEach(() => {
    createSessionMock.mockReset();
  });

  afterAll(async () => {
    process.env.MONGODB_URI = originalMongoUri;
    process.env.DB_NAME = originalDbName;
    process.env.STRIPE_SECRET_KEY = originalStripeKey;
    await teardownMongoMemoryServer();
  });

  const postRequest = (body: unknown) =>
    POST(
      new Request("http://localhost/api/quotes/checkout", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    );

  async function createTestQuote(overrides: { status?: string; quotedPrice?: number | null } = {}) {
    const record = await createQuote({
      name: "Deej",
      email: "deej@example.com",
      suburb: "Frankston",
      serviceType: "3d_printing",
      params: { material: "PLA", quantity: 2 },
      delivery: { method: "pickup", suburb: "Frankston" },
      notes: "Need two brackets.",
    });

    await updateQuote(record.quoteNumber, {
      status: (overrides.status ?? "quoted") as never,
      quotedPrice: overrides.quotedPrice === undefined ? 18.5 : overrides.quotedPrice,
    });

    return record.quoteNumber;
  }

  test("rejects a request missing quoteNumber", async () => {
    const res = await postRequest({ email: "deej@example.com" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/quoteNumber is required/i);
  });

  test("rejects a request with an invalid email", async () => {
    const res = await postRequest({ quoteNumber: 1001, email: "not-an-email" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/valid email is required/i);
  });

  test("returns 404 when no quote matches the number/email pair", async () => {
    const res = await postRequest({ quoteNumber: 999999, email: "nobody@example.com" });
    expect(res.status).toBe(404);
  });

  test("rejects payment when the quote is not yet priced", async () => {
    const quoteNumber = await createTestQuote({ status: "new", quotedPrice: null });
    const res = await postRequest({ quoteNumber, email: "deej@example.com" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/still being reviewed/i);
  });

  test("rejects payment when a payment is already pending", async () => {
    const quoteNumber = await createTestQuote({ status: "awaiting_payment" });
    const res = await postRequest({ quoteNumber, email: "deej@example.com" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/already has a pending payment/i);
  });

  test("rejects payment below the minimum order value", async () => {
    const quoteNumber = await createTestQuote({ status: "quoted", quotedPrice: 1 });
    const res = await postRequest({ quoteNumber, email: "deej@example.com" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/minimum order value/i);
  });

  test("creates a Stripe checkout session and marks the quote awaiting payment", async () => {
    createSessionMock.mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/test-session",
    });

    const quoteNumber = await createTestQuote({ status: "quoted", quotedPrice: 18.5 });
    const res = await postRequest({ quoteNumber, email: "deej@example.com" });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBe("https://checkout.stripe.com/test-session");
    expect(body.sessionId).toBe("cs_test_123");

    // Success/cancel URLs must point at the portfolio's quote pages, not the
    // removed generic shop routes.
    const sessionArgs = createSessionMock.mock.calls[0][0];
    expect(sessionArgs.success_url).toContain("/projects/services/3d-printing/thank-you");
    expect(sessionArgs.cancel_url).toContain("/projects/services/3d-printing/cancelled");
    expect(sessionArgs.success_url).not.toContain("/shop/");
    expect(sessionArgs.cancel_url).not.toContain("/shop/");

    const updated = await getQuote(quoteNumber);
    expect(updated?.status).toBe("awaiting_payment");
    expect(updated?.payment?.stripeSessionId).toBe("cs_test_123");
  });
});
