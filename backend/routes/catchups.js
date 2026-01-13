const express = require("express");
const router = express.Router();
const pool = require("../db");

// Helper to format Date objects to YYYY-MM-DD using local time
// This prevents timezone shifts that occur when using toISOString() on a local Date object
const formatDate = (d) => {
  if (!d) return null;
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * @route GET /catchups
 * @desc Get all catchups with optional filtering, sorting, and pagination
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const {
      kidid,
      purpose,
      startDate,
      endDate,
      catchupdate,
      sortBy,
      order,
      page,
      limit,
    } = req.query;

    const params = [];
    let baseWhere = "WHERE 1=1";

    // --------------------
    // Filtering
    // --------------------
    if (kidid && !isNaN(Number(kidid))) {
      params.push(Number(kidid));
      baseWhere += ` AND c.kidid = $${params.length}`;
    }

    if (purpose) {
      params.push(`%${purpose}%`);
      baseWhere += ` AND c.catchuppurpose ILIKE $${params.length}`;
    }

    if (startDate && !isNaN(Date.parse(startDate))) {
      params.push(startDate);
      baseWhere += ` AND c.catchupdate >= $${params.length}`;
    }

    if (endDate && !isNaN(Date.parse(endDate))) {
      params.push(endDate);
      baseWhere += ` AND c.catchupdate <= $${params.length}`;
    }

    // Fix: Allow filtering by exact catchupdate date
    if (catchupdate && !isNaN(Date.parse(catchupdate))) {
      params.push(catchupdate);
      baseWhere += ` AND c.catchupdate = $${params.length}`;
    }

    // --------------------
    // Sorting
    // --------------------
    const allowedSort = ["catchupdate", "kidid", "createdat"];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : "catchupdate";
    const sortOrder = order === "asc" ? "ASC" : "DESC";

    // --------------------
    // Pagination
    // --------------------
    const limitNum = parseInt(limit) || 20;
    const pageNum = parseInt(page) || 1;
    const offset = (pageNum - 1) * limitNum;

    // --------------------
    // Count query
    // --------------------
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM catchups c ${baseWhere}`,
      params
    );

    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limitNum);

    // --------------------
    // Data query with JOIN to get kid name
    // --------------------
    const dataQuery = `
      SELECT c.*, k.name AS kidName, k.status_code AS kidStatus, k.baptised AS kidBaptised, k.sunday_regulars AS kidSundayRegulars
      FROM catchups c
      JOIN kids k ON c.kidid = k.id
      ${baseWhere}
      ORDER BY ${sortColumn} ${sortOrder}
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `;

    const result = await pool.query(dataQuery, [...params, limitNum, offset]);

    // --------------------
    // Frontend-friendly formatting
    // --------------------
    const rows = result.rows.map((r) => ({
      ...r,
      catchupdate: formatDate(r.catchupdate),
      catchupstarttime: r.catchupstarttime?.slice(0, 5),
      catchupendtime: r.catchupendtime?.slice(0, 5),
      updatedat: r.updatedat?.toISOString(),
      createdat: r.createdat?.toISOString(),
    }));

    res.json({
      data: rows,
      pagination: {
        totalCount,
        totalPages,
        page: pageNum,
        limit: limitNum,
      },
    });
  } catch (err) {
    console.error("Error fetching catchups:", err);
    res.status(500).json({ error: "Failed to fetch catchups" });
  }
});

/**
 * @route GET /catchups/:id
 * @desc Get a single catchup by ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM catchups WHERE catchupid = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Catchup record not found" });
    }

    const r = result.rows[0];

    const row = {
      ...r,
      catchupdate: formatDate(r.catchupdate),
      catchupstarttime: r.catchupstarttime?.slice(0, 5),
      catchupendtime: r.catchupendtime?.slice(0, 5),
      updatedat: r.updatedat?.toISOString(),
      createdat: r.createdat?.toISOString(),
    };

    res.json(row);
  } catch (err) {
    console.error("Error fetching catchup record:", err);
    res.status(500).json({ error: "Failed to fetch catchup record" });
  }
});

/**
 * @route POST /catchups
 * @desc Create a new catchup
 * @access Public
 */
router.post("/", async (req, res) => {
  try {
    const {
      kidid,
      catchupdate,
      catchupstarttime,
      catchupendtime,
      catchuppurpose,
      catchupcomments,
    } = req.body;

    // Validation
    if (!kidid || isNaN(Number(kidid))) {
      return res.status(400).json({ error: "Invalid or missing kidid" });
    }
    if (!catchupdate || isNaN(Date.parse(catchupdate))) {
      return res.status(400).json({ error: "Invalid or missing catchupdate" });
    }

    const result = await pool.query(
      `INSERT INTO catchups
       (kidid, catchupdate, catchupstarttime, catchupendtime, catchuppurpose, catchupcomments)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        kidid,
        catchupdate,
        catchupstarttime || null,
        catchupendtime || null,
        catchuppurpose || null,
        catchupcomments || null,
      ]
    );

    const r = result.rows[0];

    res.status(201).json({
      ...r,
      catchupdate: formatDate(r.catchupdate),
      catchupstarttime: r.catchupstarttime?.slice(0, 5),
      catchupendtime: r.catchupendtime?.slice(0, 5),
    });
  } catch (err) {
    console.error("Error creating catchup:", err);
    res.status(500).json({ error: "Failed to create catchup" });
  }
});

/**
 * @route PATCH /catchups/:id
 * @desc Update a catchup record (partial update)
 * @access Public
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      kidid,
      catchupdate,
      catchupstarttime,
      catchupendtime,
      catchuppurpose,
      catchupcomments,
    } = req.body;

    // Validate at least one field is provided
    if (
      kidid === undefined &&
      catchupdate === undefined &&
      catchupstarttime === undefined &&
      catchupendtime === undefined &&
      catchuppurpose === undefined &&
      catchupcomments === undefined
    ) {
      return res.status(400).json({
        error: "At least one field must be provided",
      });
    }

    const result = await pool.query(
      `UPDATE catchups SET 
      kidid = COALESCE($1, kidid), 
      catchupdate = COALESCE($2, catchupdate), 
      catchupstarttime = COALESCE($3, catchupstarttime), 
      catchupendtime = COALESCE($4, catchupendtime), 
      catchuppurpose = COALESCE($5, catchuppurpose), 
      catchupcomments = COALESCE($6, catchupcomments),
      updatedat = CURRENT_TIMESTAMP
      WHERE catchupid = $7
      RETURNING *`,
      [
        kidid,
        catchupdate,
        catchupstarttime,
        catchupendtime,
        catchuppurpose,
        catchupcomments,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Catchup record not found" });
    }

    const r = result.rows[0];

    res.json({
      ...r,
      catchupdate: formatDate(r.catchupdate),
      catchupstarttime: r.catchupstarttime?.slice(0, 5),
      catchupendtime: r.catchupendtime?.slice(0, 5),
      updatedat: r.updatedat?.toISOString(),
    });
  } catch (err) {
    console.error("Error updating catchup record:", err);
    res.status(500).json({ error: "Failed to update catchup record" });
  }
});

/**
 * @route DELETE /catchups/:id
 * @desc Delete a single catchup by ID
 * @access Public
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "DELETE FROM catchups WHERE catchupid = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0)
    return res.status(404).json({ error: "Catchup record not found" });

  res.json({
    message: "Catchup deleted successfully",
    deleted: result.rows[0],
  });
});

/**
 * @route DELETE /catchups
 * @desc Bulk delete catchups by array of IDs
 * @access Public
 */
router.delete("/", async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0)
    return res.status(400).json({ error: "No IDs provided" });

  const result = await pool.query(
    "DELETE FROM catchups WHERE catchupid = ANY($1::int[]) RETURNING *",
    [ids]
  );

  res.json({
    message: "Catchups deleted successfully",
    deletedCount: result.rows.length,
    deleted: result.rows,
  });
});

module.exports = router;
