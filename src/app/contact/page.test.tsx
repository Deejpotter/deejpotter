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

    const textarea = screen.getByLabelText(/Enter Message/i);
    const submit = screen.getByRole('button', { name: /Submit form/i });

    fireEvent.change(textarea, { target: { value: 'hello' } });
    fireEvent.click(submit);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledWith('/__forms.html', expect.objectContaining({ method: 'POST' }));

    // successful submission shows alert
    await waitFor(() => expect(screen.getByText(/Form submitted successfully!/i)).toBeInTheDocument());
  });
});
