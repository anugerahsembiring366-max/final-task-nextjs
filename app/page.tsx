// app/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getProducts, getProfile, addToCartAction } from '@/serveraction/action';

interface HomeProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // 1. Proteksi Halaman: Hanya boleh dibuka setelah login
  const user = await getProfile();
  if (!user) {
    redirect('/login');
  }

  // 2. Ambil parameter filter dari URL browser
  const resolvedParams = await searchParams;
  const currentSearch = resolvedParams.search || "";
  const currentPage = parseInt(resolvedParams.page || "1") || 1;
  const itemsLimit = 6;

  // 3. Ambil data katalog produk dari API internet
  const { products, totalPages } = await getProducts(currentSearch, currentPage, itemsLimit);

  // 4. Server Action untuk Kotak Formulir Pencarian
  async function handleSearchSubmit(formData: FormData) {
    'use server';
    const query = formData.get('query') as string;
    redirect(`/?search=${encodeURIComponent(query)}&page=1`);
  }

  return (
    <div className="space-y-6">
      {/* Banner Selamat Datang */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800 text-sm shadow-sm">
        <span className="text-xl">👋</span>
        <div>Selamat datang kembali, <span className="font-bold">{user.username}</span>! Selamat berbelanja.</div>
      </div>

      {/* Header & Kotak Pencarian */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight m-0">Katalog Produk</h1>
        
        <form action={handleSearchSubmit} className="flex gap-2">
          <input 
            type="text" 
            name="query" 
            defaultValue={currentSearch} 
            placeholder="Cari nama produk..." 
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56 box-border bg-white" 
          />
          <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow transition-colors cursor-pointer border-none">
            🔍 Cari
          </button>
          {currentSearch && (
            <Link href="/" className="px-3 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-sm font-bold shadow transition-colors flex items-center text-none">
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Grid Katalog List Produk */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-medium">❌ Produk "{currentSearch}" tidak ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => {
              
              // 5. Server Action internal khusus tombol beli instan 🛒 di halaman depan
              async function handleInstantAddToCart() {
                'use server';
                await addToCartAction(product);
                // Redirect ke alamatnya sendiri agar server otomatis refresh menyegarkan angka keranjang di menu atas layout
                redirect(`/?search=${encodeURIComponent(currentSearch)}&page=${currentPage}`);
              }

              return (
                <div 
                  key={product.id}
                  className="bg-white border border-slate-200 p-4 rounded-xl flex items-center shadow-sm hover:shadow-md hover:border-indigo-300 transition-all gap-4 relative group"
                >
                  {/* JALUR 1: Klik Area Gambar/Teks ke Halaman Detail */}
                  <Link 
                    href={`/product/${product.id}`} 
                    className="flex-1 flex items-center gap-4 text-none min-w-0"
                  >
                    {/* Foto Produk */}
                    <div className="w-20 h-20 bg-slate-50 rounded-lg p-2 flex items-center justify-center flex-shrink-0 border border-slate-100 group-hover:bg-indigo-50/50 transition-colors">
                      <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain" />
                    </div>
                    
                    {/* Deskripsi Teks Ringkas */}
                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className="text-sm font-bold text-slate-800 truncate m-0 group-hover:text-indigo-600 transition-colors">
                        {product.title}
                      </h3>
                      <div className="text-base font-black text-orange-600 mt-1">${product.price}</div>
                      <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-1.5">
                        {product.category}
                      </span>
                    </div>
                  </Link>

                  {/* JALUR 2: Sisi Kanan (Panah Detail & Tombol Beli Instan) */}
                  <div className="flex flex-col items-center justify-between h-full py-1 gap-4 flex-shrink-0">
                    <Link href={`/product/${product.id}`} className="text-slate-300 group-hover:text-indigo-500 transition-colors text-base font-bold text-none">
                      ➔
                    </Link>

                    {/* Tombol troli instan menggunakan form action Server murni */}
                    <form action={handleInstantAddToCart}>
                      <button 
                        type="submit" 
                        title="Tambah ke keranjang"
                        className="w-8 h-8 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-lg flex items-center justify-center text-sm transition-all border border-solid border-indigo-100 shadow-sm cursor-pointer"
                      >
                        🛒
                      </button>
                    </form>
                  </div>
                  
                </div>
              );
            })}
          </div>

          {/* Navigasi Pagination Tombol Halaman */}
          <div className="flex justify-center items-center gap-4 pt-6 border-t border-slate-200 mt-8">
            {currentPage > 1 ? (
              <Link 
                href={`/?search=${encodeURIComponent(currentSearch)}&page=${currentPage - 1}`} 
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors bg-white shadow-sm text-none"
              >
                ⬅ Sebelum
              </Link>
            ) : (
              <span className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-300 bg-slate-50 cursor-not-allowed">
                ⬅ Sebelum
              </span>
            )}

            <span className="text-sm font-bold text-slate-700">Halaman {currentPage} dari {totalPages}</span>

            {currentPage < totalPages ? (
              <Link 
                href={`/?search=${encodeURIComponent(currentSearch)}&page=${currentPage + 1}`} 
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors bg-white shadow-sm text-none"
              >
                Selanjutnya ➡
              </Link>
            ) : (
              <span className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-300 bg-slate-50 cursor-not-allowed">
                Selanjutnya ➡
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
