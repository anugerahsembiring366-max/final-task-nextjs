// app/profile/page.tsx
import { getProfile, getOrderHistory, logoutAction } from '@/serveraction/action';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage() {
  // 1. Satpam proteksi halaman profil
  const user = await getProfile();
  if (!user) {
    redirect('/login');
  }

  // 2. Ambil seluruh riwayat pesanan dari brankas server cookie (Otomatis berbeda per user)
  const daftarPesanan = await getOrderHistory();

  // SERVER ACTION INTERNAL UNTUK HANDLE PROSES LOGOUT
  async function handleLogoutSubmit() {
    'use server';
    await logoutAction();
    redirect('/login');
  }

  return (
    <div className="space-y-6 max-w-md mx-auto py-4 md:py-6 text-left">
      
      {/* Tombol Kembali ke Katalog */}
      <div className="pb-1">
        <Link href="/" className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors text-none">
          ⬅ Kembali ke Beranda Katalog
        </Link>
      </div>

      {/* BLOCK 1: KARTU PROFIL UTAMA UTK SALAM */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center relative">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-700 font-black text-2xl flex items-center justify-center rounded-full mx-auto mb-3 shadow-inner">
          👤
        </div>
        <h2 className="text-lg font-black text-slate-800 m-0 uppercase tracking-tight">
          {user.firstname} {user.lastname}
        </h2>
        <p className="text-xs text-slate-400 font-mono m-0 mt-0.5">@{user.username}</p>
      </div>

      {/* BLOCK 2: DETAIL BIODATA PRIBADI DARI API (OTOMATIS BERBEDA PER USER) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider pl-0.5">📋 Informasi Akun</div>
        
        <div className="divide-y divide-slate-100 flex flex-col text-xs">
          <div className="py-2 flex.justify-between flex justify-between">
            <span className="text-slate-400 font-medium">Alamat Email:</span>
            <span className="font-bold text-slate-700 font-mono">{user.email}</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-slate-400 font-medium">No. Telepon:</span>
            <span className="font-bold text-slate-700">{user.phone || 'Tidak Ada'}</span>
          </div>
          <div className="py-2 flex flex-col text-left gap-1">
            <span className="text-slate-400 font-medium">Alamat Pengiriman Rumah:</span>
            <span className="font-bold text-slate-600 leading-relaxed capitalize">
              Rumah No. {user.number}, {user.street}, Kota {user.city} ({user.zipcode})
            </span>
          </div>
        </div>

        {/* FORM TOMBOL LOGOUT */}
        <form action={handleLogoutSubmit} className="pt-2 border-t border-solid border-slate-100">
          <button 
            type="submit"
            className="w-full py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg text-xs font-bold transition-all border border-solid border-red-200 shadow-sm cursor-pointer"
          >
            🚪 Keluar Akun (Logout)
          </button>
        </form>
      </div>

      {/* BLOCK 3: BAGIAN RIWAYAT STATUS PESANAN PER USER */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider m-0 pl-1">
          📦 Status Pesanan Kamu ({daftarPesanan.length})
        </h3>

        {/* KONDISI JIKA USER BELUM PERNAH BELANJA */}
        {daftarPesanan.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <p className="text-slate-400 font-medium text-xs m-0">Kamu belum pernah melakukan checkout pesanan.</p>
            <Link href="/" className="inline-block mt-3 text-xs font-bold text-indigo-600 hover:underline">
              Mulai Belanja Sekarang ➡
            </Link>
          </div>
        ) : (
          /* KONDISI JIKA SUDAH ADA RIWAYAT CHECKOUT */
          daftarPesanan.map((nota: any) => (
            <div key={nota.orderId} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
              
              {/* Kepala Nota */}
              <div className="flex justify-between items-start border-b border-solid border-slate-100 pb-2">
                <div>
                  <div className="text-xs font-black text-slate-800 tracking-tight">{nota.orderId}</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">{nota.tanggal}</div>
                </div>
                <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                  {nota.statusPesanan}
                </span>
              </div>

              {/* Isi Daftar Barang */}
              <div className="divide-y divide-slate-50 flex flex-col">
                {nota.items.map((prod: any) => (
                  <div key={prod.id} className="py-2 first:pt-0 last:pb-0 flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 rounded-md p-1 flex items-center justify-center flex-shrink-0 border border-slate-100">
                      <img src={prod.image} alt={prod.title} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate m-0">{prod.title}</h4>
                      <div className="text-[10px] text-slate-400 mt-0.5">${prod.price} x {prod.quantity} Pcs</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kaki Nota */}
              <div className="pt-2 border-t border-solid border-slate-100 flex justify-between items-center text-xs font-medium text-slate-500">
                <div>Kurir: <span className="font-bold text-slate-700">{nota.kurir}</span> ({nota.metode})</div>
                <div className="font-black text-orange-600 text-sm">Total: ${nota.totalBayar.toFixed(2)}</div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
