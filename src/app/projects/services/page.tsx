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

  return (
    <>
      {/* Schema.org markup for services */}
      <Script id="schema-services" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@type": "Service",
                  "name": "3D Printing Service",
                  "description": "Professional 3D printing services for hobbyists and small businesses in the Mornington Peninsula area",
                  "url": "https://deejpotter.com/projects/services/3d-printing"
                }
              }
            ]
          }
        `}
      </Script>

      <Container className="py-5">
        {/* Hero Section */}
        <Row className="mb-5">
          <Col md={12} className="text-center">
            <h1 className="display-4">Professional Services</h1>
            <p className="lead">
              Explore the range of technical services I offer to help bring your
              ideas to life
            </p>
          </Col>
        </Row>

        {/* Services List */}
        <Row>
          {services.map((service) => (
            <Col md={12} key={service.id} className="mb-5">
              <Card className="shadow border-0 h-100">
                <Row className="g-0">
                  <Col
                    md={4}
                    className="d-flex align-items-center justify-content-center bg-light p-3"
                  >
                    {service.image ? (
                      <div className="text-center">
                        <i className="bi bi-printer3d display-1 text-primary"></i>
                        <p className="mt-3 fw-bold">{service.name}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <i className="bi bi-tools display-1 text-primary"></i>
                        <p className="mt-3 fw-bold">{service.name}</p>
                      </div>
                    )}
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title as="h2">{service.name}</Card.Title>
                      <Card.Text>{service.description}</Card.Text>

                      <h3 className="h5 mt-4">Key Features:</h3>
                      <ul className="list-unstyled">
                        {service.features.map((feature, index) => (
                          <li key={index}>
                            <i className="bi bi-check-circle me-2 text-success"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={service.link}
                        className="btn btn-primary mt-3"
                      >
                        Learn More
                      </Link>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>

        {/* CTA Section */}
        <Row className="mt-5 py-4 bg-light rounded">
          <Col className="text-center">
            <h2>Looking for a custom service?</h2>
            <p className="mb-4">
              Have a project in mind but don't see the specific service listed?
              Contact me to discuss your needs!
            </p>
            <Link href="/contact" className="btn btn-primary">
              Get in Touch
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}
