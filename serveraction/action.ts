// serveraction/action.ts
'use server';

import { cookies } from 'next/headers';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ApiUser {
  id: number;
  username: string;
  email: string;
  password?: string;
  name?: {
    firstname: string;
    lastname: string;
  };
}

// 1. MENGAMBIL SEMUA PRODUK (FITUR SEARCH & PAGINATION UTAMA)
export async function getProducts(
  search: string = "",
  page: number = 1,
  limit: number = 6
): Promise<{ products: Product[]; totalPages: number }> {
  const res = await fetch('https://fakestoreapi.com/products', { cache: 'no-store' });
  if (!res.ok) throw new Error('Gagal mengambil data produk dari API');
  
  let allProducts: Product[] = await res.json();

  if (search) {
    allProducts = allProducts.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  const totalPages = Math.ceil(allProducts.length / limit);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = allProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    totalPages: totalPages || 1,
  };
}

// 2. MENGAMBIL DETAIL SATU PRODUK
export async function getProductDetail(id: string): Promise<Product> {
  const res = await fetch(`https://fakestoreapi.com/${id}`);
  if (!res.ok) throw new Error('Gagal mengambil detail produk dari API');
  return res.json();
}

// 3. LOGIKA PENCOCOKAN DATA LOGIN (MURNI DATA, TANPA REDIRECT/COOKIE SERVER BIAR VERCEL AMAN)
export async function loginAction(formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  if ((username === 'mor_2314' && password === '83r5^_') || (username === 'johnd' && password === 'm38rm7cc')) {
    return { success: true, username: username as string, token: 'official-jwt-token-key-12345' };
  }

  return { success: false, message: 'Username atau password salah.' };
}

// 4. LOGOUT USER
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('user_token');
  cookieStore.delete('username');
}

// 5. MENGAMBIL DATA PROFIL USER
export async function getProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get('user_token')?.value;
  const username = cookieStore.get('username')?.value;

  if (!token) return null;
  return { username, role: 'Customer', status: 'Active Account', token };
}

// 6. MENGAMBIL DATA KERANJANG BELANJA SPESIFIK PER USER
export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const username = cookieStore.get('username')?.value || 'guest';
  const cartData = cookieStore.get(`shopping_cart_${username}`)?.value;
  return cartData ? JSON.parse(cartData) : [];
}

// 7. TAMBAH PRODUK KE DALAM KERANJANG BELANJA SPESIFIK PER USER
export async function addToCartAction(product: Product) {
  const cookieStore = await cookies();
  const username = cookieStore.get('username')?.value || 'guest';
  const currentCart = await getCart();
  
  const existingItem = currentCart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    currentCart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  cookieStore.set(`shopping_cart_${username}`, JSON.stringify(currentCart));
}

// 8. PERUBAHAN QUANTITY PEMBELIAN SPESIFIK PER USER
export async function updateQuantityAction(id: number, amount: number) {
  const cookieStore = await cookies();
  const username = cookieStore.get('username')?.value || 'guest';
  let currentCart = await getCart();

  currentCart = currentCart.map((item) => {
    if (item.id === id) {
      const newQty = item.quantity + amount;
      return { ...item, quantity: newQty };
    }
    return item;
  }).filter((item) => item.quantity > 0);

  cookieStore.set(`shopping_cart_${username}`, JSON.stringify(currentCart));
}

// 9. KOSONGKAN KERANJANG SETELAH BERHASIL CHECKOUT
export async function clearCartAction() {
  const cookieStore = await cookies();
  const username = cookieStore.get('username')?.value || 'guest';
  cookieStore.delete(`shopping_cart_${username}`);
}

// 10. MENGAMBIL DAFTAR 10 USER LOGIN ASLI DARI INTERNET API
export async function getAllUsers(): Promise<ApiUser[]> {
  const res = await fetch('https://fakestoreapi.com/users', { 
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store' 
  });

  if (!res.ok) {
    throw new Error('Gagal mengambil data user langsung dari API');
  }

  return res.json();
}
