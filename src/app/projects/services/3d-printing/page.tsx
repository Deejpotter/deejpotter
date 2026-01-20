import { ReactElement } from "react";
import Link from "next/link";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Script from "next/script";

// Debug: ensure imports resolve during server-side render
/* eslint-disable no-console */
console.log('DEBUG 3d-printing imports', {
  Link: typeof Link,
  Container: typeof Container,
  Row: typeof Row,
  Col: typeof Col,
  Card: typeof Card,
  Button: typeof Button,
  Script: typeof Script,
});
/* eslint-enable no-console */

export default function ThreeDPrintingService(): ReactElement {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col md={12} className="text-center mb-4">
          <h1 className="display-4 fw-bold">3D Printing Service</h1>
          <p className="lead">
            Transform your ideas into reality with professional 3D printing in
            Frankston
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={8}>
          <p>Why choose us: (placeholder)</p>
          <Row className="mt-4">
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
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
