"use client";

import { ReactElement, useEffect, useState } from "react";
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
  company: z
    .string()
    .max(120, "Company or website must be less than 120 characters")
    .optional()
    .or(z.literal("")),
  projectType: z
    .enum([
      "website",
      "redesign",
      "custom-tool",
      "support",
      "other",
    ])
    .optional()
    .or(z.literal("")),
  source: z.string().max(120).optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

type LeadContext = {
  currentPath: string;
  referrer: string;
  source: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
};

// The contact form client component with React Hook Form integration
export default function ContactForm(): ReactElement {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [leadContext, setLeadContext] = useState<LeadContext>({
    currentPath: "/contact",
    referrer: "",
    source: "website",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const referrer = document.referrer || "";
    const utmSource = params.get("utm_source") || "";
    const utmMedium = params.get("utm_medium") || "";
    const utmCampaign = params.get("utm_campaign") || "";
    const utmTerm = params.get("utm_term") || "";
    const utmContent = params.get("utm_content") || "";

    const inferredSource =
      utmSource ||
      (referrer.includes("linkedin")
        ? "LinkedIn"
        : referrer.includes("facebook")
          ? "Facebook"
          : referrer.includes("google")
            ? "Google"
            : referrer
              ? new URL(referrer).hostname
              : "website");

    setLeadContext({
      currentPath: window.location.pathname,
      referrer,
      source: inferredSource,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
    });
  }, []);

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
      const payload = {
        ...data,
        leadContext,
      };
      const response = await fetch(`${finalUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

  const inputClass =
    "w-full rounded-xl border bg-gray-50 p-3 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white";

  return (
    <div>
      <section className="mb-12">
        <h1 className="mb-4 text-4xl font-extrabold lg:text-5xl">
          Get in Touch
        </h1>
        <p className="max-w-3xl text-lg text-gray-700 dark:text-gray-300">
          If you want help with a website, redesign, custom page, or a small
          technical tool, send me a message here. I prefer to begin through text
          so we can sort out the goals, scope, and next steps clearly.
        </p>
        <p className="mt-4 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          I keep the public flow simple, but I still capture source data behind
          the scenes so I know where good leads come from.
        </p>
      </section>

      <section className="rounded-2xl bg-white p-8 shadow-md dark:bg-gray-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Name (required):
              </label>
              <input
                type="text"
                id="name"
                className={`${inputClass} ${errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Email address (required):
              </label>
              <input
                type="email"
                id="email"
                className={`${inputClass} ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="company"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Company or website
              </label>
              <input
                type="text"
                id="company"
                placeholder="Optional"
                className={`${inputClass} ${errors.company ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                {...register("company")}
              />
              {errors.company && (
                <p className="mt-2 text-sm text-red-500">{errors.company.message as string}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="projectType"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Project type
              </label>
              <select
                id="projectType"
                className={`${inputClass} ${errors.projectType ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                {...register("projectType")}
              >
                <option value="">Select one</option>
                <option value="website">New website</option>
                <option value="redesign">Website redesign</option>
                <option value="custom-tool">Custom tool or calculator</option>
                <option value="support">Support / maintenance</option>
                <option value="other">Other</option>
              </select>
              {errors.projectType && (
                <p className="mt-2 text-sm text-red-500">{errors.projectType.message as string}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="source"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                How did you find me?
              </label>
              <select
                id="source"
                className={`${inputClass} ${errors.source ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                {...register("source")}
              >
                <option value="">Select one</option>
                <option value="website">Website / direct</option>
                <option value="google">Google search</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
                <option value="referral">Referral</option>
                <option value="blog">Blog post</option>
                <option value="other">Other</option>
              </select>
              {errors.source && (
                <p className="mt-2 text-sm text-red-500">{errors.source.message as string}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Message (required):
            </label>
            <textarea
              id="message"
              className={`${inputClass} min-h-[180px] ${errors.message ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
              rows={6}
              placeholder="Tell me what you need, what it is for, and what a good result looks like."
              {...register("message")}
            />
            {errors.message && (
              <p className="mt-2 text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-bold text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={formStatus === "submitting"}
            >
              {formStatus === "submitting" ? "Submitting..." : "Submit Form"}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              I usually reply best when I can see the goal, the website or company name, and roughly how you found the site.
            </p>
          </div>
        </form>

        {/* Display success or error message based on form submission status */}
        {formStatus === "success" && (
          <div className="mt-6 p-4 rounded-lg bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
            Form submitted successfully! I will get back to you soon.
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
