"use client";

import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

const messageChannels = [
  {
    title: "Contact form",
    description:
      "Best for project briefs, redesign requests, and anything that needs a clear written starting point.",
    href: "#contact-form",
    label: "Use the form below",
  },
  {
    title: "LinkedIn",
    description:
      "Good for direct professional messages if you would rather start there than by email.",
    href: "https://www.linkedin.com/in/daniel-potter-5224a4119",
    label: "Message on LinkedIn",
    external: true,
  },
  {
    title: "Facebook",
    description:
      "An easy option if social messaging is the simplest way to start the conversation.",
    href: "https://www.facebook.com/deej.potter.7/",
    label: "Open Facebook profile",
    external: true,
  },
];

type ContactFormData = z.infer<typeof contactFormSchema>;

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

  const onSubmit = async (data: ContactFormData) => {
    setFormStatus("submitting");
    setErrorMessage(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const appEnv = process.env.NEXT_PUBLIC_ENV;
      const isDevelopment =
        appEnv === "development" || process.env.NODE_ENV === "test";

      if (!backendUrl) {
        if (!isDevelopment) {
          setFormStatus("error");
          setErrorMessage(
            "Contact form is not configured. Please contact the site administrator."
          );
          return;
        }

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
        reset();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setFormStatus("error");
        setErrorMessage(
          errorData.message || "Failed to submit the form. Please try again."
        );
      }
    } catch {
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
          Start with a message
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl">
          If you want help with a website, redesign, custom page, or a small
          technical tool, send me a message here. I prefer to begin through
          text so we can sort out the goals, scope, and next steps clearly.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-3xl">
          I do not publish phone or physical contact details on the site. Email,
          forms, social messaging, and freelance-platform messages are the best
          way to start.
        </p>
      </section>

      <section className="mb-10">
        <div className="grid gap-6 md:grid-cols-3">
          {messageChannels.map((channel) => (
            <div
              key={channel.title}
              className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md"
            >
              <h2 className="text-lg font-semibold mb-2">{channel.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                {channel.description}
              </p>
              <a
                href={channel.href}
                {...(channel.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex items-center bg-primary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-full transition-transform hover:scale-105"
              >
                {channel.label}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-gray-600 dark:text-gray-400 max-w-3xl">
          Fiverr and Upwork are sensible options too. I have kept the public
          site ready for that text-first workflow, and can add those profile
          links here once the preferred platforms are settled.
        </p>
      </section>

      <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-10">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
            <h2 className="text-lg font-semibold mb-2">Best for</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
              Website design, website development, landing pages, portfolio
              sites, and practical custom tools.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
            <h2 className="text-lg font-semibold mb-2">Send me</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
              A short summary of what you need, who it is for, and whether this
              is a fresh build, redesign, or improvement to something existing.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
            <h2 className="text-lg font-semibold mb-2">Preferred contact</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
              Written conversation first. That keeps the process simpler and
              makes it easier to define the job properly.
            </p>
          </div>
        </div>

        <form id="contact-form" onSubmit={handleSubmit(onSubmit)}>
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
              {formStatus === "submitting" ? "Submitting..." : "Send message"}
            </button>
          </div>
        </form>

        {formStatus === "success" && (
          <div className="mt-6 p-4 rounded-lg bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
            Message sent successfully. I will reply as soon as I can.
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
