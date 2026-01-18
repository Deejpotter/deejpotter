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

  test('POST returns 400 for missing body', async () => {
    const res = await POST(makeRequest('http://localhost/api/mongo-crud?collection=test', { method: 'POST' }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body).toBe('Invalid or missing body');
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
