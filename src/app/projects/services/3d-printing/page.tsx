import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";

export default function ThreeDPrintingService(): ReactElement {
  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">3D Printing Service</h1>
          <p className="text-gray-600">
            Transform your ideas into reality with professional 3D printing in
            Frankston
          </p>
        </div>

        <div className="mb-8">
          <p>Why choose us: (placeholder)</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-100 shadow-sm mb-4 p-3 rounded">
              <h3 className="text-lg font-semibold">Local Delivery</h3>
              <p>
                Enjoy the convenience of free local delivery within the
                Frankston area.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
