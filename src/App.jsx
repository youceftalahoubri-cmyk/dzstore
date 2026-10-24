import { useState } from "react";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false); // local UI state

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <main className="container">
        <ProductList />
      </main>
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
