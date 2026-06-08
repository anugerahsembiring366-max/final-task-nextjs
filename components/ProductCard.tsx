"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/fakestore";
import { useCart } from "@/context/cart";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col rounded-xl border bg-white p-4">
      <Link href={`/product/${product.id}`} className="group">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-6 transition group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-zinc-900">{product.title}</h3>
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
        <button
          onClick={() => addToCart(product, 1)}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
        >
          + Keranjang
        </button>
      </div>
    </div>
  );
}

