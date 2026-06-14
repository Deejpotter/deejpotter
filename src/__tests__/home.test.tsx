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
    expect(
      screen.getByRole("heading", {
        name: /browse the parts of the site that show the range/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /website design and development/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /custom tools and automation/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/you tell me what you need/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/i build it/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/browse websites/i)).toBeInTheDocument();
    expect(screen.getByText(/explore tools/i)).toBeInTheDocument();
    expect(screen.getByText(/view services/i)).toBeInTheDocument();
  });
});
