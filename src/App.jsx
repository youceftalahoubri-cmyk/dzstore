import { useEffect, useState } from "react";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import AccountPage from "./components/AccountPage";
import AdminPage from "./components/AdminPage";
import { apiRequest, getToken } from "./data/auth";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("dzstore_theme") || "light");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("store");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("dzstore_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!getToken()) return;
    apiRequest("/api/auth/me").then(data => setUser(data.user)).catch(() => {
      localStorage.removeItem("dzstore_token");
      setUser(null);
    });
  }, []);

  function handleAuth(data) {
    if (data.token) localStorage.setItem("dzstore_token", data.token);
    setUser(data.user);
    setPage("account");
  }

  function logout() {
    localStorage.removeItem("dzstore_token");
    setUser(null);
    setPage("store");
  }

  return (
    <>
      <Header
        onCartClick={() => setCartOpen(true)}
        theme={theme}
        onThemeToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
        user={user}
        onAccountClick={() => setPage("account")}
        onAdminClick={() => setPage("admin")}
      />
      <main className="container">
        {page === "store" && <ProductList />}
        {page === "account" && <AccountPage user={user} onAuth={handleAuth} onLogout={logout} onBack={() => setPage("store")} />}
        {page === "admin" && user?.role === "admin" && <AdminPage onBack={() => setPage("store")} />}
      </main>
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
