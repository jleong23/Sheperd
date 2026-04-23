/**
 * routes/auth.js
 * IMPORTANT:
 * Authentication is handled entirely by Supabase Auth (client-side).
 * These backend routes are intentionally disabled to avoid:
 * - Confusion between JWT and Supabase Auth
 * - Duplicate authentication systems
 * - Security inconsistencies
 *
 * Current Architecture:
 * - Frontend → Supabase Auth (login/register)
 * - Backend → Validates Supabase JWT via requireAuth middleware
 *
 */

const express = require("express");
const router = express.Router();

// Routes removed. Frontend uses Supabase Auth directly.
module.exports = router;
