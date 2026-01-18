import { ReactElement } from "react";
import Link from "next/link";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Script from "next/script";

export default function ThreeDPrintingService(): ReactElement {
  return (
    <>
      {/* Schema.org markup for 3D Printing Service */}
      <Script id="schema-3d-printing" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://deejpotter.com/projects/services/3d-printing/#service",
            "name": "3D Printing Service",
            "description": "Professional 3D printing services for hobbyists and small businesses in the Mornington Peninsula area. Fast turnaround, high-quality prints, and free local delivery in Frankston.",
            "provider": {
              "@type": "Person",
              "name": "Deej Potter",
              "url": "https://deejpotter.com"
            },
            "areaServed": {
              "@type": "Place",
              "name": "Mornington Peninsula",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Frankston",
                "addressRegion": "VIC",
                "addressCountry": "Australia"
              }
            },
            "serviceType": "3D Printing",
            "offers": {
              "@type": "Offer",
              "description": "Professional 3D printing with fast turnaround and local delivery",
              "areaServed": "Mornington Peninsula"
            }
          }
        `}
      </Script>

      <Container className="py-5">
        {/* Hero Section */}
        <Row className="mb-5">
          <Col md={12} className="text-center mb-4">
            <h1 className="display-4 fw-bold">3D Printing Service</h1>
            <p className="lead">
              Transform your ideas into reality with professional 3D printing in
              Frankston
            </p>
          </Col>
        </Row>

        {/* Main Content */}
        <Row className="mb-5">
          <Col lg={8}>
            <h2>Local 3D Printing for the Mornington Peninsula</h2>
            <p>
              Transform your creative ideas into reality with our 3D Printing
              Service! Based in the heart of Frankston, we&apos;re dedicated to
              providing high-quality 3D printing solutions tailored specifically
              for hobbyists and small businesses around the Mornington
              Peninsula. Our local service ensures you get your projects
              delivered right to your doorstep, hassle-free!
            </p>
            <p>
              This service is perfect for anyone looking to prototype designs,
              create custom models, or simply explore the exciting world of 3D
              printing. We understand the needs of our community and strive to
              deliver results that exceed expectations.
            </p>

            <h2 className="mt-5">Why Choose Our 3D Printing Service?</h2>
            <Row className="mt-4">
              <Col md={6}>
                <Card className="h-100 shadow-sm mb-4">
                  <Card.Body>
                    <h3 className="h5">
                      <i className="bi bi-truck me-2"></i>
                      Local Delivery
                    </h3>
                    <p>
                      Enjoy the convenience of free local delivery within the
                      Frankston area or express delivery to other locations on
                      the Mornington Peninsula.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 shadow-sm mb-4">
                  <Card.Body>
                    <h3 className="h5">
                      <i className="bi bi-clock-history me-2"></i>
                      Fast Turnaround
                    </h3>
                    <p>
                      We prioritise efficiency without compromising on quality,
                      ensuring your projects are completed quickly and meet your
                      deadlines.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 shadow-sm mb-4">
                  <Card.Body>
                    <h3 className="h5">
                      <i className="bi bi-piggy-bank me-2"></i>
                      Affordable Pricing
                    </h3>
                    <p>
                      Get strong, durable prints at competitive prices, making
                      your creative pursuits more accessible without breaking
                      the bank.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 shadow-sm mb-4">
                  <Card.Body>
                    <h3 className="h5">
                      <i className="bi bi-tools me-2"></i>
                      Design Assistance
                    </h3>
                    <p>
                      Need help with your design? As an engineer, I provide
                      expert design and engineering services to help you achieve
                      the perfect result.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <h2 className="mt-5">Benefits of Our Service</h2>
            <ul className="mt-3">
              <li>
                <strong>Quick and easy access</strong> to professional-grade 3D
                printing.
              </li>
              <li>
                <strong>Tailored solutions</strong> that cater to your specific
                needs.
              </li>
              <li>
                <strong>Friendly, local service</strong> that values your
                satisfaction.
              </li>
              <li>
                <strong>Personal approach</strong> as a solo engineer providing
                hands-on service.
              </li>
              <li>
                <strong>Technical expertise</strong> to ensure high-quality
                results every time.
              </li>
            </ul>

            <h2 className="mt-5">Who Is This Service For?</h2>
            <p>Our 3D printing service is perfect for:</p>
            <Row className="mt-3">
              <Col md={6}>
                <Card className="h-100 shadow-sm mb-4">
                  <Card.Body>
                    <h3 className="h5">Hobbyists</h3>
                    <p>
                      Create custom models, parts for projects, or bring your
                      creative ideas to life.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="h-100 shadow-sm mb-4">
                  <Card.Body>
                    <h3 className="h5">Small Businesses</h3>
                    <p>
                      Prototype new products, create custom parts, or develop
                      unique marketing materials.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>

          <Col lg={4}>
            <Card className="shadow border-0 p-4 mb-4 bg-light">
              <Card.Body>
                <h3>Request a Quote</h3>
                <p>
                  Interested in our 3D printing services? Get in touch for a
                  personalized quote tailored to your specific project needs.
                </p>
                <Link href="/contact" passHref>
                  <Button variant="primary" className="w-100">
                    Contact Us Today
                  </Button>
                </Link>
              </Card.Body>
            </Card>

            <Card className="shadow border-0 p-4 mb-4">
              <Card.Body>
                <h3>Service Area</h3>
                <p>
                  Based in Frankston, we provide 3D printing services throughout
                  the Mornington Peninsula area:
                </p>
                <ul className="list-unstyled">
                  <li>
                    <i className="bi bi-geo-alt me-2"></i>Frankston
                  </li>
                  <li>
                    <i className="bi bi-geo-alt me-2"></i>Mt Eliza
                  </li>
                  <li>
                    <i className="bi bi-geo-alt me-2"></i>Mornington
                  </li>
                  <li>
                    <i className="bi bi-geo-alt me-2"></i>Langwarrin
                  </li>
                  <li>
                    <i className="bi bi-geo-alt me-2"></i>Seaford
                  </li>
                  <li>
                    <i className="bi bi-geo-alt me-2"></i>And surrounding areas
                  </li>
                </ul>
              </Card.Body>
            </Card>

            <Card className="shadow border-0 p-4 bg-primary text-white">
              <Card.Body className="text-center">
                <h3>Experience the Difference</h3>
                <p>
                  Our 3D printing service combines quality, affordability, and
                  local convenience to bring your ideas to life.
                </p>
                <Link href="/projects/services" passHref>
                  <Button variant="light" className="mt-2">
                    Explore More Services
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* CTA Section */}
        <Row className="mt-5 py-4 bg-light rounded">
          <Col className="text-center">
            <h2>Ready to bring your ideas to life?</h2>
            <p className="mb-4">
              Experience the difference with our 3D Printing Service today!
            </p>
            <Link href="/contact" passHref>
              <Button variant="primary" size="lg">
                Get in Touch
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}
