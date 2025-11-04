"use client";

import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Contact form validation schema using Zod
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// The contact page component with React Hook Form integration
export default function Contact(): ReactElement {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  // Function to handle form submission
  const onSubmit = async (data: ContactFormData) => {
    setFormStatus("submitting");
    setErrorMessage(null);

    try {
      // TODO: Replace with actual backend URL from environment variable
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormStatus("success");
        reset(); // Clear the form
      } else {
        const errorData = await response.json().catch(() => ({}));
        setFormStatus("error");
        setErrorMessage(
          errorData.message || "Failed to submit the form. Please try again."
        );
      }
    } catch (error) {
      setFormStatus("error");
      setErrorMessage(
        "An error occurred while submitting the form. Please check your internet connection and try again."
      );
    }
  };

  return (
    <main className="container py-4">
      <div className="row">
        <div className="col-md">
          <h2>Have some questions or feedback for me?</h2>
          <p>
            Fill in the form with your info and I&apos;ll get back to you as
            soon as I can. I promise I&apos;ll only use this information to
            contact you about your feedback, I won&apos;t share it with anyone
            or use it for any other reason.
          </p>
        </div>
        <div className="col-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card shadow p-2 bg-secondary text-light"
          >
            <div className="form-group pb-2">
              <label htmlFor="name">Name (required):</label>
              <input
                type="text"
                id="name"
                className={`form-control shadow ${
                  errors.name ? "is-invalid" : ""
                }`}
                {...register("name")}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>

            <div className="form-group pb-2">
              <label htmlFor="email">Email address (required):</label>
              <input
                type="email"
                id="email"
                className={`form-control shadow ${
                  errors.email ? "is-invalid" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            <div className="form-group pb-2">
              <label htmlFor="message">Message (required):</label>
              <textarea
                id="message"
                className={`form-control shadow ${
                  errors.message ? "is-invalid" : ""
                }`}
                rows={5}
                {...register("message")}
              />
              {errors.message && (
                <div className="invalid-feedback">{errors.message.message}</div>
              )}
            </div>

            <div className="form-group pb-2">
              <button
                className="btn btn-info shadow"
                type="submit"
                disabled={formStatus === "submitting"}
              >
                {formStatus === "submitting" ? "Submitting..." : "Submit form"}
              </button>
            </div>
          </form>

          {/* Display success or error message based on form submission status */}
          {formStatus === "success" && (
            <div className="alert alert-success mt-3">
              Form submitted successfully! I&apos;ll get back to you soon.
            </div>
          )}
          {formStatus === "error" && errorMessage && (
            <div className="alert alert-danger mt-3">{errorMessage}</div>
          )}
        </div>
      </div>
    </main>
  );
}
