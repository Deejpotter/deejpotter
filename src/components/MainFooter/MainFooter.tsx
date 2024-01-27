import { ReactElement } from "react";
import Link from "next/link";
import styles from "./MainFooter.module.scss";

export default function MainFooter(): ReactElement {
  return (
    <footer id="main-footer" className="py-1 shadow-lg">
      <div className="container">
        <div className="row justify-content-between">
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
          <div className="col-4 text-center">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h6 className="my-0">Policies</h6>
              <Link href="/privacy" className={`${styles.footerLink}`}>
                Privacy policy
              </Link>
              <Link href="/terms" className={`${styles.footerLink}`}>
                Terms and conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}