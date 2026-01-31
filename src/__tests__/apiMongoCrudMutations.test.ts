// Test POST flow with mocked MongoDB and Clerk auth
vi.mock("mongodb", () => {
  class MockCollection {
    async insertOne(doc: any) {
      return { acknowledged: true, insertedId: "fakeid" };
    }
    async updateOne(query: any, update: any) {
      return { acknowledged: true, modifiedCount: 1 };
    }
    async deleteOne(query: any) {
      return { acknowledged: true, deletedCount: 1 };
    }
    async find() {
      return { toArray: async () => [] };
    }
  }
  class MockDb {
    collection(_name: string) {
      return new MockCollection();
    }
  }
  class MockClient {
    isConnected() {
      return true;
    }
    async connect() {
      return;
    }
    db(_name?: string) {
      return new MockDb();
    }
  }

  // Provide a minimal ObjectId compatible stand-in so route's validation won't throw
  class MockObjectId {
    constructor(id: string) {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) throw new Error("invalid id");
    }
  }

  return { MongoClient: MockClient, ObjectId: MockObjectId };
});

vi.mock("@clerk/nextjs", () => ({ auth: () => ({ userId: "test-user" }) }));

import { POST } from "@/app/api/mongo-crud/route";

describe("mongo-crud mutating operations (mocked)", () => {
  test("POST with auth inserts document successfully", async () => {
    const body = { name: "test" };
    const req = new Request("http://localhost/api?collection=test", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveProperty("acknowledged", true);
  });

  test("PUT with auth updates document successfully", async () => {
    // Import PUT dynamically after mocks
    const { PUT } = await import("@/app/api/mongo-crud/route");

    const req = new Request(
      "http://localhost/api?collection=test&id=507f1f77bcf86cd799439011",
      {
        method: "PUT",
        body: JSON.stringify({ name: "updated" }),
        headers: { "content-type": "application/json" },
      }
    );

    const res = await PUT(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveProperty("acknowledged", true);
  });

  test("DELETE with auth deletes document successfully", async () => {
    const { DELETE } = await import("@/app/api/mongo-crud/route");
    const req = new Request(
      "http://localhost/api?collection=test&id=507f1f77bcf86cd799439011",
      { method: "DELETE", headers: { "content-type": "application/json" } }
    );
    const res = await DELETE(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveProperty("acknowledged", true);
  });
});
