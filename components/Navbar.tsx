"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth";
import { useCart } from "@/context/cart";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      className={[
        "text-sm font-medium",
        active ? "text-zinc-900" : "text-zinc-600 hover:text-zinc-900",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { user, token, logout, isLoading } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-zinc-900">
          FakeStore Shop
        </Link>

        <nav className="flex items-center gap-4">
          <NavLink href="/">Produk</NavLink>
          <NavLink href="/cart">Keranjang ({totalItems})</NavLink>
          <NavLink href="/profile">Profile</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {!isLoading && token && user ? (
            <>
              <span className="hidden text-sm text-zinc-600 sm:block">
                {user.username}
              </span>
              <button
                onClick={logout}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

