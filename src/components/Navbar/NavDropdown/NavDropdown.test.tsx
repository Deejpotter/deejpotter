import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NavDropdown, { NavDropdownProps } from "@/components/Navbar/NavDropdown/NavDropdown";

// Start a test suite for the NavDropdown component
describe("NavDropdown component", () => {
  // Define the props to be used in the tests
  const props: NavDropdownProps = {
    title: "Test",
    items: [
      {href: "/test", label: "Test 1"},
      {href: "/test2", label: "Test 2"},
    ],
  };

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

  // Test if the dropdown opens when the title is clicked or hovered over
  test("opens dropdown on title click or hover", () => {
    render(<NavDropdown {...props} />);
    const titleElement = screen.getByText(props.title);
    fireEvent.click(titleElement);
    expect(screen.getByText(props.items[0].label)).toBeInTheDocument();
    expect(screen.getByText(props.items[1].label)).toBeInTheDocument();
  });

  // Test if the dropdown closes when it's clicked or hovered over
  test("closes dropdown on dropdown click or hover", () => {
    render(<NavDropdown {...props} />);
    const titleElement = screen.getByText(props.title);
    fireEvent.click(titleElement);
    fireEvent.mouseOver(titleElement);
    expect(screen.queryByText(props.items[0].label)).not.toBeInTheDocument();
    expect(screen.queryByText(props.items[1].label)).not.toBeInTheDocument();
  });

  // Test if the dropdown closes when the title is clicked again
  test("closes dropdown on title click again", () => {
    render(<NavDropdown {...props} />);
    const titleElement = screen.getByText(props.title);
    fireEvent.click(titleElement);
    fireEvent.click(titleElement);
    expect(screen.queryByText(props.items[0].label)).not.toBeInTheDocument();
    expect(screen.queryByText(props.items[1].label)).not.toBeInTheDocument();
  });

  // Test if the dropdown items have the correct href values
  test("renders dropdown items with correct href", () => {
    render(<NavDropdown {...props} />);
    props.items.forEach((item) => {
      expect(screen.getByText(item.label).closest('a')).toHaveAttribute('href', item.href);
    });
  });

  // Test if the dropdown items have the correct label values
  test("renders dropdown items with correct label", () => {
    render(<NavDropdown {...props} />);
    props.items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });
});