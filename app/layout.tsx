// app/layout.tsx
import Link from 'next/link';
import { cookies } from 'next/headers';

// BARIS INI WAJIB ADA AGAR TAILWIND CSS AKTIF DAN TAMPILAN TIDAK RUSAK/POLOS
import './globals.css'; 

export const metadata = {
  title: 'Toko Online Sembiring',
  description: 'Project Tugas Akhir Toko Online Modern Next.js',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Cek status login user dari cookie di sisi server
  const cookieStore = await cookies();
  const token = cookieStore.get('user_token')?.value;
  const username = cookieStore.get('username')?.value;

  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col m-0 p-0">
        
        {/* NAVBAR HANYA MUNCUL SETELAH USER BERHASIL LOGIN */}
        {token && (
          <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛒</span>
                <span className="font-extrabold text-xl tracking-tight">
                  Online Shop<span className="text-indigo-200 font-medium text-xs ml-1">SMB</span>
                </span>
              </div>
              
              <nav className="flex items-center gap-6 text-sm font-semibold">
                <Link href="/" className="hover:text-indigo-200 transition-colors">🏠 List Produk</Link>
                <Link href="/cart" className="hover:text-indigo-200 transition-colors">🛒 Keranjang</Link>
                <Link href="/profile" className="hover:text-indigo-200 transition-colors font-mono">👤 {username}</Link>
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
