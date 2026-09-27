import { afterEach, describe, expect, it, vi } from "vitest";
import { getR2Key } from "./r2-storage";

describe("getR2Key", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("uses quotes/<id>/<file> with no prefix", () => {
    vi.stubEnv("R2_KEY_PREFIX", "");
    expect(getR2Key("Q-1", "part.stl")).toBe("quotes/Q-1/part.stl");
  });

  it("prepends R2_KEY_PREFIX", () => {
    vi.stubEnv("R2_KEY_PREFIX", "staging/");
    expect(getR2Key("Q-1", "part.stl")).toBe("staging/quotes/Q-1/part.stl");
  });
});
