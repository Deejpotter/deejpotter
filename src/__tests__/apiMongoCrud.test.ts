import { GET, POST } from "@/app/api/mongo-crud/route";

describe("mongo-crud route validation", () => {
  test("GET returns 400 for invalid collection", async () => {
    const req = new Request("http://localhost/api?collection=invalid!");
    const res = await GET(req as any);
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body).toMatch(/Invalid or missing collection name/);
  });

  test("POST unauthorized returns 401 for valid collection without auth", async () => {
    const req = new Request("http://localhost/api?collection=test", {
      method: "POST",
      body: JSON.stringify({ name: "x" }),
    });
    const res = await POST(req as any);
    const body = await res.json();
    expect(res.status).toBe(401);
    expect(body).toMatch(/Unauthorized/);
  });
});
