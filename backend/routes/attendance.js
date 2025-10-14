const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * @route GET /attendance
 * @desc Get attendance records with optional year and term filters
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const { year, term } = req.query;

    let query = "SELECT * FROM attendance";
    const params = [];

    // Filter by year if provided
    if (year) {
      params.push(Number(year));
      query += ` WHERE EXTRACT(YEAR FROM created_at) = $${params.length}`;
    }

    // Filter by term if provided
    if (term) {
      params.push(Number(term));
      query +=
        params.length === 1
          ? ` WHERE term = $${params.length}`
          : ` AND term = $${params.length}`;
    }

    query += " ORDER BY week DESC, kidId";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

/**
 * @route GET /attendance/:id
 * @desc Get attendance record by ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM attendance WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching attendance record:", err);
    res.status(500).json({ error: "Failed to fetch attendance record" });
  }
});

/**
 * @route POST /attendance
 * @desc Create a new attendance record
 * @access Public
 */
router.post("/", async (req, res) => {
  try {
    const {
      kidId,
      name,
      week,
      present = false,
      reason = "",
      photo = "",
      term = 1,
    } = req.body;

    // Validate required fields
    if (!kidId || !week) {
      return res.status(400).json({ error: "kidId and week are required" });
    }

    // Check if kid exists
    const kidCheck = await pool.query("SELECT * FROM kids WHERE id = $1", [
      kidId,
    ]);
    if (kidCheck.rows.length === 0) {
      return res.status(400).json({ error: "Kid not found" });
    }

    // Use the kid's name from the database if not provided
    const kidName = name || kidCheck.rows[0].name;
    const kidPhoto = photo || kidCheck.rows[0].photo;

    const result = await pool.query(
      "INSERT INTO attendance (kidId, name, week, present, reason, photo, term) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [kidId, kidName, week, present, reason, kidPhoto, term]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating attendance record:", err);
    res.status(500).json({ error: "Failed to create attendance record" });
  }
});

/**
 * @route PATCH /attendance/:id
 * @desc Update an attendance record (partial update)
 * @access Public
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { present, reason } = req.body;

    // Validate that at least one field is provided
    if (present === undefined && reason === undefined) {
      return res.status(400).json({
        error: "At least one field (present or reason) must be provided",
      });
    }

    const result = await pool.query(
      "UPDATE attendance SET present = COALESCE($1, present), reason = COALESCE($2, reason), updated_at = NOW() WHERE id = $3 RETURNING *",
      [present, reason, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating attendance record:", err);
    res.status(500).json({ error: "Failed to update attendance record" });
  }
});

/**
 * @route DELETE /attendance/:id
 * @desc Delete an attendance record
 * @access Public
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM attendance WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    res.json({ message: "Attendance record deleted successfully" });
  } catch (err) {
    console.error("Error deleting attendance record:", err);
    res.status(500).json({ error: "Failed to delete attendance record" });
  }
});

module.exports = router;

// Adding years and terms to the attendance table
/**
 * @route POST /attendance/year
 * @desc Add a new year (create attendance records for all kids)
 * @access Public
 */
router.post("/year", async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) return res.status(400).json({ error: "Year is required" });

    // Fetch all kids
    const kidsResult = await pool.query("SELECT id, name, photo FROM kids");
    const kids = kidsResult.rows;

    // By default, term 1 and 10 weeks
    const term = 1;
    const weeks = 10;

    // Generate attendance records for each kid for each week
    const records = [];
    for (const kid of kids) {
      for (let week = 1; week <= weeks; week++) {
        records.push([
          kid.id,
          kid.name,
          week,
          false,
          "",
          kid.photo,
          term,
          year,
        ]);
      }
    }

    // Insert into attendance table
    const insertQuery = `
    INSERT INTO attendance (kidId, name, week, present, reason, photo, term, year)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;

    for (const record of records) {
      await pool.query(insertQuery, record);
    }

    res.json({
      message: `Year ${year} added with default term 1 and 10 weeks`,
    });
  } catch (err) {
    console.error("Error adding year: ", err);
    res.status(500).json({ error: "Failed to add year" });
  }
});
