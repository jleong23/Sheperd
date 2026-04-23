/**
 * auth/requireAuth.js - AUTH middleware
 * Protects routes by validating Supabase JWT tokens.
 *
 * Flow:
 * 1. Extract Bearer token from Authorization header
 * 2. Validate token via Supabase Auth
 * 3. Attach user info to request object
 * 4. Proceed to next middleware/route
 *
 * - Uses Supabase Auth instead of custom JWT verification
 * - req.user → full Supabase user object
 * - req.userId → convenience shortcut
 */
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const requireAuth = async (req, res, next) => {
  try {
    // 1. Extract Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }

    // 2. Extract token
    const token = authHeader.replace("Bearer ", "");

    // 3. Validate token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid token or expired token" });
    }

    // 4. Attach authenticated user to request
    req.user = data.user;
    req.userId = data.user.id;

    // 5. Continue to next middleware
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = requireAuth;
