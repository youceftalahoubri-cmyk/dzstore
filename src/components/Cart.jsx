import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../store/actions";
import { selectItems, selectTotal } from "../store/reducer";
import CartItem from "./CartItem";

export default function Cart({ open, onClose }) {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);

  return (
    <>
      {open && <div className="overlay" onClick={onClose} />}
      <aside className={`cart ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="cart-head">
          <h2>Your Cart</h2>
          <button className="close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>
        {items.length === 0 ? (
          <p className="empty">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>
            <div className="cart-foot">
              <div className="total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
              <button className="btn secondary" onClick={() => dispatch(clearCart())}>Clear cart</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
