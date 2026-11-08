// Prefer the DzStore API so products managed by an administrator appear in the storefront.
// Fall back to the original DummyJSON catalog when the backend has no seeded products.
// Each store category groups several API categories.
const GROUPS = {
  Electronics: ["smartphones", "laptops", "mobile-accessories"],
  Fashion: ["mens-shoes", "sunglasses", "womens-bags", "mens-watches"],
  Home: ["kitchen-accessories", "home-decoration"],
  Beauty: ["fragrances"],
};
const PER_CATEGORY = 3;
const FIELDS = "id,title,price,description,thumbnail";

async function fetchCategory(slug, group) {
  const res = await fetch(`https://dummyjson.com/products/category/${slug}?limit=${PER_CATEGORY}&select=${FIELDS}`);
  if (!res.ok) throw new Error(`Failed to load ${slug}`);
  const data = await res.json();
  return data.products.map((p) => ({
    id: p.id,
    name: p.title,
    price: p.price,
    category: group,
    image: p.thumbnail,
    description: p.description,
  }));
}

export async function fetchProducts() {
  try {
    const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await fetch(`${base}/api/products`);
    if (response.ok) {
      const stored = await response.json();
      if (Array.isArray(stored) && stored.length) {
        return stored.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          image: p.imageUrl,
          description: p.description,
        }));
      }
    }
  } catch { /* Backend is optional for the public demo catalog. */ }

  const jobs = Object.entries(GROUPS).flatMap(([group, slugs]) => slugs.map((s) => fetchCategory(s, group)));
  const results = await Promise.allSettled(jobs);
  const products = results.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);
  if (products.length === 0) throw new Error("Could not load products. Check your internet connection.");
  return products;
}
