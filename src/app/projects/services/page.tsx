import { ReactElement } from "react";

export default function Services(): ReactElement {
  // Define the services offered
  const services = [
    {
      id: "3d-printing",
      name: "3D Printing Service",
      description:
        "Professional 3D printing services for hobbyists and small businesses in the Mornington Peninsula area. Fast turnaround, high-quality prints, and free local delivery in Frankston.",
      features: [
        "Local Delivery",
        "Fast Turnaround",
        "Affordable Pricing",
        "Design Assistance",
      ],
      image: "/images/services/3d-printing.jpg", // Note: You may need to add this image to your assets
      link: "/projects/services/3d-printing",
    },
    // You can add more services here as they develop
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Services</h1>
        <p className="mt-3 text-slate-600">More details coming soon.</p>
      </div>
    </div>
  );
}
