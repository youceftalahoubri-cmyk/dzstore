const jwt = require("jsonwebtoken");
const { createRemoteJWKSet, jwtVerify } = require("jose");
const HttpError = require("../utils/HttpError");
const User = require("../models/User");

let jwks; // cached remote key set of the OAuth2/OIDC provider

// 1) Local JWT issued by POST /api/auth/login
function verifyLocalJwt(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return { type: "local", userId: payload.sub, email: payload.email };
}

// 2) OAuth2 / OpenID Connect token issued by an external provider (e.g. Google)
async function verifyOAuthToken(token) {
  const { OAUTH_ISSUER, OAUTH_JWKS_URI, OAUTH_AUDIENCE, OAUTH_USERINFO_URL } = process.env;
  if (!OAUTH_JWKS_URI && !OAUTH_USERINFO_URL) throw new Error("OAuth2 not configured");

  // JWT-formatted token (e.g. OIDC ID token): verify signature, issuer and audience
  if (token.split(".").length === 3 && OAUTH_JWKS_URI) {
    jwks = jwks || createRemoteJWKSet(new URL(OAUTH_JWKS_URI));
    const options = {};
    if (OAUTH_ISSUER) options.issuer = OAUTH_ISSUER;
    if (OAUTH_AUDIENCE) options.audience = OAUTH_AUDIENCE;
    const { payload } = await jwtVerify(token, jwks, options);
    return { type: "oauth", userId: payload.sub, email: payload.email };
  }

  // Opaque access token: validate it with the provider's userinfo endpoint
  if (OAUTH_USERINFO_URL) {
    const r = await fetch(OAUTH_USERINFO_URL, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) throw new Error("Provider rejected the access token");
    const info = await r.json();
    return { type: "oauth", userId: info.sub, email: info.email };
  }
  throw new Error("Unable to verify OAuth2 token");
}

// Extracts "Authorization: Bearer <token>", verifies it, or answers 401
async function authenticate(req, _res, next) {
  try {
    const [scheme, token] = (req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new HttpError(401, "Authentication required: send 'Authorization: Bearer <token>'");
    }
    try {
      req.auth = verifyLocalJwt(token);
      return next();
    } catch (_) { /* not a local JWT, try OAuth2 */ }
    try {
      req.auth = await verifyOAuthToken(token);
      return next();
    } catch (_) {
      throw new HttpError(401, "Invalid or expired token");
    }
  } catch (err) {
    next(err);
  }
}

async function requireAdmin(req, _res, next) {
  try {
    if (!req.auth || req.auth.type !== "local") throw new HttpError(403, "Admin access required");
    const user = await User.findById(req.auth.userId).select("role");
    if (!user || user.role !== "admin") throw new HttpError(403, "Admin access required");
    next();
  } catch (err) { next(err); }
}

module.exports = { authenticate, requireAdmin };
