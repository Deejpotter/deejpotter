import React from 'react';

const meta = {
  title: 'Debug/HealthCheck',
};

export default meta;

export const TailwindHealth = () => (
  <div className="p-8">
    <div className="bg-gray-800 text-white p-4 rounded">Tailwind bg-gray-800 — should be dark green/gray</div>
    <div className="mt-4 text-primary">Tailwind custom color primary — should be green</div>
    <button className="btn btn-primary mt-4">Button (btn-primary)</button>
  </div>
);
