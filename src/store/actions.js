// Action types
export const ADD_TO_CART = "cart/add";
export const REMOVE_FROM_CART = "cart/remove";
export const DECREASE_QUANTITY = "cart/decrease";
export const CLEAR_CART = "cart/clear";

// Action creators
export const addToCart = (product) => ({ type: ADD_TO_CART, payload: product });
export const removeFromCart = (id) => ({ type: REMOVE_FROM_CART, payload: id });
export const decreaseQuantity = (id) => ({ type: DECREASE_QUANTITY, payload: id });
export const clearCart = () => ({ type: CLEAR_CART });
