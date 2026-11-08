export default function FilterBar({ search, onSearch, categories, category, onCategory }) {
  return (
    <div className="filters">
      <input
        type="search"
        placeholder="Search products..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className="chips">
        {categories.map((c) => (
          <button key={c} className={`chip ${c === category ? "active" : ""}`} onClick={() => onCategory(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
