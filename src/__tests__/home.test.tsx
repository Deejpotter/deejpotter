import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Home from "@/components/home/home";

describe("Home component", () => {
  test("renders the new services, process, and showcase sections", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /what i can make for you/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /how a job goes/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /things i.ve made/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /website design and development/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /custom tools and automation/i })
    ).toBeInTheDocument();
    // The process steps appear once, not in two separate sections.
    expect(screen.getAllByText(/tell me what you need/i)).toHaveLength(1);
    expect(screen.getByRole("link", { name: /get a 3d print quote/i })).toHaveAttribute("href", "/projects/services/3d-printing");
    expect(screen.getByRole("link", { name: /website projects/i })).toHaveAttribute("href", "/projects/websites");
  });
});
