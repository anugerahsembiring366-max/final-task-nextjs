// app/product/[id]/page.tsx
import { getProductDetail, addToCartAction } from '@/serveraction/action';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetail({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const product = await getProductDetail(id);

  async function handleAddToCart() {
    'use server';
    await addToCartAction(product);
    redirect('/cart');
  }

  return (
    <div className="space-y-4 max-w-md mx-auto py-4 md:py-6">
      
      {/* Tombol Navigasi Kembali */}
      <div className="pb-1">
        <Link href="/" className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors text-none">
          ⬅ Kembali ke Katalog Produk
        </Link>
      </div>

      {/* Kartu Detail Konten Utama */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col items-center text-center">
        
        {/* Ukuran Foto Produk Mini */}
        <div className="w-44 h-44 bg-slate-50 rounded-xl p-3 flex items-center justify-center border border-slate-100 shadow-inner mb-4 flex-shrink-0">
          <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain" />
        </div>
        
        {/* Informasi Detail Teks */}
        <div className="w-full space-y-3">
          <div>
            <span className="inline-block bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-indigo-100">
              {product.category}
            </span>
            <h1 className="text-base font-black text-slate-800 tracking-tight mt-2 mb-0 leading-snug">
              {product.title}
            </h1>
          </div>
          
          {/* Garis Pembatas */}
          <hr className="border-slate-100 my-1" />
          
          <div className="text-left">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deskripsi Produk:</span>
            <p className="text-xs text-slate-600 leading-relaxed text-justify m-0 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {product.description}
            </p>
          </div>

          <div className="pt-1 flex flex-col items-center gap-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Harga Produk:</span>
              <span className="text-2xl font-black text-orange-600 tracking-tight mt-0.5 block">${product.price}</span>
            </div>
            
            {/* Form Pemicu Server Action (Sudah Dikoreksi Tag-nya) */}
            <form action={handleAddToCart} className="w-full">
              <button 
                type="submit" 
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm shadow transition-all cursor-pointer tracking-wide flex items-center justify-center gap-2"
              >
                🛒 Tambah Produk ke dalam Keranjang
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
