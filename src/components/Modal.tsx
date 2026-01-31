"use client";
import React, { useState, useEffect, useRef } from "react";

const Modal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when modal is open
  // Also mark main content as aria-hidden for screen readers while modal is open
  useEffect(() => {
    const main = document.querySelector('main');

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      if (main) main.setAttribute('aria-hidden', 'true');
    } else {
      document.body.style.overflow = "unset";
      if (main) main.removeAttribute('aria-hidden');
    }

    return () => {
      document.body.style.overflow = "unset";
      if (main) main.removeAttribute('aria-hidden');
    };
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    // Return focus to the button that opened the modal
    if (openButtonRef.current) {
      openButtonRef.current.focus();
    }
  };

  // Focus management and keyboard handling
  useEffect(() => {
    if (!isModalOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Focus the first focusable element in the modal
    const focusableElements = modalElement.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
    );
    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) {
      firstElement.focus();
    }

    // Handle ESC key to close modal
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    // Focus trap: keep focus within modal
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const firstFocusable = focusableElements[0] as HTMLElement;
      const lastFocusable = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTab);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTab);
    };
  }, [isModalOpen]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Close modal if clicking on the overlay (not the modal content)
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <div>
      <button
        ref={openButtonRef}
        onClick={() => setIsModalOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        Open Modal
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          onClick={handleOverlayClick}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/10 focus:outline-none dark:bg-gray-900"
            ref={modalRef}
          >
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <div>
                <h5
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                  id="modal-title"
                >
                  Modal Title
                </h5>
                <p
                  className="mt-1 text-sm text-gray-600 dark:text-gray-300"
                  id="modal-description"
                >
                  Modal body text goes here.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="px-6 py-5 text-gray-800 dark:text-gray-200">
              <p>Modal body text goes here.</p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                onClick={() => {
                  // Handle save action here
                  closeModal();
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
