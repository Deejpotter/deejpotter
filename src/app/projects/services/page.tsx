import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";
import { Container, Row, Col, Card } from "react-bootstrap";


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

  return <div className="py-5">Services (minimal)</div>;
}
