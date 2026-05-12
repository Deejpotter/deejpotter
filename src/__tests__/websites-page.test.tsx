import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import WebsitesPage from "@/app/projects/websites/page";
import DeejpotterPage from "@/app/projects/websites/deejpotter/page";

describe("website project pages", () => {
  test("renders the websites overview with project cards", () => {
    render(<WebsitesPage />);

    expect(
      screen.getByRole("heading", { name: /website development projects/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/cnc tools application/i)).toBeInTheDocument();
    expect(screen.getByText(/deej potter portfolio/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /my web development approach/i })).toBeInTheDocument();
  });

  test("renders the portfolio case study page", () => {
    render(<DeejpotterPage />);

    expect(screen.getByRole("heading", { name: /deejpotter.com/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /current stack/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /client-fit direction/i })).toBeInTheDocument();
  });
});
