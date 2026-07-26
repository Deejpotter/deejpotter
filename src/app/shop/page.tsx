/**
 * /shop — Shop landing page
 */

import { ShopCard } from "@/components/ShopCard";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  type: "digital" | "service";
  images: string[];
  tags: string[];
  published: boolean;
}

async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/shop/products?published=true&limit=50`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Shop | Deej Potter",
  description: "Digital tools and services from Deej Potter.",
  openGraph: {
    title: "Shop | Deej Potter",
    description: "Digital downloads and fabrication services.",
  },
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Shop</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Digital downloads and fabrication services. Every purchase supports independent making.
        </p>
      </section>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 mb-2">Shop coming soon</p>
          <p className="text-sm text-gray-400">Products are being added. Check back shortly.</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ShopCard
              key={product._id}
              name={product.name}
              slug={product.slug}
              description={product.description}
              price={product.price}
              type={product.type}
              images={product.images}
            />
          ))}
        </div>
      )}
    </main>
  );
}
