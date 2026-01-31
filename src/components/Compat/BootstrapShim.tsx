import React from "react";

// Minimal compatibility shims for react-bootstrap components used during Tailwind migration.
// These are intentionally lightweight — they render semantic HTML elements with Tailwind
// classes that approximate Bootstrap layout and components. Convert components to
// Tailwind-native markup and styles incrementally and then remove this shim.

export const Container: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-4 ${className}`}>{children}</div>
);

export const Row: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`flex flex-wrap -mx-2 ${className}`}>{children}</div>
);

export const Col: React.FC<React.PropsWithChildren<{ sm?: number; md?: number; lg?: number; className?: string }>> = ({ children, className = "" }) => (
  <div className={`px-2 ${className}`}>{children}</div>
);

export const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`rounded shadow-sm bg-white text-black dark:bg-gray-800 dark:text-white p-4 ${className}`}>{children}</div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center px-3 py-1.5 rounded bg-primary text-white hover:opacity-90 disabled:opacity-50 ${props.className ?? ""}`}
  />
);

export const Table: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`overflow-auto ${className}`}>
    <table className="min-w-full text-left text-sm">{children}</table>
  </div>
);

export const Form: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <form className={className}>{children}</form>
);

export const Alert: React.FC<React.PropsWithChildren<{ variant?: string; className?: string }>> = ({ children, className = "" }) => (
  <div className={`p-3 rounded ${className}`}>{children}</div>
);

export const Badge: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${className}`}>{children}</span>
);

export const ListGroup: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <ul className={`divide-y divide-gray-200 ${className}`}>{children}</ul>
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
