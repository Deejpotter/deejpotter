import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { GET } from './route';
import { saveQuoteRequest, updateQuoteRequest } from '@/lib/quote-storage';

function makeTestFile(name: string, contents: string, type = 'application/octet-stream') {
  return {
    name,
    size: Buffer.byteLength(contents),
    type,
    async arrayBuffer() {
      return Uint8Array.from(Buffer.from(contents)).buffer;
    },
  } as unknown as File;
}

describe('3d-printing-quote status route', () => {
  const originalDir = process.env.QUOTE_STORAGE_DIR;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quote-status-'));
    process.env.QUOTE_STORAGE_DIR = tempDir;
  });

  afterEach(async () => {
    process.env.QUOTE_STORAGE_DIR = originalDir;
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test('returns limited customer-safe quote status', async () => {
    const record = await saveQuoteRequest(
      {
        name: 'Deej',
        email: 'deej@example.com',
        suburb: 'Frankston',
        material: 'PLA',
        quantity: 2,
        localFulfilment: 'yes',
        needsNextDay: 'yes',
        notes: 'Need two brackets.',
      },
      makeTestFile('bracket.stl', 'solid data', 'model/stl')
    );

    await updateQuoteRequest(record.id, {
      status: 'quoted',
      quotedPrice: 18.5,
      turnaroundEstimate: 'Next business day',
      adminNotes: 'internal only',
    });

    const response = await GET(
      new Request(
        `http://localhost/api/3d-printing-quote/status?requestId=${record.id}&email=${encodeURIComponent('deej@example.com')}`
      )
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.requestId).toBe(record.id);
    expect(body.status).toBe('quoted');
    expect(body.quotedPrice).toBe(18.5);
    expect(body.turnaroundEstimate).toBe('Next business day');
    expect(body.adminNotes).toBeUndefined();
    expect(body.email).toBeUndefined();
  });
});
