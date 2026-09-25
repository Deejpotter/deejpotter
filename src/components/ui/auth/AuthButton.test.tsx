import React from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

const { authState } = vi.hoisted(() => ({
  authState: {
    current: {
      user: null as null | { id: string; emailAddresses: { emailAddress: string }[] },
      isLoaded: true,
      isSignedIn: false,
      login: () => {},
      signup: () => {},
      logout: () => {},
    },
  },
}));

vi.mock("./AuthProvider", () => ({ useAuth: () => authState.current }));

import AuthButton from "./AuthButton";

function signIn(id: string) {
  authState.current = {
    ...authState.current,
    isSignedIn: true,
    user: { id, emailAddresses: [{ emailAddress: `${id}@example.com` }] },
  };
}

describe("AuthButton admin link", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    authState.current = { ...authState.current, isSignedIn: false, user: null };
  });

  test("shows Admin for an admin and never carries it over to the next user", async () => {
    // Admin signs in.
    signIn("admin_user");
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ isAdmin: true })));
    const { rerender } = render(<AuthButton showGravatar={false} />);
    expect(await screen.findByRole("link", { name: "Admin" })).toBeInTheDocument();

    // A different, non-admin user signs in without the component unmounting.
    // Hold their admin check open so we can see the in-between render.
    let resolveSecond!: (res: Response) => void;
    fetchMock.mockReturnValueOnce(new Promise<Response>((r) => (resolveSecond = r)));
    signIn("regular_user");
    rerender(<AuthButton showGravatar={false} />);
    expect(screen.queryByRole("link", { name: "Admin" })).not.toBeInTheDocument();

    await act(async () => {
      resolveSecond(new Response(JSON.stringify({ isAdmin: false })));
    });
    expect(screen.queryByRole("link", { name: "Admin" })).not.toBeInTheDocument();
  });
});
