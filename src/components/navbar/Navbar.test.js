import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App'; // Assuming your main app component is named 'App'

describe('Portfolio App', () => {
    // Test the rendering of the main app component
    it('renders the app correctly', () => {
        render(<App />);
        expect(screen.getByText('Your Portfolio Name')).toBeInTheDocument();
    });

    // Test the navbar interactions
    it.each(['Apps', 'Websites', 'Games'])('shows %s dropdown on hover', (category) => {
        render(<App />);
        fireEvent.mouseOver(screen.getByText(category));
        expect(screen.getByTestId(`${category}-dropdown`)).toBeVisible();
    });

    // Test the responsive click behavior of the navbar
    it.each(['Apps', 'Websites', 'Games'])('toggles %s dropdown on click in mobile view', (category) => {
        render(<App />);
        // Simulate mobile view if necessary
        fireEvent.click(screen.getByText(category));
        expect(screen.getByTestId(`${category}-dropdown`)).toHaveClass('show');
    });

    // Test navigation to different sections
    // Add tests for clicking on navbar items and checking if it navigates to the correct section

    // Test responsive design
    // Add tests to verify the app layout and functionality at different screen sizes

    // Test for accessibility and usability
    // Add tests to check if the app is keyboard navigable and screen reader friendly

    // Additional tests for other specific interactions and functionalities
});

