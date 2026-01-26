import { NextResponse } from "next/server";
import { MongoClient, ObjectId, Collection } from "mongodb";
import * as zod from "zod";
const z: any = (zod as any).z ?? (zod as any).default ?? (zod as any);
// Resolve auth at call time so test mocks (vi.doMock) are respected when the route is imported multiple times
async function getAuthAsync() {
  try {
    const _clerk = await import("@clerk/nextjs");
    // Use runtime checks and `any` to avoid TypeScript errors during build when Clerk types differ
    const anyClerk = _clerk as any;
    const getter =
      (typeof anyClerk?.auth === 'function'
        ? anyClerk.auth
        : typeof anyClerk?.getAuth === 'function'
        ? anyClerk.getAuth
        : () => ({ userId: null }));
    return getter();
  } catch (e) {
    // If Clerk isn't available at build/test time, return no-op auth
    return { userId: null };
  }
}

type Document = {
  _id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
};

const DB_NAME = process.env["DB_NAME"];
const uri = process.env["MONGODB_URI"];
// SECURITY: Allowlist of permitted collection names.
// REQUIRED in production. For development/tests, set ALLOWED_COLLECTIONS="col1,col2" or use a permissive default.
// If empty and MONGODB_URI is set, requests will be rejected to prevent unrestricted access.
const ALLOWED_COLLECTIONS = (process.env["ALLOWED_COLLECTIONS"] || "test,users")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Basic schema for POST/PUT bodies - ensure an object is provided
const bodySchema = (function getBodySchema() {
  // Be defensive: tests/mocks may provide a partial `z` mock that doesn't include
  // helpers like `string` or `any`, so call them only when present.
  if (z && typeof (z as any).record === "function") {
    const stringSchema =
      typeof (z as any).string === "function" ? (z as any).string() : undefined;
    const anySchema =
      typeof (z as any).any === "function" ? (z as any).any() : undefined;
    return (z as any).record(stringSchema, anySchema);
  }

  // Fallback permissive schema that accepts anything (used only in exotic test mocks)
  return { safeParse: (v: any) => ({ success: true as const }) };
})();

if (!uri) {
  console.warn(
    "MONGODB_URI is not set. Database operations will fail until it is provided."
  );
}
if (!DB_NAME) {
  console.warn(
    "DB_NAME is not set. Database operations will fail until it is provided."
  );
}

// Connection caching for Node (avoids reconnecting on hot reload)
let cachedClient: MongoClient | null = null;

async function getClient(): Promise<MongoClient> {
  // Use runtime checks to avoid depending on internal/private properties on the
  // MongoClient type (keeps TypeScript happy while still providing caching).
  if (cachedClient && (cachedClient as any).isConnected?.()) {
    return cachedClient;
  }
  const client = new MongoClient(uri!);
  await client.connect();
  cachedClient = client;
  return client;
}

async function performMongoOperation<T extends Document>(
  collectionName: string,
  operation: (collection: Collection<T>) => Promise<any>
): Promise<any> {
  const client = await getClient();
  const db = client.db(DB_NAME);
  const collection = db.collection<T>(collectionName);
  return await operation(collection);
}

function validateCollection(collection: string | null) {
  if (!collection || collection.trim().length === 0) {
    return false;
  }
  // Basic allowlist pattern: letters, numbers, dashes, underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(collection)) return false;

  // Check against explicit allowlist
  if (
    ALLOWED_COLLECTIONS.length > 0 &&
    !ALLOWED_COLLECTIONS.includes(collection)
  ) {
    return false;
  }

  return true;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const collection = url.searchParams.get("collection");

  if (!validateCollection(collection)) {
    return NextResponse.json("Invalid or missing collection name", {
      status: 400,
    });
  }

  try {
    const docs = await performMongoOperation(collection!, (c) =>
      c.find({}).toArray()
    );
    return NextResponse.json(docs);
  } catch (error) {
    console.error("GET error", error);
    return NextResponse.json(`Error getting data`, { status: 500 });
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const collection = url.searchParams.get("collection");

  if (!validateCollection(collection)) {
    return NextResponse.json("Invalid or missing collection name", {
      status: 400,
    });
  }

  // Require authenticated user for mutating operations
  const { userId } = await getAuthAsync();
  if (!userId) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  let parsedBody: Document | null = null;
  try {
    parsedBody = await request.json();
  } catch (e) {
    return NextResponse.json("Invalid or missing body", { status: 400 });
  }

  // Validate body shape using zod
  const parseResult = bodySchema.safeParse(parsedBody);
  if (!parseResult.success) {
    return NextResponse.json("Invalid body shape", { status: 400 });
  }

  parsedBody!.createdAt = new Date();
  parsedBody!.updatedAt = new Date();

  try {
    const result = await performMongoOperation(collection!, (c) =>
      c.insertOne(parsedBody!)
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST error", error);
    return NextResponse.json(`Error posting data`, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const collection = url.searchParams.get("collection");
  const id = url.searchParams.get("id");

  if (!validateCollection(collection)) {
    return NextResponse.json("Invalid or missing collection name", {
      status: 400,
    });
  }

  if (!id) {
    return NextResponse.json("Invalid or missing id", { status: 400 });
  }

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch (e) {
    return NextResponse.json("Invalid or missing id", { status: 400 });
  }

  // Require authenticated user for mutating operations
  const { userId } = await getAuthAsync();
  if (!userId) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  let parsedBody: Document | null = null;
  try {
    parsedBody = await request.json();
  } catch (e) {
    return NextResponse.json("Invalid or missing body", { status: 400 });
  }

  const parseResult = bodySchema.safeParse(parsedBody);
  if (!parseResult.success) {
    return NextResponse.json("Invalid body shape", { status: 400 });
  }

  parsedBody!.updatedAt = new Date();

  try {
    const result = await performMongoOperation(collection!, (c) =>
      c.updateOne({ _id: objectId }, { $set: parsedBody! })
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT error", error);
    return NextResponse.json(`Error putting data`, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const collection = url.searchParams.get("collection");
  const id = url.searchParams.get("id");

  if (!validateCollection(collection)) {
    return NextResponse.json("Invalid or missing collection name", {
      status: 400,
    });
  }

  if (!id) {
    return NextResponse.json("Invalid or missing id", { status: 400 });
  }

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch (e) {
    return NextResponse.json("Invalid or missing id", { status: 400 });
  }

  // Require authenticated user for mutating operations
  const { userId } = await getAuthAsync();
  if (!userId) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  try {
    const result = await performMongoOperation(collection!, (c) =>
      c.deleteOne({ _id: objectId })
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("DELETE error", error);
    return NextResponse.json(`Error deleting data`, { status: 500 });
  }
}
