import { vi } from 'vitest';

// Mock Clerk auth module before importing the route handlers
vi.mock('@clerk/nextjs', () => ({
  auth: () => ({ userId: null }),
}));

import { GET, POST, PUT, DELETE } from './route';

function makeRequest(url: string, options: any = {}) {
  return new Request(url, options);
}

describe('mongo-crud route validation', () => {
  test('GET returns 400 if collection missing', async () => {
    const res = await GET(makeRequest('http://localhost/api/mongo-crud'));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body).toBe('Invalid or missing collection name');
  });

  test('POST returns 401 when unauthenticated', async () => {
    // auth() is mocked to return { userId: null }
    const res = await POST(makeRequest('http://localhost/api/mongo-crud?collection=test', { method: 'POST' }));
    const body = await res.json();
    expect(res.status).toBe(401);
    expect(body).toBe('Unauthorized');
  });

  test('POST returns 400 for missing body when authenticated', async () => {
    // Re-mock Clerk to be authenticated for this test and re-import the route handlers
    vi.doMock('@clerk/nextjs', () => ({ auth: () => ({ userId: 'user123' }) }));
    const route = await import('./route');

    const res = await route.POST(makeRequest('http://localhost/api/mongo-crud?collection=test', { method: 'POST' }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body).toBe('Invalid or missing body');

    // Reset module mocks for following tests
    vi.resetModules();
    vi.doMock('@clerk/nextjs', () => ({ auth: () => ({ userId: null }) }));
    // Re-import the original module for the remaining tests
    await import('./route');
  });

  test('PUT returns 400 for invalid id', async () => {
    const res = await PUT(makeRequest('http://localhost/api/mongo-crud?collection=test&id=invalid', { method: 'PUT', body: '{}' }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body).toBe('Invalid or missing id');
  });

  test('DELETE returns 400 for invalid id', async () => {
    const res = await DELETE(makeRequest('http://localhost/api/mongo-crud?collection=test&id=invalid', { method: 'DELETE' }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body).toBe('Invalid or missing id');
  });
});
