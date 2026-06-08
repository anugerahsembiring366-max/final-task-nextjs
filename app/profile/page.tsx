// app/profile/page.tsx
import { getProfile, logoutAction } from '@/serveraction/action';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Profile() {
  const user = await getProfile();

  // Jika belum login, otomatis dialihkan kembali ke halaman login
  if (!user) {
    redirect('/login');
  }

  // Fungsi Server Action untuk menghapus cookie sesi login
  async function handleLogout() {
    'use server';
    await logoutAction();
    redirect('/login'); // Setelah logout, tendang kembali ke halaman login
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto py-4 md:py-8">
      {/* Tombol Navigasi Kembali */}
      <div className="pb-2">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors text-none">
          ⬅ Kembali ke Katalog Produk
        </Link>
      </div>

      {/* Kartu Informasi Profil User */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-xl shadow-sm space-y-6">
        
        {/* Header Profil */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-inner border border-indigo-100 flex-shrink-0">
            👤
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight m-0">Profile User Active</h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">Detail informasi kredensial akun sesi saat ini</p>
          </div>
        </div>

        {/* Garis Pembatas */}
        <hr className="border-slate-100 m-0" />

        {/* Detail Data Akun */}
        <div className="space-y-3.5">
          <div className="flex justify-between items-center py-2 border-0 border-b border-solid border-slate-50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Akun / User</span>
            <span className="text-sm font-black text-slate-800 font-mono">{user.username}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-0 border-b border-solid border-slate-50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hak Akses System</span>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">
              {user.role}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-0 border-b border-solid border-slate-50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Autentikasi</span>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
              {user.status}
            </span>
          </div>
        </div>

        {/* Kotak Enkripsi Token Cookie Server */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
          <span className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">
            Token Cookie Server (JWT):
          </span>
          <p className="text-[10px] text-slate-500 font-mono m-0 bg-white p-2.5 rounded-lg border border-slate-200 break-all leading-relaxed max-h-20 overflow-y-auto">
            {user.token}
          </p>
        </div>

        {/* Form Logout Aksi */}
        <form action={handleLogout} className="pt-2">
          <button 
            type="submit" 
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer tracking-wide"
          >
            Keluar dari Akun (Logout)
          </button>
        </form>

      </div>
    </div>
  );
}
