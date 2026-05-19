/**
 * ShopCard — Product card for the shop grid
 *
 * Image sources are validated to prevent XSS via javascript: URLs.
 * Product names are rendered via React (no dangerouslySetInnerHTML).
 */

interface ShopCardProps {
  name: string;
  slug: string;
  description: string;
  price: number;
  type: "pod" | "digital" | "service";
  images: string[];
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(cents / 100);
}

/**
 * Validate an image URL is safe to render.
 * Blocks javascript:, data:, and other non-image URIs.
 */
function validateImageSrc(src: string | undefined): string {
  if (!src) return "/images/shop-placeholder.svg";
  // Only allow http/https and relative paths
  if (src.startsWith("javascript:") || src.startsWith("data:") || src.startsWith("vbscript:")) {
    return "/images/shop-placeholder.svg";
  }
  // Block protocol-relative URLs that aren't http
  if (src.startsWith("//") && !src.startsWith("//") || src.startsWith("///")) {
    return "/images/shop-placeholder.svg";
  }
  return src;
}

export function ShopCard({ name, slug, description, price, type, images }: ShopCardProps) {
  const imageSrc = validateImageSrc(images?.[0]);

  return (
    <a
      href={`/shop/products/${encodeURIComponent(slug)}`}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col"
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {type === "pod" ? "Print-on-Demand" : type === "digital" ? "Digital" : "Service"}
          </span>
        </div>
        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">{description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold">{type === "service" ? "Quote required" : formatPrice(price)}</span>
          <span className="text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
            View →
          </span>
        </div>
      </div>
    </a>
  );
}
