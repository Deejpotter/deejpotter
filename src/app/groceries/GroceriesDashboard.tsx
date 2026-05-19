"use client";

/**
 * GroceriesDashboard — Spending charts and order list
 */

import { useState, useEffect, useCallback } from "react";

interface OrderSummary {
  order_number: string;
  date: string;
  store_name: string;
  total: number;
  item_count: number;
}

interface SpendingSummary {
  total_spend: number;
  total_orders: number;
  by_store: Record<string, number>;
  by_category: Record<string, number>;
  by_month: Record<string, number>;
}

export function GroceriesDashboard({ refreshKey }: { refreshKey: number }) {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [summary, setSummary] = useState<SpendingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/groceries/list");
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
        setSummary(data.summary || null);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load, refreshKey]);

  const topCategories = summary ? Object.entries(summary.by_category).slice(0, 10) : [];
  const monthLabels = summary ? Object.keys(summary.by_month) : [];
  const monthValues = summary ? Object.values(summary.by_month) : [];
  const maxMonth = monthValues.length ? Math.max(...monthValues) : 1;
  const maxCat = topCategories.length ? Math.max(...topCategories.map(([, v]) => v)) : 1;

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard label="Total spent" value={summary ? `$${summary.total_spend.toFixed(2)}` : "—"} />
        <OverviewCard label="Orders" value={summary ? String(summary.total_orders) : "—"} />
        <OverviewCard label="Avg per order" value={summary && summary.total_orders > 0 ? `$${(summary.total_spend / summary.total_orders).toFixed(2)}` : "—"} />
        <OverviewCard label="Categories" value={summary ? String(Object.keys(summary.by_category).length) : "—"} />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly trend */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="font-semibold mb-4">Monthly spending</h2>
          {monthLabels.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet.</p>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {monthLabels.map((label, i) => {
                const val = monthValues[i] ?? 0;
                const height = Math.max(8, (val / maxMonth) * 100);
                const shortLabel = label.replace(/^\d{4}-/, "");
                return (
                  <div key={label} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-500">${Math.round(val)}</span>
                    <div
                      className="w-full rounded-t bg-primary/60 hover:bg-primary transition-colors cursor-pointer"
                      style={{ height: `${height}%`, minHeight: "4px" }}
                      title={`${label}: $${val.toFixed(2)}`}
                    />
                    <span className="text-[10px] text-gray-500">{shortLabel}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Category breakdown */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="font-semibold mb-4">Top categories</h2>
          {topCategories.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet.</p>
          ) : (
            <div className="space-y-2">
              {topCategories.map(([cat, val]) => {
                const pct = (val / maxCat) * 100;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="truncate">{cat}</span>
                      <span className="font-mono text-xs">${val.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <div className="h-full rounded-full bg-purple-500/60" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Order list */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-semibold">Orders ({orders.length})</h2>
          {loading && <span className="text-xs text-gray-400">Loading...</span>}
        </div>
        {orders.length === 0 && !loading ? (
          <div className="px-6 py-8 text-center text-sm text-gray-400">
            No orders imported yet. Upload a Woolworths PDF above.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {orders.map((order) => (
              <div key={order.order_number}>
                <button
                  onClick={() => setExpanded(expanded === order.order_number ? null : order.order_number)}
                  className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div>
                    <span className="font-medium text-sm">{order.date}</span>
                    <span className="text-xs text-gray-500 ml-2">#{order.order_number.slice(-6)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{order.item_count} items</span>
                    <span className="text-sm font-semibold">${order.total.toFixed(2)}</span>
                    <span className="text-xs text-gray-400">{expanded === order.order_number ? "▲" : "▼"}</span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function OverviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
