// app/product/[id]/page.tsx
import { getProductDetail, addToCartAction } from '@/serveraction/action';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetail({ params }: PageProps) {
  // 1. Menangkap ID produk dari URL Next.js secara aman di sisi server
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. Mengambil data lengkap produk asli dari server API
  const product = await getProductDetail(id);

  // Jika produk tidak ditemukan di API, tampilkan pesan eror
  if (!product) {
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-sm max-w-md mx-auto mt-10">
        <p className="text-slate-500 font-medium text-lg">❌ Produk dengan ID {id} tidak ditemukan.</p>
        <Link href="/" className="inline-block mt-4 text-sm font-bold text-indigo-600 hover:underline">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  // 3. Server Action khusus untuk tombol "Tambah ke Keranjang"
  async function handleAddToCart() {
    'use server';
    await addToCartAction(product);
    // Mengarahkan kembali ke halaman detail produk ini sendiri agar layout.tsx memperbarui angka keranjang atas
    redirect(`/product/${id}`);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
      {/* Tombol Kembali */}
      <Link href="/" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors text-none mb-2">
        ⬅ Kembali ke Katalog
      </Link>

      {/* Wadah Utama Detail Produk (Membagi Tampilan Jadi 2 Kolom Kiri & Kanan) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
        
        {/* === KOLOM KIRI: FOTO PRODUK ASLI === */}
        <div className="w-full h-80 md:h-96 bg-slate-50 rounded-xl p-6 flex items-center justify-center border border-slate-100 shadow-inner">
          <img 
            src={product.image} 
            alt={product.title} 
            className="max-w-full max-h-full object-contain" 
          />
        </div>

        {/* === KOLOM KANAN: DETAIL INFORMASI PRODUK === */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Bagian Atas: ID & Kategori */}
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-2.5 py-1 rounded-md border border-indigo-100">
                PRODUCT ID: {product.id}
              </span>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-200">
                {product.category}
              </span>
            </div>

            {/* Nama / Judul Produk */}
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-snug m-0">
              {product.title}
            </h1>

            {/* Harga Produk */}
            <div className="text-2xl md:text-3xl font-black text-orange-600">
              ${product.price}
            </div>

            {/* Garis Pembatas Tipis */}
            <div className="border-t border-solid border-slate-200 my-2"></div>

            {/* Judul Deskripsi */}
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Deskripsi Produk
            </div>

            {/* Isi Deskripsi Produk */}
            <p className="text-sm text-slate-600 leading-relaxed m-0 text-justify">
              {product.description}
            </p>
          </div>

          {/* Form Tombol Tambah ke Keranjang Tradisional Server murni */}
          <form action={handleAddToCart} className="pt-4">
            <button 
              type="submit" 
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-base font-bold shadow transition-all hover:shadow-md cursor-pointer flex items-center justify-center gap-2 border-none"
            >
              <span>🛒</span> Tambah ke Keranjang
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
