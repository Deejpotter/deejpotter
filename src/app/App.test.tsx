import React from "react";
import { render } from "@testing-library/react";
import App from "./page";

describe("Main app", () => {
  // Test the rendering of the main app component.
  it("renders the app correctly", () => {
    render(<App />);
  });
});