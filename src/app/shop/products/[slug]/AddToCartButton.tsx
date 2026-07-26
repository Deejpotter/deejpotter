"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  type: "digital" | "service";
  images: string[];
}

export function AddToCartButton({ product }: { product: CartProduct }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (product.type === "service") {
    return (
      <a
        href="/contact"
        className="inline-flex items-center justify-center w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
      >
        Request a quote →
      </a>
    );
  }

  const handleAdd = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      type: product.type,
      image: product.images?.[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      className={`inline-flex items-center justify-center w-full rounded-full px-6 py-3 text-sm font-semibold transition-all ${
        added
          ? "bg-green-600 text-white"
          : "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02]"
      }`}
    >
      {added ? "✓ Added to cart" : "Add to cart"}
    </button>
  );
}
