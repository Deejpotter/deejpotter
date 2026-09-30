import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ToolsPage from "@/app/projects/tools/page";
import GamesPage from "@/app/projects/games/page";
import EngineeringPage from "@/app/projects/engineering/page";

describe("Tailwind-converted project pages", () => {
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
