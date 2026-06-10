// app/checkout/page.tsx
"use client";

import { useState, use, useEffect } from 'react';
// KUNCI: Panggil getCart dan updateQuantityAction untuk mengatur sisa barang di keranjang
import { getCart, updateQuantityAction, saveOrderAction } from '@/serveraction/action';
import Link from 'next/link';

interface CheckoutProps {
  searchParams: Promise<{ items?: string }>;
}

export default function Checkout({ searchParams }: CheckoutProps) {
  // Membuka parameter data produk pilihan dari URL
  const resolvedParams = use(searchParams);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  // State Pilihan Metode & Ekspedisi Pengiriman
  const [ekspedisi, setEkspedisi] = useState('J&T Express');
  const [ongkir, setOngkir] = useState(5.00); 

  // State Pilihan Kategori Pembayaran
  const [mainCategory, setMainCategory] = useState('bank');
  const [specificMethod, setSpecificMethod] = useState('Mandiri Virtual Account');
  const [status, setStatus] = useState<'pending' | 'show_qris' | 'success'>('pending');

  // Mengubah teks JSON di URL menjadi daftar barang asli saat halaman dibuka
  useEffect(() => {
    if (resolvedParams.items) {
      try {
        const decoded = JSON.parse(decodeURIComponent(resolvedParams.items));
        setSelectedProducts(decoded);
      } catch {
        setSelectedProducts([]);
      }
    }
  }, [resolvedParams.items]);

  // Fungsi otomatis jika ekspedisi pengiriman diganti oleh user
  const handleEkspedisiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEkspedisi(value);
    if (value === 'J&T Express') setOngkir(5.00);
    if (value === 'JNE Reguler') setOngkir(6.50);
    if (value === 'Sicepat Halur') setOngkir(4.00);
    if (value === 'GoSend Instant') setOngkir(12.00);
  };

  // Fungsi otomatis jika kategori pembayaran diganti
  const handleCategoryChange = (category: string) => {
    setMainCategory(category);
    if (category === 'bank') setSpecificMethod('Mandiri Virtual Account');
    if (category === 'ewallet') setSpecificMethod('GoPay');
    if (category === 'qris') setSpecificMethod('QRIS Dinamis');
  };

  // Menghitung subtotal harga semua barang pilihan
  const totalHargaBarang = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalTagihanAkhir = totalHargaBarang + ongkir;

  // 🚀 FUNGSI KUNCI: Hanya menghapus barang yang dibeli dari Cookie keranjang belanja
  const hapusHanyaBarangYangDibeli = async () => {
    // Ambil isi keranjang belanjaan utuh saat ini dari server cookie
    const seluruhIsiKeranjang = await getCart();
    
    // Looping/periksa setiap barang yang baru saja dicheckout
    for (const produkDibeli of selectedProducts) {
      // Cari apakah produk ini ada di keranjang utuh
      const itemCocok = seluruhIsiKeranjang.find((it) => it.id === produkDibeli.id);
      if (itemCocok) {
        // Panggil Server Action asli kamu untuk memotong habis quantity produk tersebut hingga 0 (terhapus)
        await updateQuantityAction(produkDibeli.id, -itemCocok.quantity);
      }
    }
  };

  // Fungsi saat tombol "Konfirmasi Bayar" diklik (Bank/E-Wallet)
  async function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();

    const strukPesanan = {
      orderId: 'INV-' + Math.floor(100000 + Math.random() * 900000),
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      items: selectedProducts,
      kurir: ekspedisi,
      metode: specificMethod,
      totalBayar: totalTagihanAkhir,
      statusPesanan: '📦 Sedang Diproses'
    };

    if (mainCategory === 'qris') {
      setStatus('show_qris');
    } else {
      await saveOrderAction(strukPesanan);
      // 🚀 GANTI CLEAR CART DENGAN FUNGSI FILTER BARU KITA
      await hapusHanyaBarangYangDibeli(); 
      setStatus('success');
    }
  }

  // Fungsi jika scan QRIS selesai
  async function handleQrisPaid() {
    const strukPesanan = {
      orderId: 'INV-' + Math.floor(100000 + Math.random() * 900000),
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      items: selectedProducts,
      kurir: ekspedisi,
      metode: 'QRIS Code',
      totalBayar: totalTagihanAkhir,
      statusPesanan: '📦 Sedang Diproses'
    };

    await saveOrderAction(strukPesanan);
    // 🚀 GANTI CLEAR CART DENGAN FUNGSI FILTER BARU KITA
    await hapusHanyaBarangYangDibeli();
    setStatus('success');
  }

  // TAMPILAN 1: JIKA PEMBAYARAN SUDAH SUKSES BERHASIL
  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto py-12 text-center bg-white border border-slate-200 rounded-xl shadow-md p-6 mt-6">
        <span className="text-5xl">🎉</span>
        <h2 className="text-xl font-black text-slate-800 mt-4 mb-2">Pembayaran Berhasil!</h2>
        <p className="text-xs text-slate-500 mb-6">Teria kasih sudah berbelanja. Pesanan Anda akan segera diproses oleh kurir <span className="font-bold text-indigo-600">{ekspedisi}</span>.</p>
        <Link href="/" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow text-none">
          Kembali ke Beranda Toko
        </Link>
      </div>
    );
  }

  // TAMPILAN 2: JIKA MEMILIH QRIS (MEMUNCULKAN KODE BARCODE QRIS)
  if (status === 'show_qris') {
    return (
      <div className="max-w-md mx-auto py-8 text-center bg-white border border-slate-200 rounded-xl shadow-md p-6 mt-6 flex flex-col items-center">
        <h2 className="text-lg font-black text-slate-800 mb-1">Scan QRIS Pembayaran</h2>
        <p className="text-xs text-slate-500 mb-4">Total Tagihan: <span className="font-black text-orange-600">${totalTagihanAkhir.toFixed(2)}</span></p>
        <div className="w-48 h-48 bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center rounded-xl mb-6 font-mono text-xs text-slate-400 font-bold p-4 box-border">
          [ 📱 BARCODE QRIS TOKO ONLINE ]
        </div>
        <button 
          onClick={handleQrisPaid}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow border-none cursor-pointer"
        >
          ✅ Saya Sudah Selesai Bayar
        </button>
      </div>
    );
  }
  // TAMPILAN 3: HALAMAN CHECKOUT UTAMA (PRODUK + KURIR + BAYAR + NOTA)
  return (
    <div className="max-w-md mx-auto py-4 md:py-6 space-y-4">
      <div className="pb-1 text-left">
        <Link href="/cart" className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors text-none">
          ⬅ Kembali ke Keranjang
        </Link>
      </div>

      <h1 className="text-xl font-black text-slate-800 tracking-tight m-0">🧾 Checkout Pesanan</h1>

      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        
        {/* BLOCK 1: DAFTAR PRODUK YANG MAU DIBELI */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 w-full box-border">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider text-left">1. Produk Pilihan Anda</div>
          <div className="divide-y divide-slate-100 flex flex-col w-full">
            {selectedProducts.map((product) => (
              <div key={product.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 w-full box-border">
                <div className="w-12 h-12 bg-slate-50 rounded-lg p-1 flex items-center justify-center flex-shrink-0 border border-slate-100">
                  <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="text-xs font-bold text-slate-800 m-0 whitespace-normal break-words leading-snug">
                    {product.title}
                  </h4>
                  <div className="text-[10px] font-bold text-slate-400 mt-1">
                    ${product.price} x <span className="text-slate-700 font-black">{product.quantity} Pcs</span>
                  </div>
                </div>
                <div className="text-xs font-black text-slate-800 flex-shrink-0 text-right min-w-[60px]">
                  ${(product.price * product.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCK 2: OPSI EKSPEDISI PENGIRIMAN */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2 text-left">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">2. Opsi Pengiriman Kurir</label>
          <select value={ekspedisi} onChange={handleEkspedisiChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 box-border cursor-pointer font-medium">
            <option value="J&T Express">🚚 J&T Express (Estimasi 2-3 Hari) - $5.00</option>
            <option value="JNE Reguler">🚚 JNE Reguler (Estimasi 2-4 Hari) - $6.50</option>
            <option value="Sicepat Halur">🚚 Sicepat Reguler (Estimasi 3-5 Hari) - $4.00</option>
            <option value="GoSend Instant">⚡ GoSend Instant (Estimasi 3 Jam) - $12.00</option>
          </select>
        </div>

        {/* BLOCK 3: METODE PEMBAYARAN */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 text-left">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider">3. Metode Pembayaran</div>
          <div className="grid grid-cols-3 gap-1.5">
            <button type="button" onClick={() => handleCategoryChange('bank')} className={`py-2 text-center rounded-lg text-[10px] font-black border border-solid cursor-pointer transition-colors ${mainCategory === 'bank' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>🏦 BANK VA</button>
            <button type="button" onClick={() => handleCategoryChange('ewallet')} className={`py-2 text-center rounded-lg text-[10px] font-black border border-solid cursor-pointer transition-colors ${mainCategory === 'ewallet' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>📱 E-WALLET</button>
            <button type="button" onClick={() => handleCategoryChange('qris')} className={`py-2 text-center rounded-lg text-[10px] font-black border border-solid cursor-pointer transition-colors ${mainCategory === 'qris' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>📸 QRIS CODE</button>
          </div>

          {mainCategory === 'bank' && (
            <select value={specificMethod} onChange={(e) => setSpecificMethod(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-medium cursor-pointer box-border">
              <option value="Mandiri Virtual Account">Bank Mandiri Virtual Account</option>
              <option value="BCA Virtual Account">Bank BCA Virtual Account</option>
              <option value="BRI Virtual Account">Bank BRI Virtual Account</option>
            </select>
          )}

          {mainCategory === 'ewallet' && (
            <select value={specificMethod} onChange={(e) => setSpecificMethod(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-medium cursor-pointer box-border">
              <option value="GoPay">GoPay (Otomatis Sambung Aplikasi)</option>
              <option value="OVO">OVO Indonesia</option>
              <option value="Dana">DANA Dompet Digital</option>
            </select>
          )}

          {mainCategory === 'qris' && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 font-medium leading-relaxed">
              💡 Kode Barcode QRIS Dinamis otomatis muncul di layar setelah kamu mengklik tombol bayar di bawah.
            </div>
          )}
        </div>

        {/* BLOCK 4: RINCIAN NOTA PEMBAYARAN */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2 text-sm">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 text-left">4. Rincian Total Tagihan</div>
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Total Harga ({selectedProducts.reduce((s,i)=>s+i.quantity,0)} Barang)</span>
            <span>${totalHargaBarang.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Total Ongkos Kirim ({ekspedisi})</span>
            <span>${ongkir.toFixed(2)}</span>
          </div>
          <div className="border-t border-solid border-slate-100 my-1"></div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs font-black text-slate-700">Total Akhir Pembayaran:</span>
            <span className="text-lg font-black text-orange-600">${totalTagihanAkhir.toFixed(2)}</span>
          </div>

          <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow transition-all mt-3 cursor-pointer border-none tracking-wide uppercase">
            🔒 Konfirmasi & Bayar via {specificMethod}
          </button>
        </div>
      </form>
    </div>
  );
}
