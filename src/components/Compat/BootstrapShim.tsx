import React from "react";
import clsx from "clsx";

// Minimal compatibility shims for react-bootstrap components used during Tailwind migration.
// These are intentionally lightweight — they render semantic HTML elements with Tailwind
// classes that approximate Bootstrap layout and components. Convert components to
// Tailwind-native markup and styles incrementally and then remove this shim.

export const Container: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={clsx("max-w-7xl mx-auto px-4", className)}>{children}</div>
);

export const Row: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={clsx("flex flex-wrap -mx-2", className)}>{children}</div>
);

export const Col: React.FC<React.PropsWithChildren<{ sm?: number; md?: number; lg?: number; className?: string }>> = ({ children, className = "" }) => (
  <div className={clsx("px-2", className)}>{children}</div>
);

const BaseCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={clsx("rounded shadow-sm bg-white text-black dark:bg-gray-800 dark:text-white p-4", className)}>{children}</div>
);

const CardHeader: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={clsx("px-3 py-2 border-b", className)}>{children}</div>
);

const CardBody: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={clsx("p-3", className)}>{children}</div>
);

const CardFooter: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={clsx("px-3 py-2 border-t", className)}>{children}</div>
);

export const Card = Object.assign(BaseCard, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

type Variant = "primary" | "light" | "outline-secondary" | "outline-danger" | "danger" | string;

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }> = ({ variant, className, ...props }) => {
  const variantClasses = (() => {
    switch (variant) {
      case "light":
        return "bg-white text-black border";
      case "outline-danger":
        return "border border-red-600 text-red-600 bg-transparent";
      case "danger":
        return "bg-red-600 text-white";
      case "primary":
      default:
        return "bg-primary text-white";
    }
  })();

  return (
    <button
      {...props}
      className={clsx("inline-flex items-center justify-center px-3 py-1.5 rounded hover:opacity-90 disabled:opacity-50", variantClasses, className)}
    />
  );
};

export const Table: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={clsx("overflow-auto", className)}>
    <table className="min-w-full text-left text-sm">{children}</table>
  </div>
);

export const Form: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <form className={className}>{children}</form>
);

export const Alert: React.FC<
  React.PropsWithChildren<{ variant?: Variant; dismissible?: boolean; onClose?: () => void; className?: string }>
> = ({ children, variant, dismissible, onClose, className = "" }) => {
  const variantClass = variant === "danger" ? "bg-red-50 text-red-800" : "bg-gray-100";
  return (
    <div className={clsx("p-3 rounded flex items-start justify-between", variantClass, className)}>
      <div className="flex-1">{children}</div>
      {dismissible ? (
        <button aria-label="Close" onClick={onClose} className="ml-3 text-sm opacity-80">×</button>
      ) : null}
    </div>
  );
};

export const Badge: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <span className={clsx("inline-block px-2 py-0.5 text-xs font-medium rounded", className)}>{children}</span>
);

export const ListGroup: React.FC<React.PropsWithChildren<{ className?: string; variant?: string }>> = ({ children, className = "", variant }) => (
  <ul className={clsx(variant === "flush" ? "" : "divide-y divide-gray-200", className)}>{children}</ul>
);

export default {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Alert,
  Badge,
  ListGroup,
};
