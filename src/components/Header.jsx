import { useSelector } from "react-redux";
import { selectCount } from "../store/reducer";

export default function Header({ onCartClick }) {
  const count = useSelector(selectCount);
  return (
    <header className="header">
      <div className="brand">
        <img src="/logo.png" alt="DzStore logo" className="logo" />
        <h1>DzStore</h1>
      </div>
      <button className="btn cart-btn" onClick={onCartClick}>
        🛒 Cart <span className="badge">{count}</span>
      </button>
    </header>
  );
}
