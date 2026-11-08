# DzStore (React + Redux)

## Run
    npm install
    npm run dev      # http://localhost:5173
    npm run build\n\nSet `ADMIN_EMAIL` in `backend/.env` before registering the administrator account. The frontend expects the backend at `http://localhost:3000` by default; set `VITE_API_URL` if it runs elsewhere.

## Structure
- `src/store/actions.js`  – action types + action creators
- `src/store/reducer.js`  – reducer logic + selectors
- `src/store/store.js`    – Redux store (`configureStore`)
- `src/components/`       – Header, FilterBar, ProductList, ProductCard, Cart, CartItem
- `src/data/api.js`       – loads real product photos/data from dummyjson.com

## Requirement map
- Props: ProductCard `product`, CartItem `item`, FilterBar callbacks, Cart `open/onClose`
- Local state: search/category (ProductList), details toggle (ProductCard), cart panel (App)
- Redux: `Provider` in main.jsx, `useSelector` to read, `useDispatch` to dispatch
- Optional extras included: search, category filter, product details, quantity, cart total\n- Added: persistent light/dark theme, user registration/login/account page, and role-protected admin product management

## Backend
The REST API (Node.js, Express, MongoDB, JWT, OAuth2, rate limiting) lives in [`backend/`](backend/README.md).
