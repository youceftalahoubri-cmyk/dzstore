import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/actions";
import { selectItems } from "../store/reducer";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const inCart = useSelector(selectItems).find((i) => i.id === product.id);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <article className="card">
      <ProductImage className="thumb" src={product.image} alt={product.name} />
      <span className="category">{product.category}</span>
      <h3>{product.name}</h3>
      {showInfo && <p className="desc">{product.description}</p>}
      <button className="link" onClick={() => setShowInfo(!showInfo)}>
        {showInfo ? "Hide details" : "Show details"}
      </button>
      <div className="card-footer">
        <strong>${product.price.toFixed(2)}</strong>
        <button className="btn" onClick={() => dispatch(addToCart(product))}>
          {inCart ? `Add more (${inCart.quantity})` : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
