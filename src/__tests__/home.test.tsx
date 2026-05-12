import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Home from "@/components/home/home";

describe("Home component", () => {
  test("renders the new services, process, and showcase sections", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /what i can build for you/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /a simple process that keeps things moving/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /explore the work/i })).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /website design and development/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /custom tools and automation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/discover the real problem/i)).toBeInTheDocument();
    expect(screen.getByText(/shape the structure/i)).toBeInTheDocument();
    expect(screen.getByText(/browse websites/i)).toBeInTheDocument();
    expect(screen.getByText(/explore tools/i)).toBeInTheDocument();
    expect(screen.getByText(/view services/i)).toBeInTheDocument();
  });
});
