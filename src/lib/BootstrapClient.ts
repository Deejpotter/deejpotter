"use client";
import { useEffect } from "react";
import "@popperjs/core/dist/umd/popper.min.js";

/**
 * This component loads the bootstrap bundle on the client side so we can use the bootstrap javascript in our other components.
 * @returns Null, it just loads the bootstrap bundle.
 */
function BootstrapClient() {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}

export default BootstrapClient;
