"use client";
import React, { useState } from "react";

const Modal = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setIsModalOpen(!isModalOpen)}>Open Modal</button>
      <div className={`modal ${isModalOpen ? "show" : ""}`}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal Title</h5>
              <button
                type="button"
                className="close"
                onClick={() => setIsModalOpen(false)}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Modal body text goes here.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsModalOpen(false)}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
