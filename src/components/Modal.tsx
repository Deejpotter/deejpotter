"use client";
import React, { useState, useEffect, useRef } from "react";

const Modal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

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

  const closeModal = () => {
    setIsModalOpen(false);
    // Return focus to the button that opened the modal
    if (openButtonRef.current) {
      openButtonRef.current.focus();
    }
  };

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
      >
        Open Modal
      </button>
      
      {isModalOpen && (
        <div
          className="modal show d-block"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          onClick={handleOverlayClick}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog" ref={modalRef}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modal-title">
                  Modal Title
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p id="modal-description">Modal body text goes here.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
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
        </div>
      )}
    </div>
  );
};

export default Modal;
