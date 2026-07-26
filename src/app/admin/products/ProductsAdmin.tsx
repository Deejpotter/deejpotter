"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  type: "digital" | "service";
  published: boolean;
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  type: "digital" as "digital" | "service",
  published: false,
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed");
      setProducts(await res.json());
    } catch {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description,
          price: Math.round(parseFloat(form.price) * 100) || 0,
          type: form.type,
          published: form.published,
          images: ["/images/shop-placeholder.svg"],
          tags: [],
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setForm(emptyForm);
      load();
    } catch {
      setError("Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (product: Product) => {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product._id, published: !product.published }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    load();
  };

  if (loading) return <p className="text-gray-500">Loading products...</p>;

  return (
    <div className="space-y-10">
      <form onSubmit={handleCreate} className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="font-semibold text-lg">Add product</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-transparent"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-transparent"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
          <input
            className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-transparent sm:col-span-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-transparent"
            placeholder="Price (AUD)"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <select
            className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-transparent"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as "digital" | "service" })}
          >
            <option value="digital">Digital</option>
            <option value="service">Service</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Published
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2 font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Create product"}
        </button>
      </form>

      {products.length === 0 ? (
        <p className="text-gray-500">No products yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Published</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{p.type}</td>
                  <td className="px-4 py-3">${(p.price / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublished(p)}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.published
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => remove(p._id)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-sm text-gray-500">
        <Link href="/admin" className="text-primary hover:underline">← Back to dashboard</Link>
      </p>
    </div>
  );
}
