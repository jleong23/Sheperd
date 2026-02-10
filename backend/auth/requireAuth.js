/**
 * Auth Middleware - Protect private routes
 */

const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization; // Read Authorization header

  // Ensure Bearer token is present
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // Extract token from header
  const token = authHeader.split(" ")[1];

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to request for downstream handlers

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = requireAuth;
