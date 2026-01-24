import React from "react";
export default function FormError(props: { message?: string }) {
  const { message } = props;

  return (
    message && (
      <p className="mt-2 text-sm text-red-600 dark:text-red-500">{message}</p>
    )
  );
}
