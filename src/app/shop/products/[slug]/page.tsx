/**
 * /shop/products/[slug] — Product detail page
 *
 * Server-rendered product page. Fetches product by slug from the MongoDB API.
 * Supports POD, digital, and service product types.
 */

import { notFound } from "next/navigation";
import { AddToCartButton } from "./AddToCartButton";

interface ProductDetail {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  type: "pod" | "digital" | "service";
  images: string[];
  tags: string[];
  gelatoProductId?: string;
  downloadUrl?: string;
  serviceConfig?: {
    requiresQuote: boolean;
    deliveryDays?: number;
  };
}

async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/shop/products?limit=100`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const products: ProductDetail[] = data.products || [];
    return products.find((p) => p.slug === slug) || null;
  } catch {
    return null;
  }
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(cents / 100);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Deej Potter Shop`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Deej Potter Shop`,
      description: product.description.slice(0, 160),
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const imageSrc = product.images?.[0] || "/images/shop-placeholder.svg";
  const typeLabel =
    product.type === "pod" ? "Print-on-Demand" : product.type === "digital" ? "Digital Download" : "Service";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {typeLabel}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            {product.type === "service" ? (
              <span className="text-2xl font-bold">Quote required</span>
            ) : (
              <>
                <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
              </>
            )}
          </div>

          <div className="prose prose-sm dark:prose-invert mb-8 max-w-none">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Service-specific info */}
          {product.type === "service" && product.serviceConfig && (
            <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm">
              {product.serviceConfig.deliveryDays && (
                <p className="text-gray-600 dark:text-gray-400">
                  Estimated delivery: <strong>{product.serviceConfig.deliveryDays} business days</strong>
                </p>
              )}
              {product.serviceConfig.requiresQuote && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  This service requires a custom quote. Contact me to discuss your project.
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Add to Cart / CTA */}
          <div className="mt-auto">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
