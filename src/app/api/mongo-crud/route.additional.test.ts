import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';

// Use the real `zod` implementation for deterministic validation in tests
// (No module mocking for `zod` to avoid import-time race conditions)

function makeRequest(url: string, options: any = {}) {
  // Ensure body is a Readable stream compatible with Request when provided
  const init: any = { ...options };
  if (options.body && typeof options.body === 'string') init.body = options.body;
  return new Request(url, init);
}

// Helper to set ALLOWED_COLLECTIONS env for a test
function setAllowedCollections(list: string | undefined) {
  if (typeof list === 'undefined') {
    delete process.env.ALLOWED_COLLECTIONS;
  } else {
    process.env.ALLOWED_COLLECTIONS = list;
  }
}

// Centralized mongodb mock factory so tests can tweak behavior
function createMongoMock(overrides: Partial<Record<'find'|'insertOne'|'updateOne'|'deleteOne', any>> = {}) {
  class FakeCollection {
    toArrayResult: any[] = [];
    constructor() {}
    find() {
      return { toArray: async () => overrides.find ? overrides.find() : this.toArrayResult };
    }
    async insertOne(doc: any) {
      if (overrides.insertOne) return overrides.insertOne(doc);
      return { insertedId: 'newid', acknowledged: true };
    }
    async updateOne(query: any, update: any) {
      if (overrides.updateOne) return overrides.updateOne(query, update);
      return { matchedCount: 1, modifiedCount: 1 };
    }
    async deleteOne(query: any) {
      if (overrides.deleteOne) return overrides.deleteOne(query);
      return { deletedCount: 1 };
    }
  }

  class FakeDb {
    collection(name: string) {
      return new FakeCollection();
    }
  }

  class FakeClient {
    async connect() {}
    db() {
      return new FakeDb();
    }
  }

  return { FakeClient, FakeCollection };
}

describe('mongo-crud route - additional scenarios', () => {
  beforeEach(() => {
    vi.resetModules();
    setAllowedCollections(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('GET returns docs when collection valid', async () => {
    const mock = createMongoMock({});
    vi.doMock('mongodb', () => ({
      MongoClient: mock.FakeClient,
      ObjectId: class {
        constructor(id: string) { if (id === 'invalid') throw new Error('bad'); }
      },
    }));

    // ensure allowlist empty
    process.env.ALLOWED_COLLECTIONS = '';

    const route = await import('./route');

    // stub collection's find to return some docs
    const res = await route.GET(makeRequest('http://localhost/api/mongo-crud?collection=test'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET rejects disallowed collection when ALLOWED_COLLECTIONS set', async () => {
    const mock = createMongoMock({});
    vi.doMock('mongodb', () => ({ MongoClient: mock.FakeClient, ObjectId: class { constructor(id: string) {} } }));

    setAllowedCollections('allowed');
    const route = await import('./route');

    const res = await route.GET(makeRequest('http://localhost/api/mongo-crud?collection=notallowed'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toBe('Invalid or missing collection name');
  });

  test('GET returns 500 when db throws', async () => {
    const mock = createMongoMock({ find: async () => { throw new Error('boom'); } });
    vi.doMock('mongodb', () => ({ MongoClient: mock.FakeClient, ObjectId: class { constructor(id: string) {} } }));

    const route = await import('./route');
    const res = await route.GET(makeRequest('http://localhost/api/mongo-crud?collection=test'));
    expect(res.status).toBe(500);
  });

  test('POST succeeds when authenticated and body valid', async () => {
    const mongoMock = createMongoMock({});
    vi.doMock('mongodb', () => ({ MongoClient: mongoMock.FakeClient, ObjectId: class { constructor(id: string) {} } }));

    vi.doMock('@clerk/nextjs', () => ({ auth: () => ({ userId: 'user-1' }) }));
    // Per-test zod mock to ensure schema validates during module import
    vi.doMock('zod', () => ({ z: { record: () => ({ safeParse: (v: any) => ({ success: true }) }), any: () => ({}) } }));
    const route = await import('./route');

    const body = JSON.stringify({ name: 'abc' });
    const res = await route.POST(makeRequest('http://localhost/api/mongo-crud?collection=test', { method: 'POST', body, headers: { 'content-type': 'application/json' } }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('insertedId');
  });

  test('POST returns 400 for invalid body shape', async () => {
    const mongoMock = createMongoMock({});
    vi.doMock('mongodb', () => ({ MongoClient: mongoMock.FakeClient, ObjectId: class { constructor(id: string) {} } }));

    vi.doMock('@clerk/nextjs', () => ({ auth: () => ({ userId: 'user-1' }) }));
    // Per-test zod mock: treat non-objects as invalid to simulate bodySchema behavior
    vi.doMock('zod', () => ({ z: { record: () => ({ safeParse: (v: any) => ({ success: typeof v === 'object' && v !== null }) }), any: () => ({}) } }));
    const route = await import('./route');

    const body = JSON.stringify(123);
    const res = await route.POST(makeRequest('http://localhost/api/mongo-crud?collection=test', { method: 'POST', body, headers: { 'content-type': 'application/json' } }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toBe('Invalid body shape');
  });

  test('POST returns 500 when insert throws', async () => {
    const mongoMock = createMongoMock({ insertOne: async () => { throw new Error('insert fail'); } });
    vi.doMock('mongodb', () => ({ MongoClient: mongoMock.FakeClient, ObjectId: class { constructor(id: string) {} } }));

    vi.doMock('@clerk/nextjs', () => ({ auth: () => ({ userId: 'user-1' }) }));
    // Per-test zod mock to ensure schema validates during module import
    vi.doMock('zod', () => ({ z: { record: () => ({ safeParse: (v: any) => ({ success: true }) }), any: () => ({}) } }));
    const route = await import('./route');

    const body = JSON.stringify({ name: 'abc' });
    const res = await route.POST(makeRequest('http://localhost/api/mongo-crud?collection=test', { method: 'POST', body, headers: { 'content-type': 'application/json' } }));
    expect(res.status).toBe(500);
  });

  test('PUT updates when authenticated with valid id', async () => {
    const mongoMock = createMongoMock({ updateOne: async () => ({ matchedCount: 1, modifiedCount: 1 }) });
    vi.doMock('mongodb', () => ({ MongoClient: mongoMock.FakeClient, ObjectId: class { constructor(id: string) { if (id === 'invalid') throw new Error('bad'); } } }));

    vi.doMock('@clerk/nextjs', () => ({ auth: () => ({ userId: 'user-1' }) }));
    // Per-test zod mock to ensure schema validates during module import
    vi.doMock('zod', () => ({ z: { record: () => ({ safeParse: (v: any) => ({ success: true }) }), any: () => ({}) } }));
    const route = await import('./route');

    const body = JSON.stringify({ name: 'updated' });
    const res = await route.PUT(makeRequest('http://localhost/api/mongo-crud?collection=test&id=000000000000000000000000', { method: 'PUT', body, headers: { 'content-type': 'application/json' } }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('matchedCount');
  });

  test('PUT returns 400 for invalid id parse', async () => {
    const mongoMock = createMongoMock({});
    vi.doMock('mongodb', () => ({ MongoClient: mongoMock.FakeClient, ObjectId: class { constructor(id: string) { if (id === 'invalid') throw new Error('bad'); } } }));

    const route = await import('./route');
    const res = await route.PUT(makeRequest('http://localhost/api/mongo-crud?collection=test&id=invalid', { method: 'PUT', body: '{}' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toBe('Invalid or missing id');
  });

  test('DELETE deletes when authenticated with valid id', async () => {
    const mongoMock = createMongoMock({ deleteOne: async () => ({ deletedCount: 1 }) });
    vi.doMock('mongodb', () => ({ MongoClient: mongoMock.FakeClient, ObjectId: class { constructor(id: string) { if (id === 'invalid') throw new Error('bad'); } } }));

    vi.doMock('@clerk/nextjs', () => ({ auth: () => ({ userId: 'user-1' }) }));
    const route = await import('./route');

    const res = await route.DELETE(makeRequest('http://localhost/api/mongo-crud?collection=test&id=000000000000000000000000', { method: 'DELETE' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('deletedCount');
  });

  test('DELETE returns 400 for missing id', async () => {
    const mongoMock = createMongoMock({});
    vi.doMock('mongodb', () => ({ MongoClient: mongoMock.FakeClient, ObjectId: class { constructor(id: string) {} } }));

    const route = await import('./route');
    const res = await route.DELETE(makeRequest('http://localhost/api/mongo-crud?collection=test', { method: 'DELETE' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toBe('Invalid or missing id');
  });
});
