"use client";

import { ReactElement } from "react";
import { Card, Row, Col, Badge, ListGroup } from "react-bootstrap";
import { CalculationResult } from "@/types/cutCalculator";
import CutPatternVisualization from "./CutPatternVisualization";

type ResultsDisplayProps = {
  result: CalculationResult;
  stockLength: number;
};

export default function ResultsDisplay({
  result,
  stockLength,
}: ResultsDisplayProps): ReactElement {
  const formatNumber = (num: number, decimals = 1): string => {
    return num.toFixed(decimals);
  };

  return (
    <div>
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-info text-white">
          <h5 className="mb-0">Results Summary</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center border-primary">
                <Card.Body>
                  <h6 className="text-muted mb-2">Stock Pieces</h6>
                  <h2 className="text-primary mb-0">{result.totalStock}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center border-success">
                <Card.Body>
                  <h6 className="text-muted mb-2">Utilization</h6>
                  <h2 className="text-success mb-0">
                    {formatNumber(result.averageUtilization)}%
                  </h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center border-warning">
                <Card.Body>
                  <h6 className="text-muted mb-2">Total Waste</h6>
                  <h2 className="text-warning mb-0">
                    {result.totalWaste.toLocaleString()}mm
                  </h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center border-secondary">
                <Card.Body>
                  <h6 className="text-muted mb-2">Calculation Time</h6>
                  <h2 className="text-secondary mb-0">
                    {formatNumber(result.executionTime, 2)}ms
                  </h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Header className="bg-dark text-white">
          <h5 className="mb-0">Cutting Patterns ({result.patterns.length} pieces)</h5>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {result.patterns.map((pattern, index) => (
              <ListGroup.Item key={index} className="px-0">
                <Row className="align-items-center">
                  <Col lg={2} md={3} className="mb-2 mb-md-0">
                    <strong className="text-primary">
                      Stock #{pattern.stockIndex}
                    </strong>
                    <div className="small text-muted">
                      {pattern.cuts.length} cuts
                    </div>
                  </Col>
                  <Col lg={7} md={6} className="mb-2 mb-md-0">
                    <CutPatternVisualization
                      pattern={pattern}
                      stockLength={stockLength}
                    />
                  </Col>
                  <Col lg={3} md={3}>
                    <div className="d-flex flex-wrap gap-2">
                      <Badge bg="success" className="d-flex align-items-center">
                        <i className="bi bi-speedometer2 me-1"></i>
                        {formatNumber(pattern.utilization)}%
                      </Badge>
                      <Badge bg="warning" text="dark" className="d-flex align-items-center">
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        {pattern.waste}mm waste
                      </Badge>
                    </div>
                    <div className="small text-muted mt-2">
                      Cuts: {pattern.cuts.join("mm, ")}mm
                    </div>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
        <Card.Footer className="text-muted">
          <Row>
            <Col md={6}>
              <small>
                <strong>Material Efficiency:</strong> Using {result.totalStock}{" "}
                stock pieces with{" "}
                {formatNumber(result.averageUtilization)}% average utilization
              </small>
            </Col>
            <Col md={6} className="text-md-end">
              <small>
                <strong>Waste:</strong> {result.totalWaste.toLocaleString()}mm
                total (~
                {formatNumber(
                  (result.totalWaste / (result.totalStock * stockLength)) * 100
                )}
                % of material)
              </small>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </div>
  );
}
