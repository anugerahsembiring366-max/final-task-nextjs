// app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { clearCartAction } from '@/serveraction/action';
import Link from 'next/link';

export default function Checkout() {
  const [mainCategory, setMainCategory] = useState('bank');
  const [specificMethod, setSpecificMethod] = useState('Mandiri Virtual Account');
  const [status, setStatus] = useState<'pending' | 'show_qris' | 'success'>('pending');

  const handleCategoryChange = (category: string) => {
    setMainCategory(category);
    if (category === 'bank') setSpecificMethod('Mandiri Virtual Account');
    if (category === 'ewallet') setSpecificMethod('GoPay');
    if (category === 'qris') setSpecificMethod('QRIS Dinamis');
  };

  async function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mainCategory === 'qris') {
      setStatus('show_qris');
    } else {
      await clearCartAction();
      setStatus('success');
    }
  }

  async function handleQrisPaid() {
    await clearCartAction();
    setStatus('success');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-8">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 w-full max-w-sm box-border text-center">
        
        {/* KONDISI 1: FORM PEMILIHAN METODE */}
        {status === 'pending' && (
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight m-0">💳 Simulasi Checkout</h2>
            <p className="text-xs text-slate-500 m-0">Silakan tentukan jenis instrumen pembayaran akhir Anda.</p>
            
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Pilih Tipe Pembayaran</label>
              <select 
                value={mainCategory} 
                onChange={(e) => handleCategoryChange(e.target.value)} 
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer box-border"
              >
                <option value="bank">🏦 Bank Transfer (Virtual Account)</option>
                <option value="ewallet">📱 E-Wallet (Dompet Digital)</option>
                <option value="qris">⚡ Scan QRIS</option>
              </select>
            </div>

            {/* Pilihan Kedua Dinamis: Bank VA */}
            {mainCategory === 'bank' && (
              <div className="text-left animate-fadeIn">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Pilih Bank Virtual Account</label>
                <select 
                  value={specificMethod} 
                  onChange={(e) => setSpecificMethod(e.target.value)} 
                  className="w-full px-3 py-2.5 border border-indigo-500 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer box-border"
                >
                  <option value="Mandiri Virtual Account">Mandiri Virtual Account (VA)</option>
                  <option value="BCA Virtual Account">BCA Virtual Account (VA)</option>
                  <option value="BRI Virtual Account">BRI Virtual Account (VA)</option>
                  <option value="BNI Virtual Account">BNI Virtual Account (VA)</option>
                </select>
              </div>
            )}

            {/* Pilihan Kedua Dinamis: E-Wallet */}
            {mainCategory === 'ewallet' && (
              <div className="text-left animate-fadeIn">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Pilih Aplikasi E-Wallet</label>
                <select 
                  value={specificMethod} 
                  onChange={(e) => setSpecificMethod(e.target.value)} 
                  className="w-full px-3 py-2.5 border border-orange-500 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer box-border"
                >
                  <option value="GoPay">GoPay</option>
                  <option value="OVO">OVO</option>
                  <option value="Dana">Dana</option>
                  <option value="ShopeePay">ShopeePay</option>
                </select>
              </div>
            )}

            {/* Pilihan Kedua Dinamis: QRIS */}
            {mainCategory === 'qris' && (
              <div className="text-left animate-fadeIn">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Pilih Opsi QRIS</label>
                <select 
                  value={specificMethod} 
                  onChange={(e) => setSpecificMethod(e.target.value)} 
                  className="w-full px-3 py-2.5 border border-emerald-500 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer box-border"
                >
                  <option value="QRIS Dinamis">Scan QRIS GPN (Otomatis)</option>
                </select>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button 
                type="submit" 
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer tracking-wide"
              >
                Konfirmasi & Bayar Sekarang
              </button>

              <Link 
                href="/cart" 
                className="w-full py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all text-none block tracking-wide"
              >
                ← Kembali ke Keranjang
              </Link>
            </div>
          </form>
        )}

        {/* KONDISI 2: TAMPILAN INTERAKTIF QR CODE (SUDAH DIPERBAIKI JALUR GAMBARNYA) */}
        {status === 'show_qris' && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-800 tracking-tight m-0">📸 Scan Kode QRIS</h3>
            <p className="text-xs text-slate-500 leading-relaxed m-0">Silakan scan QR Code di bawah ini menggunakan aplikasi dompet digital atau Mobile Banking Anda.</p>
            
            {/* Box Bingkai QR Code */}
            <div className="bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-300 inline-block">
              {/* MENGGUNAKAN GENERATOR QUICKCHART YANG SANGAT CEPAT DAN COCOK UNTUK SEMUA BROWSER */}
              <img 
                src="Qris.jpg" 
                alt="QRIS QR Code Simulator" 
                className="w-48 h-48 block mx-auto rounded-lg shadow-sm bg-white"
              />
              <div className="mt-3 font-mono font-black text-red-500 text-xs tracking-wider">NMI: ID1020304050607</div>
            </div>

            <p className="text-[10px] text-slate-400 italic m-0">*Ini adalah sistem simulasi kode QR aman untuk keperluan demonstrasi tugas.</p>
            
            <div className="space-y-2 pt-2">
              <button 
                onClick={handleQrisPaid} 
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer tracking-wide"
              >
                Saya Sudah Membayar 👍
              </button>

              <button 
                type="button" 
                onClick={() => setStatus('pending')} 
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer tracking-wide"
              >
                ❌ Batalkan Pembayaran
              </button>
            </div>
          </div>
        )}

        {/* KONDISI 3: HALAMAN TRANSASKI BERHASIL */}
        {status === 'success' && (
          <div className="space-y-4 py-4 animate-scaleUp">
            <h1 className="text-5xl m-0 animate-bounce">🎉</h1>
            <h2 className="text-2xl font-black text-emerald-600 m-0 tracking-tight">Pembayaran Sukses!</h2>
            <p className="text-sm text-slate-600 leading-relaxed m-0 px-2">
              Simulasi transaksi via <span className="font-extrabold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{specificMethod}</span> berhasil diverifikasi oleh sistem simulator.
            </p>
            <div className="pt-4">
              <Link 
                href="/" 
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all text-none block tracking-wide"
              >
                Kembali ke Halaman Produk
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
