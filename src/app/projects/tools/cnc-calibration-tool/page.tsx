"use client";
import React from "react";
import LayoutContainer from "@/components/LayoutContainer";
import StepsPerMmSection from "./StepsPerMmSection";
import FlowCompensationSection from "./FlowCompensationSection";

/**
 * Functional component for CNC Calibration Tool.
 * Provides calculators and resources for calibrating 3D printers and CNC machines.
 * Uses separate components for each calculator section for better code organization.
 */
const CncCalibrationTool: React.FC = () => {
  return (
    <LayoutContainer>
      <div className="py-4 px-4">
        {/* Page header with title and description */}
        <div className="mb-4">
          <div className="w-full">
            <h1 className="text-3xl font-bold text-blue-600 mb-3">
              CNC Calibration Tool
            </h1>
            <div className="bg-gray-100 p-4 rounded mb-4">
              <h2 className="text-lg font-semibold">Calibration Overview</h2>
              <p className="mb-0">
                Calibration is critical to 3D printer, and other CNC machine,
                accuracy. These calculators and resources will allow you to
                calibrate your printer or router for optimal results.
              </p>
            </div>
          </div>
        </div>{" "}
        {/* Steps Per MM Section - imported as separate component */}
        <div className="mb-5">
          <StepsPerMmSection />
        </div>
        {/* Flow Compensation Section - imported as separate component */}
        <div className="mb-5">
          <FlowCompensationSection />
        </div>
      </div>
    </LayoutContainer>
  );
};

export default CncCalibrationTool;
