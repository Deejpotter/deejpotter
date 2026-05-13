import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import GamesPage from "@/app/projects/games/page";
import GeekPrideDayPage from "@/app/projects/games/geek-pride-day/page";

describe("Geek Pride Day game pages", () => {
  test("renders the games overview with the new prototype card", () => {
    render(<GamesPage />);

    expect(
      screen.getByRole("heading", { name: /game development projects/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /geek pride day platformer/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /play geek pride day prototype/i })
    ).toHaveAttribute("href", "/projects/games/geek-pride-day");
  });

  test("renders the Geek Pride Day prototype page and iframe", () => {
    render(<GeekPrideDayPage />);

    expect(
      screen.getByRole("heading", { name: /playable browser game preview/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /playable browser game preview/i })
    ).toBeInTheDocument();
    expect(screen.getByTitle(/geek pride day platformer prototype/i)).toHaveAttribute(
      "src",
      "/geek-pride-day/index.html"
    );
  });
});
