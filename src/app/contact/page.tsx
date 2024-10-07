"use client";

import { ok } from "assert";
import { headers } from "next/headers";
import { FormEvent, ReactElement, useState } from "react";

// The contact page component. Has a form to submit feedback.
// The form uses Netlify forms for form submission.

// The Next.js Runtime v5 and above does not support Netlify forms out of the box because
// it does not generate fully-static HTML pages. Instead, relevant pages are pre-rendered
// at build time and stored in Next.js’ own cache for serving. This means that form tags
// and attributes are not written to static HTML files at deployment, and cannot be the
// form’s target page. Any Netlify Forms-related attributes set in these pages have no effect.

// To work around this, we can use the __forms.html endpoint to handle form submissions.
// Reference: https://docs.netlify.com/frameworks/next-js/overview/#netlify-forms-compatibility
export default function Contact(props: any): ReactElement {
  // State variables to track form submission status
  const [formStatus, setFormStatus] = useState<string | null>(null); // null, "success", or "error".
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message if any.

  // Function to handle form submission
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData(event.target as HTMLFormElement); // Collect form data

    try {
      // Send form data to the server
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (response.ok) {
        // Handle success notification here
        setFormStatus("success");
        setErrorMessage(null);
      } else {
        // Handle server error notification here
        setFormStatus("error");
        setErrorMessage("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      // Handle network error notification here
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
            name="contact"
            method="post"
            className="card shadow p-2 bg-secondary text-light"
            onSubmit={handleFormSubmit}
            data-netlify="true"
            netlify-honeypot="bot-field"
          >
            <div className="form-group" hidden>
              <label htmlFor="bot-field">
                Don&apos;t fill this out if you&apos;re human:
              </label>
              <input type="text" id="bot-field" name="bot-field"></input>
            </div>
            <input type="hidden" name="form-name" value="contact"></input>
            <div className="form-group pb-2">
              <label htmlFor="message">Enter Message (required):</label>
              <textarea
                required
                id="message"
                className="form-control shadow"
                name="message"
              ></textarea>
            </div>
            <div className="form-group pb-2">
              <label htmlFor="email">
                Enter your email address <br></br>(optional - if you want a
                reply):
              </label>
              <input
                type="email"
                id="email"
                className="form-control shadow"
                name="email"
              ></input>
            </div>
            <div className="form-group pb-2">
              <button className="btn btn-info shadow" type="submit">
                Submit form
              </button>
            </div>
          </form>
          {/* Display success or error message based on form submission status */}
          {formStatus === "success" && (
            <div className="alert alert-success mt-3">
              Form submitted successfully!
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
