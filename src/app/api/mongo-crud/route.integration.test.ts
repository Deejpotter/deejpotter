/**
 * Integration tests for mongo-crud API route
 * Tests real MongoDB operations using MongoMemoryServer
 */

import { describe, test, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { GET, POST, PUT, DELETE } from './route';
import { 
  setupMongoMemoryServer, 
  teardownMongoMemoryServer, 
  clearMongoData, 
  seedTestData 
} from '@/lib/mongoMemoryServer';

// Mock Clerk auth - these tests focus on MongoDB operations
// Auth functionality is tested separately in route.test.ts
vi.mock('@clerk/nextjs', () => ({
  auth: vi.fn(() => ({ userId: 'test-user-123' }))
}));

let testMongoUri: string;

beforeAll(async () => {
  // Start MongoDB Memory Server
  const { uri } = await setupMongoMemoryServer();
  testMongoUri = uri;
  
  // Set environment variables for the route to use
  process.env.MONGODB_URI = uri;
  process.env.DB_NAME = 'test';
  process.env.ALLOWED_COLLECTIONS = 'testCollection,users,posts';
});

afterAll(async () => {
  await teardownMongoMemoryServer();
});

afterEach(async () => {
  // Clear all test data between tests for isolation
  await clearMongoData('test');
});

describe('mongo-crud API Route - Integration Tests', () => {
  describe('GET operations', () => {
    test('should retrieve all documents from a collection', async () => {
      // Seed test data
      const testData = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 },
        { name: 'Item 3', value: 300 }
      ];
      await seedTestData('testCollection', testData);

      // Create request
      const url = new URL('http://localhost:3000/api/mongo-crud');
      url.searchParams.set('collection', 'testCollection');
      
      const request = new Request(url.toString());

      // Execute GET request
      const response = await GET(request);
      const data = await response.json();

      // Verify response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(3);
      expect(data.data[0].name).toBe('Item 1');
      expect(data.data[1].value).toBe(200);
    });

    test('should filter documents with query parameter', async () => {
      // Seed test data
      const testData = [
        { name: 'Active Item', status: 'active' },
        { name: 'Inactive Item', status: 'inactive' },
        { name: 'Another Active', status: 'active' }
      ];
      await seedTestData('testCollection', testData);

      // Create request with filter
      const url = new URL('http://localhost:3000/api/mongo-crud');
      url.searchParams.set('collection', 'testCollection');
      url.searchParams.set('filter', JSON.stringify({ status: 'active' }));
      
      const request = new Request(url.toString());

      // Execute GET request
      const response = await GET(request);
      const data = await response.json();

      // Verify filtered results
      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
      expect(data.data.every((item: any) => item.status === 'active')).toBe(true);
    });

    test('should return empty array for non-existent collection', async () => {
      const url = new URL('http://localhost:3000/api/mongo-crud');
      url.searchParams.set('collection', 'testCollection');
      
      const request = new Request(url.toString());
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(0);
    });
  });

  describe('POST operations', () => {
    test('should insert a single document', async () => {
      const newDocument = { name: 'New Item', value: 500 };

      const request = new Request('http://localhost:3000/api/mongo-crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'testCollection',
          document: newDocument
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.insertedId).toBeDefined();

      // Verify the document was actually inserted
      const url = new URL('http://localhost:3000/api/mongo-crud');
      url.searchParams.set('collection', 'testCollection');
      const getRequest = new Request(url.toString());
      const getResponse = await GET(getRequest);
      const getData = await getResponse.json();

      expect(getData.data).toHaveLength(1);
      expect(getData.data[0].name).toBe('New Item');
    });

    test('should insert multiple documents', async () => {
      const newDocuments = [
        { name: 'Batch Item 1', value: 100 },
        { name: 'Batch Item 2', value: 200 }
      ];

      const request = new Request('http://localhost:3000/api/mongo-crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'testCollection',
          documents: newDocuments
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.insertedCount).toBe(2);
    });
  });

  describe('PUT operations', () => {
    test('should update a document', async () => {
      // Seed initial data
      const testData = [{ name: 'Original Name', value: 100 }];
      await seedTestData('testCollection', testData);

      // Get the inserted document's ID
      const url = new URL('http://localhost:3000/api/mongo-crud');
      url.searchParams.set('collection', 'testCollection');
      const getRequest = new Request(url.toString());
      const getResponse = await GET(getRequest);
      const getData = await getResponse.json();
      const docId = getData.data[0]._id;

      // Update the document
      const request = new Request('http://localhost:3000/api/mongo-crud', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'testCollection',
          filter: { _id: docId },
          update: { $set: { name: 'Updated Name', value: 200 } }
        })
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.modifiedCount).toBe(1);

      // Verify the update
      const verifyResponse = await GET(getRequest);
      const verifyData = await verifyResponse.json();
      expect(verifyData.data[0].name).toBe('Updated Name');
      expect(verifyData.data[0].value).toBe(200);
    });
  });

  describe('DELETE operations', () => {
    test('should delete a document', async () => {
      // Seed test data
      const testData = [
        { name: 'To Delete', value: 100 },
        { name: 'To Keep', value: 200 }
      ];
      await seedTestData('testCollection', testData);

      // Delete one document
      const request = new Request('http://localhost:3000/api/mongo-crud', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'testCollection',
          filter: { name: 'To Delete' }
        })
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.deletedCount).toBe(1);

      // Verify deletion
      const url = new URL('http://localhost:3000/api/mongo-crud');
      url.searchParams.set('collection', 'testCollection');
      const getRequest = new Request(url.toString());
      const getResponse = await GET(getRequest);
      const getData = await getResponse.json();

      expect(getData.data).toHaveLength(1);
      expect(getData.data[0].name).toBe('To Keep');
    });
  });
});
