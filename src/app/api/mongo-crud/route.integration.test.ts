/**
 * Integration tests for mongo-crud API route
 * Tests real MongoDB operations using MongoMemoryServer
 */

import { describe, test, expect, beforeAll, afterAll, afterEach, vi } from "vitest";
import { GET, POST, PUT, DELETE } from "./route";
import {
  setupMongoMemoryServer,
  teardownMongoMemoryServer,
  clearMongoData,
  seedTestData,
} from "@/lib/mongoMemoryServer";

vi.mock("@clerk/nextjs", () => ({
  auth: vi.fn(() => ({ userId: "test-user-123" })),
}));

beforeAll(async () => {
  const { uri } = await setupMongoMemoryServer();
  process.env.MONGODB_URI = uri;
  process.env.DB_NAME = "test";
  process.env.ALLOWED_COLLECTIONS = "testCollection,users,posts";
});

afterAll(async () => {
  await teardownMongoMemoryServer();
});

afterEach(async () => {
  await clearMongoData("test");
});

describe("mongo-crud API Route - Integration Tests", () => {
  describe("GET operations", () => {
    test("should retrieve all documents from a collection", async () => {
      await seedTestData("testCollection", [
        { name: "Item 1", value: 100 },
        { name: "Item 2", value: 200 },
        { name: "Item 3", value: 300 },
      ]);

      const url = new URL("http://localhost:3000/api/mongo-crud");
      url.searchParams.set("collection", "testCollection");

      const response = await GET(new Request(url.toString()));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(3);
      expect(data[0].name).toBe("Item 1");
      expect(data[1].value).toBe(200);
    });

    test("should return empty array for non-existent collection", async () => {
      const url = new URL("http://localhost:3000/api/mongo-crud");
      url.searchParams.set("collection", "testCollection");

      const response = await GET(new Request(url.toString()));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });
  });

  describe("POST operations", () => {
    test("should insert a single document", async () => {
      const url = new URL("http://localhost:3000/api/mongo-crud");
      url.searchParams.set("collection", "testCollection");

      const response = await POST(
        new Request(url.toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "New Item", value: 500 }),
        })
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.insertedId).toBeDefined();

      const getUrl = new URL("http://localhost:3000/api/mongo-crud");
      getUrl.searchParams.set("collection", "testCollection");
      const getResponse = await GET(new Request(getUrl.toString()));
      const inserted = await getResponse.json();

      expect(inserted).toHaveLength(1);
      expect(inserted[0].name).toBe("New Item");
    });
  });

  describe("PUT operations", () => {
    test("should update a document", async () => {
      await seedTestData("testCollection", [{ name: "Original Name", value: 100 }]);

      const getUrl = new URL("http://localhost:3000/api/mongo-crud");
      getUrl.searchParams.set("collection", "testCollection");
      const beforeResponse = await GET(new Request(getUrl.toString()));
      const beforeData = await beforeResponse.json();
      const docId = beforeData[0]._id;

      const putUrl = new URL("http://localhost:3000/api/mongo-crud");
      putUrl.searchParams.set("collection", "testCollection");
      putUrl.searchParams.set("id", docId);

      const response = await PUT(
        new Request(putUrl.toString(), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Updated Name", value: 200 }),
        })
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.modifiedCount).toBe(1);

      const verifyResponse = await GET(new Request(getUrl.toString()));
      const verifyData = await verifyResponse.json();
      expect(verifyData[0].name).toBe("Updated Name");
      expect(verifyData[0].value).toBe(200);
    });
  });

  describe("DELETE operations", () => {
    test("should delete a document", async () => {
      await seedTestData("testCollection", [
        { name: "To Delete", value: 100 },
        { name: "To Keep", value: 200 },
      ]);

      const getUrl = new URL("http://localhost:3000/api/mongo-crud");
      getUrl.searchParams.set("collection", "testCollection");
      const beforeResponse = await GET(new Request(getUrl.toString()));
      const beforeData = await beforeResponse.json();
      const toDelete = beforeData.find((item: any) => item.name === "To Delete");

      const deleteUrl = new URL("http://localhost:3000/api/mongo-crud");
      deleteUrl.searchParams.set("collection", "testCollection");
      deleteUrl.searchParams.set("id", toDelete._id);

      const response = await DELETE(
        new Request(deleteUrl.toString(), {
          method: "DELETE",
        })
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.deletedCount).toBe(1);

      const verifyResponse = await GET(new Request(getUrl.toString()));
      const verifyData = await verifyResponse.json();
      expect(verifyData).toHaveLength(1);
      expect(verifyData[0].name).toBe("To Keep");
    });
  });
});
