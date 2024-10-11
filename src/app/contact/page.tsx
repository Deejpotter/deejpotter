"use client";

import { FormEvent, ReactElement, useState } from "react";

// The contact page component. Has a form to submit feedback.
// The form uses Netlify forms for form submission.

// The Next.js Runtime v5 and above does not support Netlify forms out of the box because
// it does not generate fully-static HTML pages. Instead, relevant pages are pre-rendered
// at build time and stored in Next.js' own cache for serving. This means that form tags
// and attributes are not written to static HTML files at deployment, and cannot be the
// form's target page. Any Netlify Forms-related attributes set in these pages have no effect.

// To work around this, I use the __forms.html endpoint to handle form submissions.
// Reference: https://docs.netlify.com/frameworks/next-js/overview/#netlify-forms-compatibility

// Define the shape of our form data
interface FormData {
  message: string;
  email: string;
}

export default function Contact(): ReactElement {
  // State variables to track form submission status and form data
  const [formStatus, setFormStatus] = useState<string | null>(null); // null, "success", or "error".
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message if any.
  const [formData, setFormData] = useState<FormData>({
    message: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to validate email format
  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  // Function to validate the entire form
  const validateForm = (): boolean => {
    if (formData.message.trim().length < 10) {
      setErrorMessage("Message must be at least 10 characters long.");
      return false;
    }
    if (formData.email && !validateEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  // Function to handle input changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Function to handle form submission
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (!validateForm()) return;

    setIsLoading(true);
    setFormStatus(null);
    setErrorMessage(null);

    try {
      // Convert formData to URLSearchParams
      const formDataParams = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        formDataParams.append(key, value);
      });

      // Send form data to the server
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formDataParams.toString(),
      });

      if (response.ok) {
        // Handle success notification here
        setFormStatus("success");
        setErrorMessage(null);
        setFormData({ message: "", email: "" }); // Clear form fields
      } else {
        // Handle server error notification here
        throw new Error("Server error");
      }
    } catch (error) {
      // Handle network error notification here
      setFormStatus("error");
      setErrorMessage(
        error instanceof Error && error.message === "Server error"
          ? "Failed to submit the form. Please try again."
          : "An error occurred while submitting the form. Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
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
          {/* Display success or error message based on form submission status */}
          <div aria-live="polite">
            {formStatus === "success" && (
              <div className="alert alert-success mt-3">
                Form submitted successfully!
              </div>
            )}
            {formStatus === "error" && errorMessage && (
              <div className="alert alert-danger mt-3">{errorMessage}</div>
            )}
          </div>
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
                value={formData.message}
                onChange={handleInputChange}
                minLength={10}
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
                value={formData.email}
                onChange={handleInputChange}
              ></input>
            </div>
            <div className="form-group pb-2">
              <button
                className="btn btn-info shadow"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Submitting...
                  </>
                ) : (
                  "Submit form"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
