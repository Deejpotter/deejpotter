/**
 * db.ts — Shared MongoDB connection helper
 * Caches the client across hot reloads in development.
 */

import { MongoClient, Db, Collection } from "mongodb";

declare global {

  var _mongoClient: MongoClient | undefined;
}

function getUri(): string {
  return process.env.MONGODB_URI || "mongodb://localhost:27017";
}

function getDbName(): string {
  return process.env.DB_NAME || "deejpotter";
}

export async function getClient(): Promise<MongoClient> {
  if (global._mongoClient) {
    return global._mongoClient;
  }

  const client = new MongoClient(getUri());
  global._mongoClient = client;
  await client.connect();
  return client;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(getDbName());
}

export async function getCollection(name: string): Promise<Collection> {
  const db = await getDb();
  return db.collection(name);
}

