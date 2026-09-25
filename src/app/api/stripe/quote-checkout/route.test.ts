import { vi } from "vitest";

const { authMock, currentUserMock, getQuoteMock, updateQuoteMock, createSessionMock } =
  vi.hoisted(() => ({
    authMock: vi.fn(),
    currentUserMock: vi.fn(),
    getQuoteMock: vi.fn(),
    updateQuoteMock: vi.fn(),
    createSessionMock: vi.fn(),
  }));

vi.mock("@clerk/nextjs/server", () => ({
  auth: authMock,
  currentUser: currentUserMock,
}));

vi.mock("@/lib/db-quotes", () => ({
  getQuote: getQuoteMock,
  updateQuote: updateQuoteMock,
}));

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(function StripeMock() {
    return { checkout: { sessions: { create: createSessionMock } } };
  }),
}));

import { POST } from "./route";

function request(quoteNumber: number) {
  return new Request("http://localhost/api/stripe/quote-checkout", {
    method: "POST",
    body: JSON.stringify({ quoteNumber }),
  }) as never;
}

const baseQuote = {
  quoteNumber: 7,
  status: "quoted",
  quotedPrice: 50,
  serviceType: "3d_printing",
  fileName: "part.stl",
  userEmail: "owner@example.com",
};

describe("POST /api/stripe/quote-checkout", () => {
  const originalStripeKey = process.env.STRIPE_SECRET_KEY;

  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_123";
    authMock.mockResolvedValue({ userId: "user_owner" });
    createSessionMock.mockResolvedValue({ id: "cs_1", url: "https://stripe.test/cs_1" });
  });

  afterEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = originalStripeKey;
  });

  test("returns 404 when the quote belongs to another user", async () => {
    getQuoteMock.mockResolvedValue({ ...baseQuote, userId: "user_someone_else" });

    const res = await POST(request(7));

    expect(res.status).toBe(404);
    expect(createSessionMock).not.toHaveBeenCalled();
  });

  test("returns 404 for a guest quote whose email the user hasn't verified", async () => {
    getQuoteMock.mockResolvedValue({ ...baseQuote, userId: null });
    currentUserMock.mockResolvedValue({
      emailAddresses: [
        { emailAddress: "owner@example.com", verification: { status: "unverified" } },
      ],
    });

    const res = await POST(request(7));

    expect(res.status).toBe(404);
    expect(createSessionMock).not.toHaveBeenCalled();
  });

  test("creates a session when the signed-in user owns the quote", async () => {
    getQuoteMock.mockResolvedValue({ ...baseQuote, userId: "user_owner" });

    const res = await POST(request(7));

    expect(res.status).toBe(200);
    expect(createSessionMock).toHaveBeenCalledTimes(1);
  });

  test("creates a session for a guest quote sent from the user's verified email", async () => {
    getQuoteMock.mockResolvedValue({ ...baseQuote, userId: null });
    currentUserMock.mockResolvedValue({
      emailAddresses: [
        { emailAddress: "Owner@Example.com", verification: { status: "verified" } },
      ],
    });

    const res = await POST(request(7));

    expect(res.status).toBe(200);
    expect(createSessionMock).toHaveBeenCalledTimes(1);
  });
});
