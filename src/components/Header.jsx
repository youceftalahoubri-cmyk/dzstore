import { useSelector } from "react-redux";
import { selectCount } from "../store/reducer";

export default function Header({ onCartClick, theme, onThemeToggle, user, onAccountClick, onAdminClick }) {
  const count = useSelector(selectCount);
  return (
    <header className="header">
      <div className="brand">
        <img src="/logo.png" alt="DzStore logo" className="logo" />
        <h1>DzStore</h1>
      </div>
      <nav className="header-actions" aria-label="Main navigation">
        <button className="btn btn-neutral theme-btn" onClick={onThemeToggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title="Toggle theme">{theme === "dark" ? "☀️" : "🌙"}</button>
        {user?.role === "admin" && <button className="btn btn-neutral" onClick={onAdminClick}>Admin</button>}
        <button className="btn btn-neutral" onClick={onAccountClick}>{user ? "My account" : "Log in"}</button>
        <button className="btn cart-btn" onClick={onCartClick}>🛒 Cart <span className="badge">{count}</span></button>
      </nav>
    </header>
  );
}
