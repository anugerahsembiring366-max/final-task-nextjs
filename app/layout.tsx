// app/layout.tsx
import { cookies } from 'next/headers';
import Link from 'next/link';
import './globals.css'; 
import { getCart } from '@/serveraction/action'; // Mengambil fungsi hitung keranjang dari server action

export const metadata = {
  title: 'Toko Online Sembiring',
  description: 'Project Tugas Akhir Toko Online Modern Next.js',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 1. Ambil data login dan isi keranjang langsung di server via Cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('user_token')?.value;
  const username = cookieStore.get('username')?.value || 'guest';

  // 2. Hitung jumlah total barang di keranjang khusus milik user yang sedang aktif
  const cartItems = await getCart();
  const totalItems = cartItems.length;

  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col m-0 p-0">
        
        {/* NAVBAR: Hanya muncul jika user sudah login di server */}
        {token && (
          <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <Link href="/" className="font-bold text-zinc-900 text-none text-lg">
                Online Shop SMB
              </Link>

              <nav className="flex items-center gap-6 font-semibold text-sm">
                <Link href="/" className="text-zinc-600 hover:text-zinc-900 text-none">Produk</Link>
                {/* 🚀 ANGKA INDIKATOR SEKARANG 100% AKURAT DARI SERVER COOKIE PER USER */}
                <Link href="/cart" className="text-zinc-600 hover:text-zinc-900 text-none">
                  Keranjang {totalItems > 0 ? `(${totalItems})` : ""}
                </Link>
                <Link href="/profile" className="text-zinc-600 hover:text-zinc-900 text-none font-mono">👤 {username}</Link>
              </nav>
            </div>
          </header>
        )}

        {/* CONTAINER UTAMA */}
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 box-border">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-12">
          © {new Date().getFullYear()} FakeStore Simulator. Crafted for Final Assignment.
        </footer>

      </body>
    </html>
  );
}
