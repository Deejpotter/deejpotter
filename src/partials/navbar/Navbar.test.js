
// Importing utilities from React Testing Library and the component
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Navbar from './Navbar';

describe('Navbar', () => {
    // Test case 1: Checking if the navbar renders correctly
    it('renders correctly', () => {
        render(<Navbar />);
        // Use screen to query DOM nodes, assert if certain elements are rendered
        expect(screen.getByText('Brand')).toBeInTheDocument();
        // Checks if the brand name/link is present in the document
    });

    // Test case 2: Testing navbar toggle functionality
    it('toggles navbar on click', () => {
        render(<Navbar />);
        const toggleButton = screen.getByLabelText('Toggle navigation');
        fireEvent.click(toggleButton);
        // Simulate a click event on the toggle button
        // After the click, check if the navbar-collapse has the appropriate class
        expect(screen.getByClassName('navbar-collapse')).not.toHaveClass('collapse');
        // The navbar should not have 'collapse' class after being toggled
    });

    // Test case 3: Testing dropdown open/close functionality
    it('opens and closes dropdown menu on click', () => {
        render(<Navbar />);
        const dropdownToggle = screen.getByText('More');
        fireEvent.click(dropdownToggle);
        // First click: Open the dropdown
        expect(screen.getByClassName('dropdown-menu')).toHaveClass('show');
        // The dropdown menu should have 'show' class when open

        fireEvent.click(dropdownToggle);
        // Second click: Close the dropdown
        expect(screen.getByClassName('dropdown-menu')).not.toHaveClass('show');
        // The dropdown menu should not have 'show' class when closed
    });

    // Test case: Dropdown opens on hover (for desktop)
    it.each([
        'Apps',
        'Websites',
        'Games'
    ])('opens $dropdownName dropdown on hover', (dropdownName) => {
        render(<Navbar />);
        // Simulate hover event
        fireEvent.mouseOver(screen.getByText(dropdownName));
        // Expect the dropdown menu to be visible
        expect(screen.getByTestId(`${dropdownName}-dropdown-menu`)).toBeVisible();
    });

    // Test case: Dropdown toggles on click (for smaller screens)
    it.each([
        'Apps',
        'Websites',
        'Games'
    ])('toggles $dropdownName dropdown on click', (dropdownName) => {
        render(<Navbar />);
        // Simulate click event
        fireEvent.click(screen.getByText(dropdownName));
        // Expect the dropdown menu to toggle visibility
        expect(screen.getByTestId(`${dropdownName}-dropdown-menu`)).toHaveClass('show');
    });

    // Additional interaction tests can be added here
});
