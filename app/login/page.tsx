// app/login/page.tsx
'use client';

import { loginAction, getAllUsers } from '@/serveraction/action';
import { useState, useEffect } from 'react';

export default function Login() {
  const [errorMsg, setErrorMsg] = useState('');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        setAvailableUsers(data);
      })
      .catch(() => {
        console.log("Gagal memuat data user dari API internet");
      });
  }, []);

  async function handleSubmit(formData: FormData) {
    setErrorMsg(''); 
    const result = await loginAction(formData);
    
    if (result && result.success && result.username && result.token) {
      // Menulis cookie langsung di browser client agar Vercel ANTI-CRASH 100%
      document.cookie = `user_token=${result.token}; path=/; max-age=86400`;
      document.cookie = `username=${result.username}; path=/; max-age=86400`;
      
      // Alihkan halaman secara instan dan bersih ke beranda produk
      window.location.href = '/';
    } else {
      setErrorMsg(result?.message ?? 'Gagal memproses login.');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-8">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 w-full max-w-sm box-border text-center">
        
        <h2 className="text-2xl font-black text-slate-800 text-center mb-1 tracking-tight">🔑 Login User</h2>
        <p className="text-xs text-slate-500 text-center mb-6">Masuk untuk menjelajahi katalog produk toko online</p>
        
        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg mb-4 border border-red-200 text-left">
            ⚠ {errorMsg}
          </div>
        )}
        
        <form action={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Username</label>
            <input 
              type="text" 
              name="username" 
              defaultValue="mor_2314" 
              required 
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent box-border bg-slate-50" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              defaultValue="83r5^_" 
              required 
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent box-border bg-slate-50" 
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input 
              type="checkbox" 
              id="tampilkanPassword" 
              checked={showPassword} 
              onChange={() => setShowPassword(!showPassword)} 
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded cursor-pointer accent-indigo-600" 
            />
            <label htmlFor="tampilkanPassword" className="text-xs text-slate-600 cursor-pointer select-none font-medium">
              Tampilkan Password
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer mt-2 tracking-wide text-center"
          >
            Masuk Sekarang
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-left">
          <div className="flex items-center gap-2 mb-3">
            <input 
              type="checkbox" 
              id="tampilkanDaftarUser" 
              checked={showUserList} 
              onChange={() => setShowUserList(!showUserList)} 
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded cursor-pointer accent-indigo-600" 
            />
            <label htmlFor="tampilkanDaftarUser" className="text-xs text-slate-700 font-extrabold cursor-pointer select-none">
              Tampilkan 10 Akun Testing Resmi API
            </label>
          </div>

          {showUserList && (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mt-2 border border-slate-100 rounded-lg p-1 bg-slate-50">
              {availableUsers.length === 0 ? (
                <p className="text-[11px] text-slate-400 text-center py-2 animate-pulse">Memuat akun testing dari API...</p>
              ) : (
                availableUsers.map((u: any) => (
                  <div key={u.id} className="bg-white p-2 rounded-md border border-slate-200 text-[11px] text-slate-600 shadow-sm">
                    <div className="text-slate-500 mb-1">
                      <strong>Nama:</strong> {u.name ? `${u.name.firstname} ${u.name.lastname}` : u.email}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span>User:</span> 
                      <code className="bg-slate-100 px-1 py-0.5 border border-slate-200 rounded font-mono text-slate-800">{u.username}</code>
                      <span className="ml-1">Pass:</span> 
                      <code className="bg-slate-100 px-1 py-0.5 border border-slate-200 rounded font-mono text-slate-800">{u.password}</code>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
