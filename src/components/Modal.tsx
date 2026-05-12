"use client";
import React, { useState, useEffect, useRef } from "react";

const Modal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const main = document.querySelector("main");

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      if (main) main.setAttribute("aria-hidden", "true");
    } else {
      document.body.style.overflow = "unset";
      if (main) main.removeAttribute("aria-hidden");
    }

    return () => {
      document.body.style.overflow = "unset";
      if (main) main.removeAttribute("aria-hidden");
    };
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    openButtonRef.current?.focus();
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    const focusableElements = modalElement.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
    );
    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) firstElement.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const firstFocusable = focusableElements[0] as HTMLElement;
      const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
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
    if (event.target === event.currentTarget) closeModal();
  };

  return (
    <div>
      <button
        ref={openButtonRef}
        onClick={() => setIsModalOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex items-center rounded-full bg-primary px-4 py-2 font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
      >
        Open Modal
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          onClick={handleOverlayClick}
        >
          <div
            ref={modalRef}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <h5 className="text-xl font-bold" id="modal-title">
                Modal Title
              </h5>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-xl text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={closeModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-5">
              <p id="modal-description" className="text-gray-700 dark:text-gray-300">
                Modal body text goes here.
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
              <button
                type="button"
                className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-full bg-primary px-4 py-2 font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
                onClick={() => closeModal()}
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
