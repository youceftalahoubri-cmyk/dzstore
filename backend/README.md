# DzStore Backend – REST API

**Student name:** _your name here_

## Application description
Backend of the DzStore e-commerce application (TD–TP 2 frontend: React + Redux).
It exposes a REST API that stores products and users in MongoDB, lets users register and log in,
and protects product management endpoints with JWT (or an OAuth 2.0 access token).
The API is also protected by rate limiting.

## Technologies used
Node.js · Express.js · MongoDB / MongoDB Atlas · Mongoose · bcryptjs (password hashing) ·
jsonwebtoken (JWT) · jose (OAuth2/OIDC token verification) · express-rate-limit · cors · dotenv ·
Postman / Thunder Client · Git/GitHub

## Project structure
```
backend/
├── scripts/seed.js              # populate the database with sample products
└── src/
    ├── server.js                # entry point (env, DB connection, listen)
    ├── app.js                   # Express app, CORS, rate limit, routes
    ├── config/db.js             # Mongoose connection
    ├── models/                  # Product.js, User.js
    ├── controllers/             # authController.js, productController.js
    ├── routes/                  # authRoutes.js, productRoutes.js
    ├── middleware/              # auth.js, rateLimiter.js, errorHandler.js, validateObjectId.js
    └── utils/HttpError.js
```

## Database models
**Product**: `name` (String, required) · `description` (String, required) · `price` (Number ≥ 0, required) ·
`category` (Electronics | Fashion | Home | Beauty) · `imageUrl` (String, required) · `stock` (integer ≥ 0, required) ·
+ `createdAt`/`updatedAt`. JSON output exposes `id` (instead of `_id`).

**User**: `name` (String) · `email` (String, unique, lowercase) · `passwordHash` (bcrypt hash, never returned by the API) · `role` (`user` by default, or `admin` for the configured `ADMIN_EMAIL`).

## API endpoints
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user (returns a token) | Public |
| POST | `/api/auth/login` | Authenticate, returns a JWT (5 req / 15 min / IP) | Public |
| GET | `/api/auth/me` | Show the identity behind the token (handy for OAuth2 tests) | Token required |
| GET | `/api/products` | List products (optional `?category=` and `?search=`) | Public |
| GET | `/api/products/:id` | Get one product | Public |
| POST | `/api/products` | Create a product | Admin JWT required |
| PUT | `/api/products/:id` | Update a product | Admin JWT required |
| DELETE | `/api/products/:id` | Delete a product | Admin JWT required |

Status codes: 200, 201, 400 (invalid input / invalid ID), 401 (missing or invalid token / bad credentials),
404 (not found), 409 (duplicate email), 429 (rate limit), 500.
Errors always use the format `{ "success": false, "message": "...", "errors": [ ... ] }`.

### Example bodies
```json
// POST /api/auth/register
{ "name": "Amine", "email": "amine@example.com", "password": "secret123" }
// POST /api/auth/login  -> { "success": true, "token": "<JWT>", ... }
{ "email": "amine@example.com", "password": "secret123" }
// POST /api/products   (Authorization: Bearer <JWT>)
{ "name": "Test phone", "description": "Demo", "price": 199.9, "category": "Electronics",
  "imageUrl": "https://placehold.co/400", "stock": 12 }
```

## JWT authentication mechanism
1. `POST /api/auth/register` validates the input, rejects duplicate emails (409), hashes the password with bcrypt and stores the user.
2. `POST /api/auth/login` checks the email and password (bcrypt compare) and returns a signed JWT
   (payload: user id as `sub` + email, expiry `JWT_EXPIRES_IN`, signed with `JWT_SECRET`).
3. The client sends the token on protected requests: `Authorization: Bearer <JWT_TOKEN>`.
4. The `authenticate` middleware (`src/middleware/auth.js`) extracts the token, verifies it and either calls `next()` or answers **401**.
5. `JWT_SECRET` is read from the environment, never hardcoded.

## OAuth 2.0 (Postman / Thunder Client)
The same `authenticate` middleware also accepts a token issued by an OAuth 2.0 / OpenID Connect provider
(e.g. Google). If the token is not a valid local JWT, it is checked against the provider:
JWT-formatted tokens (ID tokens) are verified with the provider's JWKS (signature, issuer, audience);
opaque access tokens are validated through the provider's userinfo endpoint. Configure `OAUTH_*` in `.env`.

Testing with Thunder Client / Postman (Google example):
1. In Google Cloud Console → APIs & Services → Credentials, create an *OAuth client ID* (Web application) and register the redirect URI used by your tool
   (Postman: `https://oauth.pstmn.io/v1/callback`).
2. In the request → **Auth** tab → **OAuth 2.0**:
   - Auth URL: `https://accounts.google.com/o/oauth2/v2/auth`
   - Token URL: `https://oauth2.googleapis.com/token`
   - Client ID / Client secret: from step 1
   - Scope: `openid email profile` · Grant type: Authorization Code (with PKCE)
   - Redirect URI: exactly as registered
3. Authenticate with Google, obtain the token (use the **ID token** if the access token is rejected) and send
   `GET /api/auth/me` or `POST /api/products` with `Authorization: Bearer <TOKEN>` → 200/201.
4. Without a token or with an invalid token → **401 Unauthorized**.

## Rate limiting (express-rate-limit)
- General: all `/api/*` routes → max **100 requests / 15 min** per IP.
- Login: `POST /api/auth/login` → max **5 requests / 15 min** per IP.
- When exceeded: **429 Too Many Requests** with `{ "success": false, "message": "..." }`.
- Test: send 6 login requests in a row (the 6th returns 429), and 101 `GET /api/products` requests.
  Restart the server to reset the counters.

## Installation and running
```bash
cd backend
npm install
cp .env.example .env      # then edit .env
npm run seed              # optional: insert sample products
npm run dev               # or: npm start   -> http://localhost:3000
```
Requires Node.js 18+.

## MongoDB and environment variables
- **Atlas:** create a free cluster, a database user, allow your IP in *Network Access*, then copy the connection string
  (e.g. `mongodb+srv://<user>:<password>@cluster.mongodb.net/dzstore?retryWrites=true&w=majority`).
- **Local:** install MongoDB Community Server and use `mongodb://127.0.0.1:27017/dzstore`.
- Edit `.env` (see `.env.example`):

| Variable | Description |
|---|---|
| `PORT` | API port (default 3000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs (use a long random string) |
| `JWT_EXPIRES_IN` | Token lifetime (default `1h`) |
| `CLIENT_URL` | Allowed CORS origin(s), comma separated (default `http://localhost:5173`) |\n| `ADMIN_EMAIL` | Optional email address that is granted the admin role at registration |
| `OAUTH_ISSUER`, `OAUTH_JWKS_URI`, `OAUTH_AUDIENCE`, `OAUTH_USERINFO_URL` | OAuth2/OIDC provider settings (optional) |

> `.env` is excluded by `.gitignore`. Never commit real credentials or secrets.

## Preparation for React integration
All endpoints return JSON, CORS allows the Vite dev origin, and product fields are consistent.
When the frontend is connected later, map `imageUrl` → `image` (the React app currently uses `image`) and use `id` as the product key.

## Admin and user pages
Set `ADMIN_EMAIL` in `backend/.env` to the email address you will use for the administrator account, then register that address in the app. Other registrations receive the `user` role. Product create/update/delete routes verify the user's role on the server; hiding the Admin button is only a frontend convenience, not the security boundary. Existing users must be newly registered with the configured admin email (or have their role changed directly by a trusted database administrator). The frontend theme preference is stored locally in the browser.
