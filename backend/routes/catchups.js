const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * @route GET /catchups
 * @desc Get catchups records with optional
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const { year, name, purpose, comments, sortBy, order, page, limit } =
      req.query;

    const params = [];
    let baseWhere = "WHERE 1=1";

    // --------------------
    // Filtering
    // --------------------
    if (year && !isNaN(Number(year))) {
      params.push(Number(year));
      baseWhere += ` AND EXTRACT(YEAR FROM catchup_date) = $${params.length}`;
    }

    if (name) {
      params.push(`%${name}%`);
      baseWhere += ` AND kid_name ILIKE $${params.length}`;
    }

    if (purpose) {
      params.push(`%${purpose}%`);
      baseWhere += ` AND purpose ILIKE $${params.length}`;
    }

    if (comments) {
      params.push(`%${comments}%`);
      baseWhere += ` AND comments ILIKE $${params.length}`;
    }

    // --------------------
    // Sorting
    // --------------------
    const allowedSort = ["kid_name", "start_time", "end_time", "catchup_date"];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : "catchup_date";
    const sortOrder = order === "asc" ? "ASC" : "DESC";

    // --------------------
    // Pagination
    // --------------------
    const limitNum = parseInt(limit) || 20;
    const pageNum = parseInt(page) || 1;
    const offset = (pageNum - 1) * limitNum;

    // --------------------
    // Count query (NO limit / offset)
    // --------------------
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM catchups ${baseWhere}`,
      params
    );

    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limitNum);

    // --------------------
    // Data query
    // --------------------
    const dataQuery = `
      SELECT * FROM catchups
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
    }));
  } catch {}
});
