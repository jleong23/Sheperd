const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * @route GET /users
 * @desc Get all users from the database
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;

    let query = "SELECT * FROM users ";
    const values = [];

    query += " ORDER BY id";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" }); // Handle errors
  }
});

/**
 * @route GET /users/:id
 * @desc Get a single user by their ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL parameters
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]); // Parameterized query

    if (result.rows.length === 0) {
      // If no users is found
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]); // Send the single user object
  } catch (err) {
    console.error(`Error fetching user: ${err}`);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
