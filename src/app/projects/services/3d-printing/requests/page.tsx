import { ReactElement } from "react";
import Link from "next/link";
import QuoteRequestsAdmin from "../QuoteRequestsAdmin";

export default function ThreeDPrintingQuoteRequestsPage(): ReactElement {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
            <div>
              <p className="text-uppercase text-muted small mb-2">Internal workflow</p>
              <h1 className="display-6 mb-3">3D printing quote board</h1>
              <p className="text-muted mb-0">
                Review incoming quote requests, download files, and track quote
                status, price, and turnaround from one place.
              </p>
            </div>
            <Link href="/projects/services/3d-printing" className="btn btn-outline-primary">
              Back to service page
            </Link>
          </div>

          <QuoteRequestsAdmin />
        </div>
      </div>
    </div>
  );
}
