import { ReactElement } from "react";
import Link from "next/link";

export default function MainFooter(): ReactElement {
  return (
    <footer
      id="main-footer"
      className="mt-auto py-4 shadow-lg bg-gray-100 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          {/* Feedback section */}
          <div className="w-1/3 text-center">
            <div className="flex flex-col justify-center items-center">
              <h6 className="my-0 font-bold">Feedback</h6>
              <p className="my-0 text-sm dark:text-gray-300">
                Got some feedback for me?
              </p>
              <Link
                href="/contact"
                className="mt-2 inline-block bg-primary text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-opacity-80 transition-all"
              >
                Let me know
              </Link>
            </div>
          </div>
          {/* Connect section */}
          <div className="w-1/3 text-center">
            <div className="flex flex-col justify-center items-center">
              <h6 className="my-0 font-bold">Connect with me</h6>
              <div className="flex space-x-4 mt-2">
                {/* Facebook link */}
                <Link
                  href="https://www.facebook.com/deej.potter.7/"
                  target="_blank"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <i className="bi bi-facebook text-2xl"></i>
                  <span className="sr-only">Facebook</span>
                </Link>
                {/* LinkedIn link */}
                <Link
                  href="https://www.linkedin.com/in/daniel-potter-5224a4119"
                  target="_blank"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <i className="bi bi-linkedin text-2xl"></i>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>
          {/* Policies section */}
          <div className="w-1/3 text-center">
            <div className="flex flex-col justify-center items-center">
              <h6 className="my-0 font-bold">Policies</h6>
              <Link
                href="/privacy"
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Privacy policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Terms and conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
