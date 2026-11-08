import { useEffect, useState } from "react";
import { apiRequest } from "../data/auth";

const emptyForm = { name: "", description: "", price: "", category: "Electronics", imageUrl: "", stock: "" };

export default function AdminPage({ onBack }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setProducts(await apiRequest("/api/products")); setError(""); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function edit(product) {
    setEditing(product.id);
    setForm({ name: product.name, description: product.description, price: product.price, category: product.category, imageUrl: product.imageUrl, stock: product.stock });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function reset() { setEditing(null); setForm(emptyForm); }

  async function submit(event) {
    event.preventDefault();
    setError("");
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      await apiRequest(editing ? `/api/products/${editing}` : "/api/products", {
        method: editing ? "PUT" : "POST", body: JSON.stringify(payload)
      });
      reset();
      await load();
    } catch (err) { setError(err.message); }
  }

  async function remove(id) {
    if (!window.confirm("Delete this product?")) return;
    try { await apiRequest(`/api/products/${id}`, { method: "DELETE" }); await load(); }
    catch (err) { setError(err.message); }
  }

  return (
    <section className="admin-page">
      <button className="link" onClick={onBack}>← Back to store</button>
      <h2>Admin dashboard</h2>
      <form className="admin-form" onSubmit={submit}>
        <h3>{editing ? "Edit product" : "Add product"}</h3>
        <div className="admin-fields">
          <label>Product name<input required maxLength="200" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
          <label>Price ($)<input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></label>
          <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{["Electronics", "Fashion", "Home", "Beauty"].map(x => <option key={x}>{x}</option>)}</select></label>
          <label>Stock<input required type="number" min="0" step="1" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></label>
          <label className="wide-field">Image URL<input required type="url" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} /></label>
          <label className="wide-field">Description<textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
        </div>
        <div className="admin-actions"><button className="btn">{editing ? "Save changes" : "Add product"}</button>{editing && <button type="button" className="btn btn-neutral" onClick={reset}>Cancel</button>}</div>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}
      <h3>Products</h3>
      {loading ? <p className="empty">Loading products...</p> : products.length === 0 ? <p className="empty">No products in the database yet.</p> : (
        <div className="admin-list">{products.map(product => (
          <div className="admin-product" key={product.id}>
            <div><strong>{product.name}</strong><small>{product.category} · ${Number(product.price).toFixed(2)} · Stock: {product.stock}</small></div>
            <div className="admin-actions"><button className="link" onClick={() => edit(product)}>Edit</button><button className="remove" onClick={() => remove(product.id)}>Delete</button></div>
          </div>
        ))}</div>
      )}
    </section>
  );
}
