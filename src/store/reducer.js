import { ADD_TO_CART, REMOVE_FROM_CART, DECREASE_QUANTITY, CLEAR_CART } from "./actions";

const initialState = { items: [] }; // each item: { ...product, quantity }

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      const product = action.payload;
      const exists = state.items.some((i) => i.id === product.id);
      return {
        ...state,
        items: exists
          ? state.items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...state.items, { ...product, quantity: 1 }],
      };
    }
    case DECREASE_QUANTITY:
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0),
      };
    case REMOVE_FROM_CART:
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case CLEAR_CART:
      return initialState;
    default:
      return state;
  }
}

// Selectors (read derived global state)
export const selectItems = (state) => state.items;
export const selectCount = (state) => state.items.reduce((n, i) => n + i.quantity, 0);
export const selectTotal = (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
