const BASE_URL = "https://openapi.programming-hero.com/api/bazardor";

// সব পণ্য ফেচ
export async function getAllProducts() {
  const res = await fetch(`${BASE_URL}/products`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("পণ্যের তালিকা লোড করতে সমস্যা হয়েছে");
  const data = await res.json();
  return data;
}

// ক্যাটাগরি অনুযায়ী পণ্য ফেচ
export async function getProductsByCategory(category) {
  const res = await fetch(`${BASE_URL}/products?category=${category}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data;
}

// একটি পণ্যের ডিটেইলস ফেচ
export async function getProductById(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

// সব ক্যাটাগরি ফেচ
export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error("ক্যাটাগরি লোড করতে সমস্যা হয়েছে");
  const data = await res.json();
  return data;
}

// একটি ক্যাটাগরি ফেচ
export async function getCategoryBySlug(slug) {
  const res = await fetch(`${BASE_URL}/categories/${slug}`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}
