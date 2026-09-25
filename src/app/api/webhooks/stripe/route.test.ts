import { createQuote, updateQuote, getQuote } from "@/lib/db-quotes";
import { setupMongoMemoryServer, teardownMongoMemoryServer } from "@/lib/mongoMemoryServer";

describe("POST /api/webhooks/stripe", () => {
  let POST: typeof import("./route").POST;
  const originalMongoUri = process.env.MONGODB_URI;
  const originalDbName = process.env.DB_NAME;
  const originalStripeKey = process.env.STRIPE_SECRET_KEY;
  const originalWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  beforeAll(async () => {
    const { uri } = await setupMongoMemoryServer();
    process.env.MONGODB_URI = uri;
    process.env.DB_NAME = "test";
    // Module reads these at import time. Leaving STRIPE_WEBHOOK_SECRET unset
    // exercises the dev-mode path (plain JSON.parse, no signature check),
    // which is fine since BASE_URL stays at the localhost default here.
    process.env.STRIPE_SECRET_KEY = "sk_test_123";
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.NEXT_PUBLIC_BASE_URL;
    ({ POST } = await import("./route"));
  });

  afterAll(async () => {
    process.env.MONGODB_URI = originalMongoUri;
    process.env.DB_NAME = originalDbName;
    process.env.STRIPE_SECRET_KEY = originalStripeKey;
    process.env.STRIPE_WEBHOOK_SECRET = originalWebhookSecret;
    process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
    await teardownMongoMemoryServer();
  });

  const postEvent = (event: unknown) =>
    POST(
      new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify(event),
      }),
    );

  async function createAwaitingPaymentQuote() {
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
      status: "awaiting_payment" as never,
      quotedPrice: 18.5,
    });
    return record.quoteNumber;
  }

  test("marks a quote approved and paid on checkout.session.completed", async () => {
    const quoteNumber = await createAwaitingPaymentQuote();

    const res = await postEvent({
      id: `evt_${quoteNumber}_completed`,
      type: "checkout.session.completed",
      data: { object: { metadata: { quoteNumber: String(quoteNumber) } } },
    });

    expect(res.status).toBe(200);
    const updated = await getQuote(quoteNumber);
    expect(updated?.status).toBe("approved");
    expect(updated?.payment?.paidAt).toBeTruthy();
  });

  test("reverts a quote to quoted on checkout.session.expired", async () => {
    const quoteNumber = await createAwaitingPaymentQuote();

    const res = await postEvent({
      id: `evt_${quoteNumber}_expired`,
      type: "checkout.session.expired",
      data: { object: { metadata: { quoteNumber: String(quoteNumber) } } },
    });

    expect(res.status).toBe(200);
    const updated = await getQuote(quoteNumber);
    expect(updated?.status).toBe("quoted");
    expect(updated?.payment?.stripeSessionId).toBeNull();
  });

  test("does not reprocess a duplicate event id", async () => {
    const quoteNumber = await createAwaitingPaymentQuote();
    const event = {
      id: `evt_${quoteNumber}_dup`,
      type: "checkout.session.completed",
      data: { object: { metadata: { quoteNumber: String(quoteNumber) } } },
    };

    const first = await postEvent(event);
    expect(first.status).toBe(200);
    expect((await first.json()).deduplicated).toBeUndefined();

    // Flip the quote back so we can prove the second delivery is a no-op.
    await updateQuote(quoteNumber, { status: "quoted" as never });

    const second = await postEvent(event);
    const secondBody = await second.json();
    expect(secondBody.deduplicated).toBe(true);

    const updated = await getQuote(quoteNumber);
    expect(updated?.status).toBe("quoted");
  });

  test("ignores events with no quoteNumber metadata", async () => {
    const res = await postEvent({
      id: "evt_no_metadata",
      type: "checkout.session.completed",
      data: { object: { metadata: {} } },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
  });
});
