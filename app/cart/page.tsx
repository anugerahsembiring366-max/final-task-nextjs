"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// 🚀 KUNCI: Memanggil fungsi server action asli milikmu, bukan context yang sudah dihapus!
import { getCart, updateQuantityAction } from '@/serveraction/action';

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);

  // Fungsi untuk memuat ulang data keranjang dari server cookie
  const muatDataKeranjang = () => {
    getCart().then((data) => {
      setCartItems(data);
      
      // Mengatur centang otomatis di awal jika produk belum ada di daftar state
      setCheckedItems((prev) => {
        const updated = { ...prev };
        data.forEach((item: any) => {
          if (updated[item.id] === undefined) {
            updated[item.id] = true;
          }
        });
        return updated;
      });
      setLoading(false);
    });
  };

  useEffect(() => {
    muatDataKeranjang();
  }, []);

  // Fungsi untuk handle klik kotak checklist per produk
  const handleCheckboxChange = (id: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Fungsi mengubah jumlah barang (+1 atau -1) menggunakan Server Action asli kamu
  const handleUbahQty = async (id: number, perubahan: number) => {
    await updateQuantityAction(id, perubahan);
    muatDataKeranjang(); // Segarkan data keranjang setelah angka diubah di server
  };

  // Fungsi menghapus produk total dari keranjang (Tombol Tong Sampah)
  const handleHapusProduk = async (id: number, totalQty: number) => {
    await updateQuantityAction(id, -totalQty);
    muatDataKeranjang(); // Segarkan data keranjang setelah produk dihapus di server
  };

  // Hitung total harga HANYA untuk produk yang sedang dicentang saja
  const totalHargaDicentang = cartItems.reduce((acc, item) => {
    return checkedItems[item.id] ? acc + item.price * item.quantity : acc;
  }, 0);

  // Fungsi saat tombol "Lanjut ke Checkout" diklik
  const handleLanjutCheckout = () => {
    const produkDicentang = cartItems.filter(item => checkedItems[item.id]);
    
    if (produkDicentang.length === 0) {
      alert("Silakan pilih minimal 1 produk untuk dicheckout! 🙏");
      return;
    }

    const kueriData = encodeURIComponent(JSON.stringify(produkDicentang));
    router.push(`/checkout?items=${kueriData}`);
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Memuat keranjang...</div>;

  return (
    <div className="space-y-4 max-w-md mx-auto py-4 md:py-6">
      <div className="pb-1">
        <Link href="/" className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors text-none">
          ⬅ Lanjut Belanja Produk Lain
        </Link>
      </div>

      <h1 className="text-xl font-black text-slate-800 tracking-tight m-0">🛒 Keranjang Belanja</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <span className="text-4xl mb-2">🛒</span>
          <p className="text-slate-500 font-medium text-sm">Keranjang belanja Anda saat ini masih kosong.</p>
          <Link href="/" className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow transition-colors text-none">
            Mulai Belanja Sekarang
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="divide-y divide-slate-100 flex flex-col">
            {cartItems.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                
                {/* 1. CHECKBOX */}
                <input 
                  type="checkbox" 
                  checked={!!checkedItems[item.id]} 
                  onChange={() => handleCheckboxChange(item.id)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded cursor-pointer accent-indigo-600 flex-shrink-0"
                />

                {/* 2. GAMBAR */}
                <div className="w-12 h-12 bg-slate-50 rounded-lg p-1 flex items-center justify-center flex-shrink-0 border border-slate-100">
                  <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                </div>
                
                {/* 3. JUDUL & HARGA */}
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="text-xs font-bold text-slate-800 truncate m-0">{item.title}</h3>
                  <div className="text-[11px] font-bold text-slate-400 mt-0.5">
                    Harga: <span className="text-orange-600 font-black">${item.price}</span>
                  </div>
                </div>

                {/* 4. TOMBOL PLUS-MINUS DAN SAMPAH */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-slate-50 shadow-sm">
                    {/* Tombol Minus */}
                    <button 
                      onClick={() => handleUbahQty(item.id, -1)}
                      type="button" 
                      className="px-2 py-1 bg-white text-slate-700 font-extrabold text-xs hover:bg-slate-100 transition-colors border-0 border-r border-solid border-slate-300 cursor-pointer min-w-[24px]"
                    >
                      -
                    </button>
                    
                    <span className="px-2 text-xs font-black text-slate-800 min-w-[14px] text-center">
                      {item.quantity}
                    </span>
                    
                    {/* Tombol Plus */}
                    <button 
                      onClick={() => handleUbahQty(item.id, 1)}
                      type="button" 
                      className="px-2 py-1 bg-white text-slate-700 font-extrabold text-xs hover:bg-slate-100 transition-colors border-0 border-l border-solid border-slate-300 cursor-pointer min-w-[24px]"
                    >
                      +
                    </button>
                  </div>

                  {/* Tombol Hapus (Tong Sampah) */}
                  <button 
                    onClick={() => handleHapusProduk(item.id, item.quantity)}
                    type="button" 
                    className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center h-full"
                  >
                    🗑
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Pembayaran:</span>
              <span className="text-xl font-black text-orange-600">${totalHargaDicentang.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleLanjutCheckout}
              className="w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow transition-all border-none cursor-pointer tracking-wide"
            >
              Lanjut ke Checkout Payment ➡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
