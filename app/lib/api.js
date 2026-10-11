const BASE_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

// Fallback fetch helper across all base URLs
async function fetchWithFallback(endpoint, options = {}) {
  let lastError = null;
  for (const baseUrl of BASE_URLS) {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, options);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error(`Failed to fetch from all endpoints: ${endpoint}`);
}

// সব পণ্য ফেচ
export async function getAllProducts() {
  try {
    const data = await fetchWithFallback("/products", {
      next: { revalidate: 300 },
    });
    return data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw new Error("পণ্যের তালিকা লোড করতে সমস্যা হয়েছে");
  }
}

// ক্যাটাগরি অনুযায়ী পণ্য ফেচ
export async function getProductsByCategory(category) {
  try {
    const data = await fetchWithFallback(`/products?category=${encodeURIComponent(category)}`, {
      next: { revalidate: 300 },
    });
    return data || [];
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}

// একটি পণ্যের ডিটেইলস ফেচ
export async function getProductById(id) {
  try {
    const data = await fetchWithFallback(`/products/${id}`, {
      next: { revalidate: 300 },
    });
    return data || null;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
}

// সব ক্যাটাগরি ফেচ
export async function getCategories() {
  try {
    const data = await fetchWithFallback("/categories", {
      next: { revalidate: 600 },
    });
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("ক্যাটাগরি লোড করতে সমস্যা হয়েছে");
  }
}

// একটি ক্যাটাগরি ফেচ
export async function getCategoryBySlug(slug) {
  try {
    const data = await fetchWithFallback(`/categories/${encodeURIComponent(slug)}`, {
      next: { revalidate: 600 },
    });
    return data || null;
  } catch (error) {
    console.error(`Error fetching category with slug ${slug}:`, error);
    return null;
  }
}
