import { useEffect, useState } from "react";
import { fetchProducts } from "../data/api";
import ProductCard from "./ProductCard";
import FilterBar from "./FilterBar";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const load = () => {
    setStatus("loading");
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };
  useEffect(load, []);

  if (status === "loading") return <p className="empty">Loading products...</p>;
  if (status === "error")
    return (
      <div className="empty">
        <p>Could not load products. Check your internet connection.</p>
        <button className="btn" onClick={load}>Try again</button>
      </div>
    );

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const visible = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
      <FilterBar search={search} onSearch={setSearch} categories={categories} category={category} onCategory={setCategory} />
      {visible.length === 0 ? (
        <p className="empty">No products found.</p>
      ) : (
        <div className="grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
