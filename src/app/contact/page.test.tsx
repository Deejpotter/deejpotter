import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from './page';

describe('Contact form', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn(() => Promise.resolve({ ok: true }));
  });

  afterEach(() => {
    // @ts-ignore
    if (global.fetch && typeof (global.fetch as any).mockRestore === 'function') {
      (global.fetch as any).mockRestore();
    }
  });

  test('submits form and shows success message', async () => {
    render(<Contact />);

    const name = screen.getByLabelText(/Name \(required\)/i);
    const email = screen.getByLabelText(/Email address \(required\)/i);
    const textarea = screen.getByLabelText(/Message \(required\)/i);
    const submit = screen.getByRole('button', { name: /Submit form/i });

    fireEvent.change(name, { target: { value: 'John Doe' } });
    fireEvent.change(email, { target: { value: 'john@example.com' } });
    fireEvent.change(textarea, { target: { value: 'hello there world' } });
    fireEvent.click(submit);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/http:\/\/localhost:3001\/api\/contact$/),
      expect.objectContaining({ method: 'POST' })
    );

    // successful submission shows alert
    await waitFor(() => expect(screen.getByText(/Form submitted successfully!/i)).toBeInTheDocument());
  });
});
