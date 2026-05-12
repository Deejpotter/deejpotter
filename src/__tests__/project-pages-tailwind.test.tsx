import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import WebsiteDesignService from "@/app/projects/services/website-design/page";
import WebsiteRedesignService from "@/app/projects/services/website-redesign/page";
import CustomToolsService from "@/app/projects/services/custom-tools/page";
import ToolsPage from "@/app/projects/tools/page";
import GamesPage from "@/app/projects/games/page";
import EngineeringPage from "@/app/projects/engineering/page";

describe("Tailwind-converted project pages", () => {
  test("website design service page renders its key sections", () => {
    render(<WebsiteDesignService />);
    expect(
      screen.getByRole("heading", { name: /website design and development/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /typical deliverables/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /frequently asked questions/i })).toBeInTheDocument();
  });

  test("website redesign page renders its key sections", () => {
    render(<WebsiteRedesignService />);
    expect(screen.getByRole("heading", { name: /website redesign/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /typical redesign goals/i })).toBeInTheDocument();
  });

  test("custom tools service page renders its key sections", () => {
    render(<CustomToolsService />);
    expect(screen.getByRole("heading", { name: /custom tools and automation/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /best starting brief/i })).toBeInTheDocument();
  });

  test("tools overview page renders its key sections", () => {
    render(<ToolsPage />);
    expect(screen.getByRole("heading", { name: /tools & calculators/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /more tools coming soon/i })).toBeInTheDocument();
  });

  test("games overview page renders its key sections", () => {
    render(<GamesPage />);
    expect(screen.getByRole("heading", { name: /game development projects/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /game development skills/i })).toBeInTheDocument();
  });

  test("engineering overview page renders its key sections", () => {
    render(<EngineeringPage />);
    expect(screen.getByRole("heading", { name: /engineering & hardware projects/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /my engineering approach/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /technologies & tools/i })).toBeInTheDocument();
  });
});
