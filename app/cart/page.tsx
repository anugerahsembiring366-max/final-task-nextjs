// app/cart/page.tsx
import { getCart, updateQuantityAction, getProfile } from '@/serveraction/action';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Cart() {
  // 1. Proteksi Halaman
  const user = await getProfile();
  if (!user) {
    redirect('/login');
  }

  // 2. Ambil data keranjang belanja spesifik milik user aktif
  const cartItems = await getCart();
  
  // 3. Hitung total harga tagihan belanjaan
  const totalHarga = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    // UKURAN LEBAR KOTAK UTAMA DIKECILKAN MENJADI max-w-md AGAR COMPACT DI TENGAH
    <div className="space-y-4 max-w-md mx-auto py-4 md:py-6">
      
      {/* Tombol Navigasi Atas */}
      <div className="pb-1">
        <Link href="/" className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors text-none">
          ⬅ Lanjut Belanja Produk Lain
        </Link>
      </div>

      {/* Judul Halaman Lebih Kecil */}
      <h1 className="text-xl font-black text-slate-800 tracking-tight m-0 flex items-center gap-2">
        🛒 Keranjang Belanja
      </h1>

      {/* KONDISI JIKA KERANJANG KOSONG */}
      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <span className="text-4xl mb-2">🛒</span>
          <p className="text-slate-500 font-medium text-sm">Keranjang belanja Anda saat ini masih kosong.</p>
          <Link href="/" className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow transition-colors text-none">
            Mulai Belanja Sekarang
          </Link>
        </div>
      ) : (
        /* KONDISI JIKA KERANJANG ADA ISINYA (UKURAN KOMPONEN DI DALAMNYA SUDAH DIPANGKAS MINI) */
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="divide-y divide-slate-100 flex flex-col">
            {cartItems.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                
                {/* Gambar Produk Lebih Mini (w-12 h-12) */}
                <div className="w-12 h-12 bg-slate-50 rounded-lg p-1 flex items-center justify-center flex-shrink-0 border border-slate-100">
                  <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                </div>
                
                {/* Informasi Judul Lebih Ringkas & Teks Lebih Kecil */}
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="text-xs font-bold text-slate-800 truncate m-0">{item.title}</h3>
                  <div className="text-[11px] font-bold text-slate-400 mt-0.5">
                    Harga: <span className="text-orange-600 font-black">${item.price}</span>
                  </div>
                </div>
                
                {/* Tombol Kuantitas & Hapus Skala Kecil */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  
                  {/* Blok Tombol Plus-Minus Mini */}
                  <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-slate-50 shadow-sm">
                    {/* Tombol Kurang (Minus) */}
                    <form action={async () => { 'use server'; await updateQuantityAction(item.id, -1); }}>
                      <button type="submit" className="px-2 py-1 bg-white text-slate-700 font-extrabold text-xs hover:bg-slate-100 transition-colors border-0 border-r border-solid border-slate-300 cursor-pointer min-w-[24px]">
                        -
                      </button>
                    </form>
                    
                    {/* Teks Angka Quantity Mini */}
                    <span className="px-2 text-xs font-black text-slate-800 min-w-[14px] text-center">
                      {item.quantity}
                    </span>
                    
                    {/* Tombol Tambah (Plus) */}
                    <form action={async () => { 'use server'; await updateQuantityAction(item.id, 1); }}>
                      <button type="submit" className="px-2 py-1 bg-white text-slate-700 font-extrabold text-xs hover:bg-slate-100 transition-colors border-0 border-l border-solid border-slate-300 cursor-pointer min-w-[24px]">
                        +
                      </button>
                    </form>
                  </div>

                  {/* Tombol Hapus Instan Mini */}
                  <form action={async () => { 'use server'; await updateQuantityAction(item.id, -item.quantity); }}>
                    <button type="submit" className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center">
                      🗑
                    </button>
                  </form>
                  
                </div>
                
              </div>
            ))}
          </div>

          {/* Bagian Total Tagihan Akhir Lebih Ringkas */}
          <div className="pt-4 border-t border-slate-200 flex flex-col gap-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Pembayaran:</span>
              <span className="text-xl font-black text-orange-600">${totalHarga.toFixed(2)}</span>
            </div>
            
            <Link href="/checkout" className="w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow transition-all text-none tracking-wide">
              Lanjut ke Checkout Payment ➡
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
