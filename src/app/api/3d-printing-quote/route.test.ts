import { POST } from './route';

function makeFormRequest(formData: FormData) {
  return new Request('http://localhost/api/3d-printing-quote', {
    method: 'POST',
    body: formData,
  });
}

describe('3d-printing-quote route', () => {
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
