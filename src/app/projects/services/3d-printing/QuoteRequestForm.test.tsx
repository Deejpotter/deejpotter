import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import QuoteRequestForm from './QuoteRequestForm';

describe('QuoteRequestForm', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        message: 'Quote request received. I will review the file and reply with pricing and turnaround.',
      }),
    }));
  });

  afterEach(() => {
    // @ts-ignore
    if (global.fetch && typeof (global.fetch as any).mockRestore === 'function') {
      (global.fetch as any).mockRestore();
    }
  });

  test('submits the quote request form with file upload', async () => {
    render(<QuoteRequestForm />);

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Deej Potter' },
    });
    fireEvent.change(screen.getByLabelText(/^Email$/i), {
      target: { value: 'deej@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Suburb \/ area/i), {
      target: { value: 'Frankston' },
    });

    const file = new File(['solid data'], 'bracket.stl', { type: 'model/stl' });
    const input = screen.getByLabelText(/Model file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    const submitButton = screen.getByRole('button', { name: /Request quote/i });
    fireEvent.submit(submitButton.closest('form') as HTMLFormElement);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/3d-printing-quote',
      expect.objectContaining({ method: 'POST' })
    );
    await waitFor(() => {
      expect(screen.getByText(/Quote request received/i)).toBeInTheDocument();
    });
  });
});
