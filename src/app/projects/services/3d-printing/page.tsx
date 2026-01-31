import { ReactElement } from "react";

export default function ThreeDPrintingService(): ReactElement {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl space-y-10 px-4">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">3D Printing Service</h1>
          <p className="mt-3 text-lg text-slate-600">
            Transform your ideas into reality with professional 3D printing in Frankston.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Why choose us</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 shadow-sm">
                <p className="text-lg font-semibold text-slate-900">Local Delivery</p>
                <p className="mt-1 text-sm text-slate-600">
                  Enjoy the convenience of free local delivery within the Frankston area.
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500">Full service details coming soon.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
