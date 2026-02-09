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

    let query = "SELECT * FROM attendance WHERE user_id = $1";
    const params = [req.userId];

    // Filter by year if provided
    if (year) {
      params.push(Number(year));
      query += ` AND year = $${params.length}`;
    }

    // Filter by term if provided
    if (term) {
      params.push(Number(term));
      query += ` AND term = $${params.length}`;
    }

    query += " ORDER BY week DESC, kidid";

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
    const result = await pool.query(
      "SELECT * FROM attendance WHERE id = $1 AND user_id = $2",
      [id, req.userId],
    );

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
    const { kidId, week, status, reason, name, photo, term, year } = req.body;

    if (!kidId || !week) {
      return res.status(400).json({ error: "kidId and week are required" });
    }

    const validStatuses = ["coming", "maybe", "not coming"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid attendance status" });
    }

    const kidCheck = await pool.query(
      "SELECT name, photo FROM kids WHERE id = $1 AND user_id = $2",
      [kidId, req.userId],
    );

    if (kidCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Kid not found or does not belong to this user" });
    }

    const result = await pool.query(
      `INSERT INTO attendance
       (kidid, name, week, status, reason, photo, term, year, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, DEFAULT), COALESCE($8, DEFAULT), $9)
       RETURNING *`,
      [
        kidId,
        name || kidCheck.rows[0].name,
        week,
        status || null,
        reason || null,
        photo || kidCheck.rows[0].photo,
        term || null,
        year || null,
        req.userId || null,
      ],
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
    const { status, reason } = req.body;

    if (status === undefined && reason === undefined) {
      return res.status(400).json({
        error: "At least one field (status or reason) must be provided",
      });
    }

    // Validate status enum
    const validStatuses = ["coming", "maybe", "not coming"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid attendance status" });
    }

    const result = await pool.query(
      `UPDATE attendance SET 
         status = COALESCE($1, status), 
         reason = COALESCE($2, reason), 
         updated_at = NOW() 
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [status, reason, id, req.userId],
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
      "DELETE FROM attendance WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.userId],
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

// Adding years and terms to the attendance table -------------
/**
 * @route POST /attendance/year
 * @desc Add a new year (create attendance records for all kids)
 * @access Public
 */
router.post("/year", async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) return res.status(400).json({ error: "Year is required" });

    // Check if the year already exists
    const yearCheck = await pool.query(
      "SELECT 1 FROM attendance WHERE year = $1 AND user_id = $2 LIMIT 1",
      [year, req.userId],
    );
    if (yearCheck.rows.length > 0) {
      return res.status(400).json({ error: `Year ${year} already exists.` });
    }

    // Fetch all kids for the current user
    const kidsResult = await pool.query(
      "SELECT id, name, photo FROM kids WHERE user_id = $1",
      [req.userId],
    );
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
          "maybe",
          "",
          kid.photo,
          term,
          year,
          req.userId,
        ]);
      }
    }

    // Insert into attendance table
    const insertQuery = `
    INSERT INTO attendance (kidId, name, week, status, reason, photo, term, year, user_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;

    const createdRecords = [];
    for (const record of records) {
      const result = await pool.query(insertQuery, record);
      createdRecords.push(result.rows[0]);
    }

    res.json({
      message: `Year ${year} added with default term 1 and 10 weeks`,
      createdRecords,
    });
  } catch (err) {
    console.error("Error adding year: ", err);
    res.status(500).json({ error: "Failed to add year" });
  }
});

/**
 * @route POST /attendance/term
 * @desc Add a new term (create attendance records for all kids for the new term)
 * @access Public
 */
router.post("/term", async (req, res) => {
  try {
    const { year, term, weeks = 10 } = req.body;

    if (!year || !term)
      return res.status(400).json({ error: "Year & Term is required" });

    // Fetch all kids for the current user
    const kidsResult = await pool.query(
      "SELECT id, name, photo FROM kids WHERE user_id = $1",
      [req.userId],
    );
    const kids = kidsResult.rows;

    // Generate attendance records
    const records = [];
    for (const kid of kids) {
      for (let week = 1; week <= weeks; week++) {
        records.push([
          kid.id,
          kid.name,
          week,
          "maybe",
          "",
          kid.photo,
          term,
          year,
          req.userId,
        ]);
      }
    }

    // Insert into attendance tables
    const insertQuery = `
      INSERT INTO attendance (kidId, name, week, status, reason, photo, term, year, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    for (const record of records) {
      await pool.query(insertQuery, record);
    }

    res.json({
      message: `Term ${term} added for year ${year} with ${weeks} weeks`,
    });
  } catch (err) {
    console.log("Error adding term: ", err);
    res.status(500).json({ error: "Failed to add term" });
  }
});

// Deleting years and terms to the attendance table -------------
/**
 * @route DELETE/attendance/year
 * @desc Delete a year
 * @access public
 */
router.delete("/year/:year", async (req, res) => {
  try {
    const { year } = req.params;
    const result = await pool.query(
      "DELETE FROM attendance WHERE year = $1 AND user_id = $2 RETURNING *",
      [year, req.userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Year not found" });
    }

    res.json({ message: `Year ${year} deleted succesfully` });
  } catch (err) {
    console.error("Error deleting attendance record: ", err);
    res.status(500).json({ error: "Failed to delete year" });
  }
});

/**
 * @route DELETE/attendance/term
 * @desc Delete a term in a year
 * @access public
 */
router.delete("/term/:year/:term", async (req, res) => {
  try {
    const { year, term } = req.params;

    if (!year || !term) {
      return res.status(400).json({ error: "Year and term are required" });
    }

    // Delele all attendance records for the year and term
    const result = await pool.query(
      "DELETE FROM attendance WHERE year = $1 AND term = $2 AND user_id = $3 RETURNING *",
      [Number(year), Number(term), req.userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "No records found for that year and term",
      });
    }

    res.json({
      message: `Deleted all records for Year ${year} and Term ${term}`,
      deletedCount: result.rowCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete term" });
  }
});

module.exports = router;
