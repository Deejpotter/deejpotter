import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactForm from '@/app/contact/ContactForm';

beforeEach(() => {
  // Ensure env is 'test' so the form uses default localhost backend
  process.env.NODE_ENV = 'test';
});

describe('ContactForm', () => {
  test('renders form fields and validates required inputs', async () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    // Validation errors should appear
    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  test('successful submission shows success message', async () => {
    // Mock fetch to return ok
    global.fetch = vi.fn(() => Promise.resolve({ ok: true } as any)) as any;

    render(<ContactForm />);

    fireEvent.input(screen.getByLabelText(/Name/i), { target: { value: 'Deej' } });
    fireEvent.input(screen.getByLabelText(/Email address/i), { target: { value: 'deej@local.test' } });
    fireEvent.input(screen.getByLabelText(/Message/i), { target: { value: 'This is a test message.' } });

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    await waitFor(() => expect(screen.getByText(/Form submitted successfully/)).toBeInTheDocument());

    // Restore fetch
    (global.fetch as any) = undefined;
  });

  test('server error shows error message', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, json: () => ({ message: 'Bad' }) } as any)) as any;

    render(<ContactForm />);

    fireEvent.input(screen.getByLabelText(/Name/i), { target: { value: 'Deej' } });
    fireEvent.input(screen.getByLabelText(/Email address/i), { target: { value: 'deej@local.test' } });
    fireEvent.input(screen.getByLabelText(/Message/i), { target: { value: 'This is a test message.' } });

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    await waitFor(() => expect(screen.getByText(/Failed to submit the form/)).toBeInTheDocument());

    (global.fetch as any) = undefined;
  });
});
