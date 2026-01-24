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
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const appEnv = process.env.NEXT_PUBLIC_ENV;
      const isDevelopment =
        appEnv === "development" || process.env.NODE_ENV === "test";

      // Validate backend URL is configured in production
      if (!backendUrl) {
        if (!isDevelopment) {
          setFormStatus("error");
          setErrorMessage(
            "Contact form is not configured. Please contact the site administrator."
          );
          return;
        }
        // In development and test, default to localhost and warn developer
        console.warn(
          "NEXT_PUBLIC_BACKEND_URL not set, using http://localhost:3001"
        );
      }

      const finalUrl = backendUrl || "http://localhost:3001";
      const response = await fetch(`${finalUrl}/api/contact`, {
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
    <div>
      <section className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Have some questions or feedback for me? Fill in the form and I'll get
          back to you as soon as I can.
        </p>
      </section>

      <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Name (required):
            </label>
            <input
              type="text"
              id="name"
              className={`w-full p-3 rounded bg-gray-50 border ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary`}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Email address (required):
            </label>
            <input
              type="email"
              id="email"
              className={`w-full p-3 rounded bg-gray-50 border ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Message (required):
            </label>
            <textarea
              id="message"
              className={`w-full p-3 rounded bg-gray-50 border ${
                errors.message
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary`}
              rows={6}
              {...register("message")}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-2">
                {errors.message.message}
              </p>
            )}
          </div>

          <div>
            <button
              className="bg-primary hover:bg-opacity-80 text-white font-bold py-3 px-6 rounded-full transition-transform hover:scale-105 disabled:opacity-50"
              type="submit"
              disabled={formStatus === "submitting"}
            >
              {formStatus === "submitting" ? "Submitting..." : "Submit Form"}
            </button>
          </div>
        </form>

        {/* Display success or error message based on form submission status */}
        {formStatus === "success" && (
          <div className="mt-6 p-4 rounded-lg bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
            Form submitted successfully! I'll get back to you soon.
          </div>
        )}
        {formStatus === "error" && errorMessage && (
          <div className="mt-6 p-4 rounded-lg bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800">
            {errorMessage}
          </div>
        )}
      </section>
    </div>
  );
}
