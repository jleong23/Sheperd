const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * @route GET /kids
 * @desc Get all kids
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM kids ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching kids:", err);
    res.status(500).json({ error: "Failed to fetch kids" });
  }
});

/**
 * @route GET /kids/:id
 * @desc Get a kid by ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM kids WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Kid not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching kid:", err);
    res.status(500).json({ error: "Failed to fetch kid" });
  }
});

/**
 * @route POST /kids
 * @desc Create a new kid
 * @access Public
 */
router.post("/", async (req, res) => {
  try {
    const { name, photo } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = await pool.query(
      "INSERT INTO kids (name, photo) VALUES ($1, $2) RETURNING *",
      [name, photo || ""]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating kid:", err);
    res.status(500).json({ error: "Failed to create kid" });
  }
});

/**
 * @route PUT /kids/:id
 * @desc Update a kid
 * @access Public
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, photo } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = await pool.query(
      "UPDATE kids SET name = $1, photo = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [name, photo || "", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Kid not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating kid:", err);
    res.status(500).json({ error: "Failed to update kid" });
  }
});

/**
 * @route DELETE /kids/:id
 * @desc Delete a kid
 * @access Public
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM kids WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Kid not found" });
    }

    res.json({ message: "Kid deleted successfully" });
  } catch (err) {
    console.error("Error deleting kid:", err);
    res.status(500).json({ error: "Failed to delete kid" });
  }
});

module.exports = router;
