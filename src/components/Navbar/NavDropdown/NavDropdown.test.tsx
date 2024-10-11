import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import NavDropdown, { NavDropdownProps } from "./NavDropdown"; // Adjust the import path as necessary

describe("NavDropdown Component", () => {
  // Define the props to be used in the tests
  const props: NavDropdownProps = {
    label: "Test",
    items: [
      { href: "/test", label: "Test 1" },
      { href: "/test2", label: "Test 2" },
    ],
  };

  // Test if the component renders with the provided label
  test("renders with label", () => {
    render(<NavDropdown {...props} />);
    expect(screen.getByText(props.label)).toBeInTheDocument();
  });

  // Test if the dropdown items are rendered
  test("renders dropdown items", () => {
    render(<NavDropdown {...props} />);
    props.items.forEach((item) => {
      expect(screen.queryByText(item.label)).toBeInTheDocument();
    });
  });

  // Test if the dropdown opens when the label is clicked or hovered over
  test("opens dropdown on label click or hover", () => {
    render(<NavDropdown {...props} />);
    const labelElement = screen.getByText(props.label);
    fireEvent.click(labelElement);
    expect(screen.getByText(props.items[0].label)).toBeInTheDocument();
    expect(screen.getByText(props.items[1].label)).toBeInTheDocument();
  });

  // Test if the dropdown closes when it's clicked or hovered over
  test("closes dropdown on dropdown click or hover", () => {
    render(<NavDropdown {...props} />);
    const labelElement = screen.getByText(props.label);
    fireEvent.click(labelElement);
    fireEvent.mouseOver(labelElement);
    expect(screen.queryByText(props.items[0].label)).not.toBeInTheDocument();
    expect(screen.queryByText(props.items[1].label)).not.toBeInTheDocument();
  });

  // Test if the dropdown closes when the label is clicked again
  test("closes dropdown on label click again", () => {
    render(<NavDropdown {...props} />);
    const labelElement = screen.getByText(props.label);
    fireEvent.click(labelElement);
    fireEvent.click(labelElement);
    expect(screen.queryByText(props.items[0].label)).not.toBeInTheDocument();
    expect(screen.queryByText(props.items[1].label)).not.toBeInTheDocument();
  });

  // Test if the dropdown items have the correct href values
  test("renders dropdown items with correct href", () => {
    render(<NavDropdown {...props} />);
    props.items.forEach((item) => {
      expect(screen.getByText(item.label).closest("a")).toHaveAttribute(
        "href",
        item.href
      );
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
