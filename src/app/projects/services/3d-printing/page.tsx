import { ReactElement } from "react";
import Link from "next/link";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Script from "next/script";


export default function ThreeDPrintingService(): ReactElement {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col md={12} className="text-center mb-4">
          <h1 className="display-4 fw-bold">3D Printing Service</h1>
          <p className="lead">Transform your ideas into reality with professional 3D printing in Frankston</p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={8}>
          <p>Why choose us: (placeholder)</p>
          <Row className="mt-4">
            <Col md={6}>
              <div className="h-100 shadow-sm mb-4 p-3">
                <h3 className="h5">
                  <i className="bi bi-truck me-2"></i>
                  Local Delivery
                </h3>
                <p>Enjoy the convenience of free local delivery within the Frankston area.</p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
