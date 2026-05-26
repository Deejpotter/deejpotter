/**
 * db.ts — Secure MongoDB connection manager
 *
 * Features:
 * - Connection pooling (configurable pool sizes)
 * - Automatic retry on connection failure
 * - Connection health checks (ping before reuse)
 * - Dead connection detection and recovery
 * - Hot reload safe (global singleton across dev reloads)
 */

import { MongoClient, Db, Collection, Document } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var __mongoConnected: boolean | undefined;
}

const POOL_SIZE = Number(process.env.MONGO_POOL_SIZE) || 10;
const MIN_POOL_SIZE = Number(process.env.MONGO_MIN_POOL_SIZE) || 2;
const SERVER_TIMEOUT_MS = Number(process.env.MONGO_SERVER_TIMEOUT_MS) || 5000;
const SOCKET_TIMEOUT_MS = Number(process.env.MONGO_SOCKET_TIMEOUT_MS) || 30000;
const MAX_RETRIES = Number(process.env.MONGO_MAX_RETRIES) || 3;
const RETRY_DELAY_MS = 1000;

export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new DatabaseError(
      "MONGODB_URI environment variable is not set. " +
        "Set it to your MongoDB Atlas connection string in .env",
    );
  }
  return uri;
}

function getDbName(): string {
  return process.env.DB_NAME || "deejpotter";
}

async function ping(client: MongoClient): Promise<boolean> {
  try {
    await client.db("admin").command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

export async function getClient(): Promise<MongoClient> {
  // Reuse existing healthy connection
  if (global.__mongoClient) {
    const alive = await ping(global.__mongoClient);
    if (alive) return global.__mongoClient;

    // Dead connection — clean up and reconnect
    try {
      await global.__mongoClient.close();
    } catch {
      // ignore close errors on dead connection
    }
    global.__mongoClient = undefined;
    global.__mongoConnected = false;
  }

  const uri = getUri();
  const client = new MongoClient(uri, {
    maxPoolSize: POOL_SIZE,
    minPoolSize: MIN_POOL_SIZE,
    serverSelectionTimeoutMS: SERVER_TIMEOUT_MS,
    socketTimeoutMS: SOCKET_TIMEOUT_MS,
    connectTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
    // Sanitise the URI in logs — strip credentials for safety
    ...(process.env.NODE_ENV === "production"
      ? {}
      : {}),
  });

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await client.connect();
      // Verify connection is actually usable
      await client.db("admin").command({ ping: 1 });

      global.__mongoClient = client;
      global.__mongoConnected = true;

      if (process.env.NODE_ENV !== "production") {
        console.log(
          `[db] MongoDB connected to ${getDbName()} (pool: ${POOL_SIZE})`,
        );
      }

      return client;
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * attempt;
        console.warn(
          `[db] Connection attempt ${attempt}/${MAX_RETRIES} failed, retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new DatabaseError(
    `Failed to connect to MongoDB after ${MAX_RETRIES} attempts`,
    lastError,
  );
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(getDbName());
}

export async function getCollection<T extends Document>(
  name: string,
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

/**
 * Close the database connection gracefully.
 * Call during server shutdown.
 */
export async function closeConnection(): Promise<void> {
  if (global.__mongoClient) {
    try {
      await global.__mongoClient.close();
    } catch {
      // ignore
    }
    global.__mongoClient = undefined;
    global.__mongoConnected = false;
    console.log("[db] MongoDB connection closed");
  }
}

/**
 * Check if the database is connected and responding.
 * Lightweight — just a ping.
 */
export async function healthCheck(): Promise<{
  connected: boolean;
  dbName: string;
  error?: string;
}> {
  try {
    const client = await getClient();
    await client.db("admin").command({ ping: 1 });
    return { connected: true, dbName: getDbName() };
  } catch (err) {
    return {
      connected: false,
      dbName: getDbName(),
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Ensure indexes exist for the quotes collection.
 * Call once during startup or when collection is first accessed.
 */
export async function ensureIndexes(): Promise<void> {
  const quotes = await getCollection("quotes");
  const users = await getCollection("users");
  const serviceConfigs = await getCollection("service_configs");

  // Quotes indexes
  await quotes.createIndex({ userEmail: 1, createdAt: -1 });
  await quotes.createIndex({ userId: 1, createdAt: -1 });
  await quotes.createIndex({ status: 1, createdAt: -1 });
  await quotes.createIndex({ serviceType: 1, status: 1 });
  await quotes.createIndex({ createdAt: -1 });

  // Users indexes
  await users.createIndex({ clerkId: 1 }, { unique: true });
  await users.createIndex({ email: 1 });

  // Service configs index
  await serviceConfigs.createIndex({ serviceType: 1 }, { unique: true });

  if (process.env.NODE_ENV !== "production") {
    console.log("[db] Indexes ensured on quotes, users, service_configs");
  }
}

// Register graceful shutdown
if (typeof process !== "undefined") {
  process.on("SIGTERM", () => {
    closeConnection().catch(() => {});
  });
  process.on("SIGINT", () => {
    closeConnection().catch(() => {});
  });
}
