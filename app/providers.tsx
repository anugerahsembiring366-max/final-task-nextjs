"use client";

import { AuthProvider } from "@/context/auth";
import { CartProvider } from "@/context/cart";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}

