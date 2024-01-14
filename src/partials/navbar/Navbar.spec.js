// Importing necessary utilities and the component to be tested
import React from 'react';
import { render } from '@testing-library/react';
import Navbar from './Navbar';

// Mocking the useState hook to control its behavior in tests
const useStateMock = jest.spyOn(React, 'useState');

describe('Navbar with Multiple Dropdowns', () => {
    // Setup before each test
    beforeEach(() => {
        // Resetting mock state before each test for isolation
        useStateMock.mockImplementation((init) => [init, jest.fn()]);
    });

    // Test case 1: Rendering the component
    it('renders without crashing', () => {
        render(<Navbar />);
        // If render() completes without throwing, the test passes.
    });

    // Test case 2: Checking the initial state of isNavCollapsed
    it('initial state of isNavCollapsed is true (collapsed)', () => {
        // Mocking useState to return 'true' for isNavCollapsed
        useStateMock.mockImplementation(() => [true, jest.fn()]);
        // Rendering the component to test
        const { getByClassName } = render(<Navbar />);
        expect(getByClassName('navbar-collapse')).toHaveClass('collapse');
        // The navbar should have 'collapse' class when isNavCollapsed is true
    });

    // Test case 3: Checking the initial state of isDropdownOpen
    it('initial state of isDropdownOpen is false (hidden)', () => {
        // Mocking useState to return 'false' for isDropdownOpen
        useStateMock.mockImplementation(() => [false, jest.fn()]);
        // Rendering the component to test
        const { getByClassName } = render(<Navbar />);
        expect(getByClassName('dropdown-menu')).not.toHaveClass('show');
        // The dropdown menu should not have 'show' class when isDropdownOpen is false
    });

    // Test case: Toggling each dropdown independently
    it.each([
        { category: 'Apps', stateKey: 'isAppsDropdownOpen' },
        { category: 'Websites', stateKey: 'isWebsitesDropdownOpen' },
        { category: 'Games', stateKey: 'isGamesDropdownOpen' }
    ])('toggles $category dropdown menu on click', ({ stateKey }) => {
        // Mock useState to simulate the toggling of dropdown
        const setState = jest.fn();
        useStateMock.mockImplementation((init) => [init === stateKey, setState]);

        const { getByText } = render(<Navbar />);
        fireEvent.click(getByText(category));
        // Expect the setState to have been called with the opposite value
        expect(setState).toHaveBeenCalledWith(expect.any(Function));
    });

    // Additional tests can be added here to test state changes and other logic
});
