import { ReactElement } from "react";
import Link from "next/link";

export default function MainFooter(): ReactElement {
  return (
    // Added 'mt-auto' to push the footer to the bottom when content is short
    // Kept existing 'py-1' for padding and 'shadow-lg' for shadow effect
    // Added 'bg-light' for a light background (adjust as needed for your design)
    <footer id="main-footer" className="mt-auto py-1 shadow-lg bg-light">
      <div className="container">
        <div className="row justify-content-between">
          {/* Feedback section */}
          <div className="col-4 text-center">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h6 className="my-0">Feedback</h6>
              <p className="my-0">Got some feedback for me?</p>
              <Link
                className="btn btn-sm btn-primary text-light"
                href="/contact"
              >
                Let me know
              </Link>
            </div>
          </div>
          {/* Connect section */}
          <div className="col-4 text-center">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h6 className="my-0">Connect with me</h6>
              <Link
                href="https://www.facebook.com/deej.potter.7/"
                target="_blank"
              >
                <span className="bi bi-facebook fs-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
          {/* Policies section */}
          <div className="col-4 text-center">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h6 className="my-0">Policies</h6>
              <Link href="/privacy">Privacy policy</Link>
              <Link href="/terms">Terms and conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
