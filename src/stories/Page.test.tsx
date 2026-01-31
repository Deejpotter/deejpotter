import React from 'react';
import { render, screen } from '@testing-library/react';
import { Page } from './Page';

test('Page shows Log in button', async () => {
  render(<Page />);
  const loginButton = await screen.findByRole('button', { name: /Log in/i }, { timeout: 2000 });
  expect(loginButton).toBeInTheDocument();
});
