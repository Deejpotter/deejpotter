import { ReactElement } from "react";
import Link from "next/link";

export default function MainFooter(): ReactElement {
  return (
    // The mt-auto class is used to push the footer to the bottom of the page. It makes the margin-top property of the footer auto, which interacts with the d-flex on the body element and the flex-grow-1 on the main element to push the footer to the bottom of the page.
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
              {/* Facebook link */}
              <Link
                href="https://www.facebook.com/deej.potter.7/"
                target="_blank"
              >
                <span className="bi bi-facebook fs-3" aria-hidden="true" />
              </Link>
              {/* LinkedIn link */}
              <Link
                href="https://www.linkedin.com/in/daniel-potter-5224a4119"
                target="_blank"
              >
                <span className="bi bi-linkedin fs-3" aria-hidden="true" />
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
