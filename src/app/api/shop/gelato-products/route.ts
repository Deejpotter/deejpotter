/**
 * /api/shop/gelato-products — Gelato product catalog proxy
 *
 * Fetches the Gelato product catalog and returns it for the shop UI.
 * Uses the GELATO_API_KEY from .env
 */

import { NextResponse } from "next/server";

const GELATO_KEY = process.env.GELATO_API_KEY || "";
const GELATO_API = "https://api.gelato.com/v2";

export async function GET(request: Request) {
  if (!GELATO_KEY) {
    return NextResponse.json(
      { error: "GELATO_API_KEY not set in environment." },
      { status: 500 }
    );
  }

  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const limit = url.searchParams.get("limit") || "20";

    let path = `/products?limit=${limit}`;
    if (category) path += `&category=${encodeURIComponent(category)}`;

    const res = await fetch(`${GELATO_API}${path}`, {
      headers: {
        "X-API-KEY": GELATO_KEY,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || `Gelato HTTP ${res.status}` },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Gelato products error:", error);
    return NextResponse.json({ error: "Could not fetch Gelato products." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!GELATO_KEY) {
    return NextResponse.json(
      { error: "GELATO_API_KEY not set in environment." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const productId = body.productId;
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    const res = await fetch(`${GELATO_API}/products/${productId}`, {
      headers: {
        "X-API-KEY": GELATO_KEY,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || `Gelato HTTP ${res.status}` },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Gelato product detail error:", error);
    return NextResponse.json({ error: "Could not fetch product." }, { status: 500 });
  }
}
