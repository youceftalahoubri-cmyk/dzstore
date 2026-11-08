// Populates MongoDB with sample products (same categories as the React app).
// Usage: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../src/models/Product");

const GROUPS = {
  Electronics: ["smartphones", "laptops", "mobile-accessories"],
  Fashion: ["mens-shoes", "sunglasses", "womens-bags", "mens-watches"],
  Home: ["kitchen-accessories", "home-decoration"],
  Beauty: ["fragrances"],
};

const FALLBACK = [
  ["Smartphone X", "6.5-inch OLED smartphone with 128GB storage.", 499, "Electronics", 25],
  ["Laptop Pro 14", "14-inch laptop, 16GB RAM, 512GB SSD.", 1099, "Electronics", 10],
  ["Wireless Earbuds", "Bluetooth earbuds with noise cancellation.", 79, "Electronics", 60],
  ["Running Shoes", "Lightweight breathable running shoes.", 65, "Fashion", 40],
  ["Classic Sunglasses", "UV400 protection sunglasses.", 25, "Fashion", 80],
  ["Leather Handbag", "Elegant leather handbag.", 120, "Fashion", 15],
  ["Chef Knife Set", "Stainless steel kitchen knife set.", 45, "Home", 30],
  ["Decorative Vase", "Ceramic vase for home decoration.", 30, "Home", 22],
  ["Eau de Parfum", "Long-lasting floral fragrance, 50ml.", 55, "Beauty", 35],
].map(([name, description, price, category, stock]) => ({
  name, description, price, category, stock,
  imageUrl: `https://placehold.co/400x400?text=${encodeURIComponent(name)}`,
}));

// Try to load real products/photos from dummyjson.com (as the React app does); fall back to local samples.
async function fromDummyJson() {
  const jobs = Object.entries(GROUPS).flatMap(([group, slugs]) =>
    slugs.map(async (slug) => {
      const r = await fetch(`https://dummyjson.com/products/category/${slug}?limit=3&select=title,price,description,thumbnail,stock`);
      if (!r.ok) throw new Error(slug);
      const { products } = await r.json();
      return products.map((p) => ({
        name: p.title, description: p.description, price: p.price,
        category: group, imageUrl: p.thumbnail, stock: Number.isInteger(p.stock) ? p.stock : 20,
      }));
    })
  );
  const done = (await Promise.allSettled(jobs)).filter((r) => r.status === "fulfilled").flatMap((r) => r.value);
  if (!done.length) throw new Error("dummyjson unavailable");
  return done;
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    let products;
    try { products = await fromDummyJson(); console.log("Loaded products from dummyjson.com"); }
    catch { products = FALLBACK; console.log("dummyjson unavailable, using built-in sample products"); }
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
