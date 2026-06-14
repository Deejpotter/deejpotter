import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { POST } from './route';
import { setupMongoMemoryServer, teardownMongoMemoryServer } from '@/lib/mongoMemoryServer';

function makeFormRequest(formData: FormData) {
  return new Request('http://localhost/api/3d-printing-quote', {
    method: 'POST',
    body: formData,
  });
}

describe('3d-printing-quote route', () => {
  const originalDir = process.env.QUOTE_STORAGE_DIR;
  const originalMongoUri = process.env.MONGODB_URI;
  const originalDbName = process.env.DB_NAME;
  let tempDir: string;

  beforeAll(async () => {
    const { uri } = await setupMongoMemoryServer();
    process.env.MONGODB_URI = uri;
    process.env.DB_NAME = 'test';
  });

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quote-route-'));
    process.env.QUOTE_STORAGE_DIR = tempDir;
  });

  afterEach(async () => {
    process.env.QUOTE_STORAGE_DIR = originalDir;
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  afterAll(async () => {
    process.env.MONGODB_URI = originalMongoUri;
    process.env.DB_NAME = originalDbName;
    await teardownMongoMemoryServer();
  });

  test('accepts a valid quote request', async () => {
    const formData = new FormData();
    formData.set('name', 'Deej');
    formData.set('email', 'deej@example.com');
    formData.set('suburb', 'Frankston');
    formData.set('material', 'PLA');
    formData.set('quantity', '2');
    formData.set('localFulfilment', 'yes');
    formData.set('needsNextDay', 'yes');
    formData.set('notes', 'Need two brackets.');
    formData.append('modelFile', new File(['solid data'], 'bracket.stl', { type: 'model/stl' }), 'bracket.stl');

    const response = await POST(makeFormRequest(formData));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.requestId).toBeTruthy();
  });

  test('rejects missing file uploads', async () => {
    const formData = new FormData();
    formData.set('name', 'Deej');
    formData.set('email', 'deej@example.com');
    formData.set('suburb', 'Frankston');
    formData.set('material', 'PLA');
    formData.set('quantity', '1');
    formData.set('localFulfilment', 'yes');
    formData.set('needsNextDay', 'no');

    const response = await POST(makeFormRequest(formData));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toMatch(/attach a model file/i);
  });

  test('rejects unsupported file types', async () => {
    const formData = new FormData();
    formData.set('name', 'Deej');
    formData.set('email', 'deej@example.com');
    formData.set('suburb', 'Frankston');
    formData.set('material', 'PLA');
    formData.set('quantity', '1');
    formData.set('localFulfilment', 'yes');
    formData.set('needsNextDay', 'no');
    formData.append('modelFile', new File(['hello'], 'notes.txt', { type: 'text/plain' }), 'notes.txt');

    const response = await POST(makeFormRequest(formData));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toMatch(/unsupported file type/i);
  });
});
