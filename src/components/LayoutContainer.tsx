import React from "react";

interface LayoutContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LayoutContainer = ({ children, className = "" }: LayoutContainerProps) => {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 sm:py-8 ${className}`.trim()}>
      {children}
    </div>
  );
};

export default LayoutContainer;
