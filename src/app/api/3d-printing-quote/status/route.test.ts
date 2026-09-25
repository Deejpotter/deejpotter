import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { GET } from './route';
import { createQuote, updateQuote } from '@/lib/db-quotes';
import { setupMongoMemoryServer, teardownMongoMemoryServer } from '@/lib/mongoMemoryServer';

describe('3d-printing-quote status route', () => {
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
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quote-status-'));
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

  test('returns limited customer-safe quote status', async () => {
    const record = await createQuote({
      name: 'Deej',
      email: 'deej@example.com',
      suburb: 'Frankston',
      serviceType: '3d_printing',
      params: { material: 'PLA', quantity: 2 },
      delivery: { method: 'pickup', suburb: 'Frankston' },
      notes: 'Need two brackets.',
    });

    await updateQuote(record.quoteNumber, {
      status: 'quoted',
      quotedPrice: 18.5,
      turnaroundEstimate: 'Next business day',
      adminNotes: 'internal only',
    });

    const response = await GET(
      new Request(
        `http://localhost/api/3d-printing-quote/status?requestId=${record.quoteNumber}&email=${encodeURIComponent('deej@example.com')}`
      )
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.requestId).toBe(String(record.quoteNumber));
    expect(body.status).toBe('quoted');
    expect(body.quotedPrice).toBe(18.5);
    expect(body.turnaroundEstimate).toBe('Next business day');
    expect(body.adminNotes).toBeUndefined();
    expect(body.email).toBeUndefined();
  });
});
