/**
 * Auth Routes
 * -----------
 * Handles user authentication and identity:
 * - POST /auth/register → create a new user and issue JWT
 * - POST /auth/login    → verify credentials and issue JWT
 * - GET  /auth/me       → return current user profile (protected)
 *
 * Uses:
 * - bcrypt for password hashing
 * - JWT for stateless authentication
 * - requireAuth middleware to protect private routes
 */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const requireAuth = require("../auth/requireAuth");

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ error: "User name, Email and password are required" });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password before storing (never store plain text)
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user and return generated user id
    const result = await pool.query(
      "INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING id", // inserting user_name, email & password
      [userName, email, passwordHash],
    );

    // Ensure JWT secret is configured
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in .env file");
    }

    // Issue JWT for newly registered user
    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await pool.query(
      "SELECT id, password FROM users WHERE email = $1",
      [email],
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare provided password with stored hash
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.rows[0].password,
    );

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Issue JWT for authenticated user
    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route GET /auth/me
 * @desc Get the profile of the currently authenticated user
 * @access Private
 */
router.get("/me", requireAuth, async (req, res) => {
  try {
    // Fetch authenticated user's profile using userId from JWT
    const result = await pool.query(
      "SELECT id, email, user_name, group_graduation_year FROM users WHERE id = $1",
      [req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
