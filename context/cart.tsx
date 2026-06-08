"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/fakestore";

export type CartItem = {
  product: Product;
  qty: number;
};

type CartState = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  setQty: (productId: number, qty: number) => void;
  clearCart: () => void;
};

const LS_CART_KEY = "fakestore_cart";

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_CART_KEY);
      setItems(saved ? (JSON.parse(saved) as CartItem[]) : []);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_CART_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartState>(() => {
    const totalItems = items.reduce((sum, it) => sum + it.qty, 0);
    const subtotal = items.reduce((sum, it) => sum + it.qty * it.product.price, 0);

    return {
      items,
      totalItems,
      subtotal,
      addToCart: (product, qty = 1) => {
        setItems((prev) => {
          const found = prev.find((p) => p.product.id === product.id);
          if (found) {
            return prev.map((p) =>
              p.product.id === product.id ? { ...p, qty: p.qty + qty } : p,
            );
          }
          return [...prev, { product, qty }];
        });
      },
      removeFromCart: (productId) => {
        setItems((prev) => prev.filter((p) => p.product.id !== productId));
      },
      setQty: (productId, qty) => {
        const safeQty = Number.isFinite(qty) ? Math.max(1, Math.floor(qty)) : 1;
        setItems((prev) =>
          prev.map((p) => (p.product.id === productId ? { ...p, qty: safeQty } : p)),
        );
      },
      clearCart: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}

