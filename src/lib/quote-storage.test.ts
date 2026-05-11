import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  getQuoteRequest,
  getQuoteRequestFilePath,
  listQuoteRequests,
  saveQuoteRequest,
  updateQuoteRequest,
} from "./quote-storage";

function makeTestFile(name: string, contents: string, type = "application/octet-stream") {
  return {
    name,
    size: Buffer.byteLength(contents),
    type,
    async arrayBuffer() {
      return Uint8Array.from(Buffer.from(contents)).buffer;
    },
  } as unknown as File;
}

describe("quote-storage", () => {
  const originalDir = process.env.QUOTE_STORAGE_DIR;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "quote-storage-"));
    process.env.QUOTE_STORAGE_DIR = tempDir;
  });

  afterEach(async () => {
    process.env.QUOTE_STORAGE_DIR = originalDir;
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test("saves quote requests and uploaded files", async () => {
    const record = await saveQuoteRequest(
      {
        name: "Deej",
        email: "deej@example.com",
        suburb: "Frankston",
        material: "PLA",
        quantity: 2,
        localFulfilment: "yes",
        needsNextDay: "yes",
        notes: "Need two brackets.",
      },
      makeTestFile("bracket.stl", "solid data", "model/stl")
    );

    expect(record.id).toBeTruthy();
    expect(record.status).toBe("new");

    const savedFile = await fs.readFile(getQuoteRequestFilePath(record), "utf8");
    expect(savedFile).toBe("solid data");

    const records = await listQuoteRequests();
    expect(records).toHaveLength(1);
    expect(records[0].email).toBe("deej@example.com");
  });

  test("updates quote requests", async () => {
    const record = await saveQuoteRequest(
      {
        name: "Deej",
        email: "deej@example.com",
        suburb: "Frankston",
        material: "PLA",
        quantity: 1,
        localFulfilment: "yes",
        needsNextDay: "no",
        notes: "",
      },
      makeTestFile("part.stl", "solid data", "model/stl")
    );

    const updated = await updateQuoteRequest(record.id, {
      status: "quoted",
      quotedPrice: 24.5,
      turnaroundEstimate: "Next business day",
      adminNotes: "Looks straightforward.",
    });

    expect(updated?.status).toBe("quoted");
    expect(updated?.quotedPrice).toBe(24.5);

    const fetched = await getQuoteRequest(record.id);
    expect(fetched?.adminNotes).toBe("Looks straightforward.");
  });
});
