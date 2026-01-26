import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterAll, afterEach } from 'vitest';

let mongoServer: MongoMemoryServer;
let mongoClient: MongoClient;

/**
 * Test utilities for MongoDB integration tests
 * Uses MongoMemoryServer to create an in-memory MongoDB instance for testing
 */

/**
 * Start MongoDB Memory Server and create client connection
 * Call this in beforeAll() in your integration tests
 */
export async function setupMongoMemoryServer() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  mongoClient = new MongoClient(uri);
  await mongoClient.connect();
  
  return { uri, client: mongoClient };
}

/**
 * Stop MongoDB Memory Server and close client connection
 * Call this in afterAll() in your integration tests
 */
export async function teardownMongoMemoryServer() {
  if (mongoClient) {
    await mongoClient.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}

/**
 * Clear all data from test database
 * Call this in afterEach() to ensure test isolation
 */
export async function clearMongoData(dbName: string = 'test') {
  if (!mongoClient) {
    throw new Error('MongoDB client not initialized. Call setupMongoMemoryServer first.');
  }
  
  const db = mongoClient.db(dbName);
  const collections = await db.listCollections().toArray();
  
  await Promise.all(
    collections.map(collection => 
      db.collection(collection.name).deleteMany({})
    )
  );
}

/**
 * Get test database instance
 */
export function getTestDb(dbName: string = 'test') {
  if (!mongoClient) {
    throw new Error('MongoDB client not initialized. Call setupMongoMemoryServer first.');
  }
  return mongoClient.db(dbName);
}

/**
 * Helper to create a test collection with sample data
 */
export async function seedTestData(collectionName: string, data: any[], dbName: string = 'test') {
  const db = getTestDb(dbName);
  const collection = db.collection(collectionName);
  
  if (data.length > 0) {
    await collection.insertMany(data);
  }
  
  return collection;
}
