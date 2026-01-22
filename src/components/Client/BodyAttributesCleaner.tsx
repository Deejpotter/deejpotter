"use client";

import { useEffect } from "react";

// Removes extension-injected attributes (e.g., Grammarly) that cause
// hydration mismatches between server and client HTML.
export default function BodyAttributesCleaner() {
  useEffect(() => {
    try {
      const attrsToRemove = [
        "data-new-gr-c-s-check-loaded",
        "data-gr-ext-installed",
        "data-gramm"
      ];

      const body = document.body;
      if (!body) return;

      for (const a of attrsToRemove) {
        if (body.hasAttribute(a)) {
          body.removeAttribute(a);
        }
      }
    } catch (e) {
      // No-op - defensive; never want this to break the app
      // eslint-disable-next-line no-console
      console.debug("BodyAttributesCleaner error", e);
    }
  }, []);

  return null;
}