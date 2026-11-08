import { useDispatch } from "react-redux";
import { addToCart, decreaseQuantity, removeFromCart } from "../store/actions";
import ProductImage from "./ProductImage";

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  return (
    <li className="cart-item">
      <ProductImage className="thumb-sm" src={item.image} alt={item.name} />
      <div className="info">
        <strong>{item.name}</strong>
        <small>${item.price.toFixed(2)} each</small>
        <div className="qty">
          <button onClick={() => dispatch(decreaseQuantity(item.id))} aria-label="Decrease quantity">−</button>
          <span>{item.quantity}</span>
          <button onClick={() => dispatch(addToCart(item))} aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div className="line-total">
        ${(item.price * item.quantity).toFixed(2)}
        <button className="remove" onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
      </div>
    </li>
  );
}
