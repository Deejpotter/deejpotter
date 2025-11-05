"use client";

import { ReactElement, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { calculateOptimalCuts } from "@/lib/cutOptimizer";
import {
  CutRequirement,
  StockItem,
  CalculationResult,
} from "@/types/cutCalculator";
import CutRequirementsTable from "./CutRequirementsTable";
import StockItemsTable from "./StockItemsTable";
import ResultsDisplay from "./ResultsDisplay";
import styles from "./CutCalculator.module.scss";

const DEFAULT_KERF_WIDTH = 4; // 4mm kerf for standard cutting blade
const MAX_STOCK_LENGTH = 3050; // Maximum standard stock length

export default function CutCalculatorPage(): ReactElement {
  const [kerfWidth, setKerfWidth] = useState<string>(String(DEFAULT_KERF_WIDTH));
  const [stockItems, setStockItems] = useState<StockItem[]>([
    { id: "1", length: 3050, quantity: 10 },
  ]);
  const [requirements, setRequirements] = useState<CutRequirement[]>([
    { id: "1", length: 450, quantity: 4 },
  ]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = (): void => {
    setError("");
    setResult(null);

    const kerfWidthNum = parseFloat(kerfWidth);
    if (isNaN(kerfWidthNum) || kerfWidthNum < 0) {
      setError("Please enter a valid kerf width (0 or greater).");
      return;
    }

    try {
      const calculationResult = calculateOptimalCuts({
        stockItems,
        requirements,
        kerfWidth: kerfWidthNum,
      });
      setResult(calculationResult);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during calculation.");
      }
    }
  };

  const handleReset = (): void => {
    setKerfWidth(String(DEFAULT_KERF_WIDTH));
    setStockItems([{ id: "1", length: 3050, quantity: 10 }]);
    setRequirements([{ id: "1", length: 450, quantity: 4 }]);
    setResult(null);
    setError("");
  };

  return (
    <Container className={`${styles.cutCalculator} py-5`}>
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-3">20 Series Cut Calculator</h1>
          <p className="text-center text-muted">
            Optimize aluminum extrusion cuts using the Best Fit Decreasing algorithm.
            Supports multiple stock lengths and accounts for blade kerf to minimize waste.
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Configuration</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      Kerf Width (mm)
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={kerfWidth}
                      onChange={(e) => setKerfWidth(e.target.value)}
                      placeholder="Enter kerf width (blade thickness)"
                      min="0"
                      step="0.1"
                      aria-label="Kerf width in millimeters"
                    />
                    <Form.Text className="text-muted">
                      Blade thickness - accounts for material lost during each cut (typically 3-5mm)
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <StockItemsTable
            stockItems={stockItems}
            onStockItemsChange={setStockItems}
            maxStockLength={MAX_STOCK_LENGTH}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <CutRequirementsTable
            requirements={requirements}
            onRequirementsChange={setRequirements}
          />
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              <Alert.Heading>Validation Error</Alert.Heading>
              <p className="mb-0">{error}</p>
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col className="d-flex justify-content-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleCalculate}
            disabled={requirements.length === 0 || stockItems.length === 0}
            aria-label="Calculate optimal cuts"
          >
            Calculate Cuts
          </Button>
          <Button
            variant="outline-secondary"
            size="lg"
            onClick={handleReset}
            aria-label="Reset calculator"
          >
            Reset
          </Button>
        </Col>
      </Row>

      {result && (
        <Row>
          <Col>
            <ResultsDisplay result={result} />
          </Col>
        </Row>
      )}
    </Container>
  );
}
