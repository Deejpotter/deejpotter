"use client";

import { useState } from "react";
import AdminSettings from "./AdminSettings";
import ServiceConfigEditor from "./ServiceConfigEditor";

const TABS = [
  { id: "business", label: "Business Settings" },
  { id: "service", label: "Service Config" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("business");

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 pt-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition -mb-[2px] ${
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "business" ? <AdminSettings /> : <ServiceConfigEditor />}
    </div>
  );
}
