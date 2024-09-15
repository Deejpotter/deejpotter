import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App'; // Assuming your main app component is named 'App'

describe('Portfolio App', () => {
  // Test the rendering of the main app component
  it('renders the app correctly', () => {
    render(<App />);
    expect(screen.getByText('Your Portfolio Name')).toBeInTheDocument();
  });
});