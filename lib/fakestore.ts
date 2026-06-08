import type { LoginResponse, Product, User } from "@/types/fakestore";

const BASE_URL = "https://fakestoreapi.com";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }

  return (await res.json()) as T;
}

export async function login(username: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function getProducts() {
  return apiFetch<Product[]>("/products");
}

export async function getProduct(id: number) {
  return apiFetch<Product>(`/products/${id}`);
}

export async function getUsers() {
  return apiFetch<User[]>("/users");
}

export async function getUser(id: number) {
  return apiFetch<User>(`/users/${id}`);
}

