const express = require("express");
const router = express.Router();
const pool = require("../db"); // Import the PostgreSQL connection pool

/**
 * @route GET /kids
 * @desc Get all kids from the database
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    // Query all kids, ordered by ID
    const result = await pool.query("SELECT * FROM kids ORDER BY id");
    res.json(result.rows); // Send the array of kids as JSON
  } catch (err) {
    console.error("Error fetching kids:", err);
    res.status(500).json({ error: "Failed to fetch kids" }); // Handle errors
  }
});

/**
 * @route GET /kids/:id
 * @desc Get a single kid by their ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from URL parameters
    const result = await pool.query("SELECT * FROM kids WHERE id = $1", [id]); // Parameterized query

    if (result.rows.length === 0) {
      // If no kid is found
      return res.status(404).json({ error: "Kid not found" });
    }

    res.json(result.rows[0]); // Send the single kid object
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
    const {
      name,
      birthday,
      school,
      phone,
      parent_phone,
      photo,
      parentname,
      address,
    } = req.body; // Extract data from request body

    if (!name) {
      return res.status(400).json({ error: "Name is required" }); // Validate input
    }

    // Insert new kid into the database
    const result = await pool.query(
      `INSERT INTO kids 
   (name, school, phone, parent_phone, birthday, photo, parentname, address) 
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        name,
        school,
        phone,
        parent_phone,
        birthday,
        photo,
        parentname || null,
        address || null,
      ]
    );

    res.status(201).json(result.rows[0]); // Return the newly created kid
  } catch (err) {
    console.error("Error creating kid:", err);
    res.status(500).json({ error: "Failed to create kid" });
  }
});

/**
 * @route PUT /kids/:id
 * @desc Update an existing kid
 * @access Public
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      birthday,
      school,
      parentname,
      phone,
      parent_phone,
      address,
      photo,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Update kid's data in the database
    const result = await pool.query(
      `UPDATE kids 
       SET name = $1, 
           birthday = $2, 
           school = $3, 
           parentname = $4, 
           phone = $5, 
           parent_phone = $6, 
           address = $7, 
           photo = $8, 
           updated_at = NOW() 
       WHERE id = $9 
       RETURNING *`,
      [
        name,
        birthday || null,
        school,
        parentname,
        phone,
        parent_phone,
        address,
        photo || "",
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Kid not found" }); // Kid does not exist
    }

    res.json(result.rows[0]); // Return the updated kid
  } catch (err) {
    console.error("Error updating kid:", err);
    res.status(500).json({ error: "Failed to update kid" });
  }
});

/**
 * @route DELETE /kids/:id
 * @desc Delete a kid from the database
 * @access Public
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the kid and return the deleted record
    const result = await pool.query(
      "DELETE FROM kids WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Kid not found" });
    }

    res.json({ message: "Kid deleted successfully" }); // Confirm deletion
  } catch (err) {
    console.error("Error deleting kid:", err);
    res.status(500).json({ error: "Failed to delete kid" });
  }
});

module.exports = router;

/**
 * ===================== NOTE =====================
 * This file defines the API endpoints for managing "kids":
 * - GET /kids → list all kids
 * - GET /kids/:id → get a specific kid by ID
 * - POST /kids → create a new kid
 * - PUT /kids/:id → update an existing kid
 * - DELETE /kids/:id → delete a kid
 *
 * Key concepts:
 * - `req.params` → used to get URL parameters like ID
 * - `req.body` → contains data sent by client for POST/PUT
 * - `pool.query(...)` → executes SQL queries safely using parameterized queries
 * - Error handling returns proper HTTP status codes
 *
 * This router is mounted in server.js with:
 *   app.use("/kids", kidsRoutes)
 * so all routes are prefixed with /kids
 */
