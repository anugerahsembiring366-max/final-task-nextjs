"use client";

import type { Product } from "@/types/fakestore";
import { useCart } from "@/context/cart";

export default function AddToCartButton({
  product,
  qty = 1,
}: {
  product: Product;
  qty?: number;
}) {
  const { addToCart } = useCart();
  return (
    <button
      onClick={() => addToCart(product, qty)}
      className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
    >
      Tambah ke Keranjang
    </button>
  );
}

