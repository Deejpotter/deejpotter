"use client";

import { useState } from "react";

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

type Lead = {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  source?: string;
  message: string;
  status: "new" | "reviewed" | "replied" | "closed";
  leadContext?: LeadContext;
  createdAt: string;
  updatedAt: string;
};

const statusOptions: Lead["status"][] = ["new", "reviewed", "replied", "closed"];

export default function LeadInbox({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateLead = async (id: string, status: Lead["status"]) => {
    setSavingId(id);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || "Could not update lead.");
        return;
      }

      setLeads((current) =>
        current.map((lead) => (lead.id === id ? { ...lead, status: payload.status, updatedAt: payload.updatedAt } : lead))
      );
    } catch {
      setError("Could not update lead.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          No contact leads yet.
        </div>
      ) : (
        leads.map((lead) => (
          <article key={lead.id} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 p-6 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {lead.email}
                  {lead.company ? ` - ${lead.company}` : ""}
                  {lead.projectType ? ` - ${lead.projectType}` : ""}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Source: {lead.source || lead.leadContext?.source || "unknown"} - {new Date(lead.createdAt).toLocaleString()}
                </p>
              </div>
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary dark:bg-primary/20 dark:text-white">
                {lead.status}
              </span>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">Message</h3>
                  <p className="whitespace-pre-wrap rounded-2xl border border-gray-200 bg-gray-50 p-4 text-gray-800 dark:border-gray-700 dark:bg-gray-950/40 dark:text-gray-200">
                    {lead.message}
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">Attribution</h3>
                  <div className="grid gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-950/40 dark:text-gray-300 sm:grid-cols-2">
                    <div><strong>Current path:</strong> {lead.leadContext?.currentPath || "-"}</div>
                    <div><strong>Referrer:</strong> {lead.leadContext?.referrer || "-"}</div>
                    <div><strong>UTM source:</strong> {lead.leadContext?.utmSource || "-"}</div>
                    <div><strong>UTM medium:</strong> {lead.leadContext?.utmMedium || "-"}</div>
                    <div><strong>UTM campaign:</strong> {lead.leadContext?.utmCampaign || "-"}</div>
                    <div><strong>UTM term/content:</strong> {lead.leadContext?.utmTerm || "-"} / {lead.leadContext?.utmContent || "-"}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950/40">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div><strong>Updated:</strong> {new Date(lead.updatedAt).toLocaleString()}</div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">Change status</label>
                  <div className="grid gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateLead(lead.id, status)}
                        disabled={savingId === lead.id || lead.status === status}
                        className={`rounded-full px-4 py-2 text-left text-sm font-semibold transition ${lead.status === status ? "bg-primary text-white" : "bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"}`}
                      >
                        {savingId === lead.id && lead.status !== status ? "Saving..." : status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
