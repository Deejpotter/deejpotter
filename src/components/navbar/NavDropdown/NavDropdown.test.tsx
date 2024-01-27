import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NavDropdown, { NavDropdownProps } from "@/components/Navbar/NavDropdown/NavDropdown";

// Start a test suite for the NavDropdown component
describe("NavDropdown component", () => {
  // Define the props to be used in the tests
  const props: NavDropdownProps = {
    title: "Test",
    items: [
      {id: "1", href: "/test", label: "Test 1"},
      {id: "2", href: "/test/test2", label: "Test 2"},
    ],
  };

  // If NavDropdown has any dependencies, mock them here
  // jest.mock('dependency-module', () => { /* mock implementation */ });

  // Test if the component renders with the provided title
  test("renders with title", () => {
    render(<NavDropdown {...props} />);
    expect(screen.getByText(props.title)).toBeInTheDocument();
  });

  // Test if the dropdown items are rendered
  test("renders dropdown items", () => {
    render(<NavDropdown {...props} />);
    props.items.forEach((item) => {
      expect(screen.queryByText(item.label)).toBeInTheDocument();
    });
  });

  // Test if the dropdown opens and closes
  test("opens and closes dropdown", () => {
    render(<NavDropdown {...props} />);
    const titleElement = screen.getByText(props.title);
    fireEvent.click(titleElement);
    props.items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
    fireEvent.click(titleElement);
    props.items.forEach((item) => {
      expect(screen.queryByText(item.label)).not.toBeInTheDocument();
    });
  });

  // Test edge case where items prop is an empty array
  test("renders with no items", () => {
    const emptyProps: NavDropdownProps = {...props, items: []};
    render(<NavDropdown {...emptyProps} />);
    expect(screen.queryByText(props.items[0].label)).not.toBeInTheDocument();
    expect(screen.queryByText(props.items[1].label)).not.toBeInTheDocument();
  });
});