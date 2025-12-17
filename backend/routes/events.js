const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * @route GET /events
 * @desc Get all events with optional filtering, sorting, and pagination
 * Returns frontend-friendly fields and pagination metadata
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const { year, name, startDate, endDate, sortBy, order, page, limit } =
      req.query;

    const params = [];
    let baseWhere = "WHERE 1=1";

    // --------------------
    // Filtering
    // --------------------
    if (year && !isNaN(Number(year))) {
      params.push(Number(year));
      baseWhere += ` AND EXTRACT(YEAR FROM eventstartdate) = $${params.length}`;
    }

    if (name) {
      params.push(`%${name}%`);
      baseWhere += ` AND eventname ILIKE $${params.length}`;
    }

    if (startDate && !isNaN(Date.parse(startDate))) {
      params.push(startDate);
      baseWhere += ` AND eventstartdate >= $${params.length}`;
    }

    if (endDate && !isNaN(Date.parse(endDate))) {
      params.push(endDate);
      baseWhere += ` AND eventenddate <= $${params.length}`;
    }

    // --------------------
    // Sorting
    // --------------------
    const allowedSort = ["eventname", "eventstartdate", "eventenddate"];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : "eventstartdate";
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
      `SELECT COUNT(*) FROM events ${baseWhere}`,
      params
    );

    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limitNum);

    // --------------------
    // Data query
    // --------------------
    const dataQuery = `
      SELECT * FROM events
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
      eventstartdate: r.eventstartdate?.toISOString().split("T")[0],
      eventenddate: r.eventenddate?.toISOString().split("T")[0],
      eventstarttime: r.eventstarttime?.slice(0, 5),
      eventendtime: r.eventendtime?.slice(0, 5),
      duration:
        r.eventenddate && r.eventstartdate
          ? (new Date(r.eventenddate) - new Date(r.eventstartdate)) /
            (1000 * 60 * 60 * 24)
          : null,
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
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

/**
 * @route GET /events/:id
 * @desc Get a single event by ID with frontend-friendly formatting
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM events WHERE eventid = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event record not found" });
    }

    const r = result.rows[0];

    const row = {
      ...r,
      eventstartdate: r.eventstartdate?.toISOString().split("T")[0],
      eventenddate: r.eventenddate?.toISOString().split("T")[0],
      eventstarttime: r.eventstarttime?.slice(0, 5),
      eventendtime: r.eventendtime?.slice(0, 5),
      duration:
        r.eventenddate && r.eventstartdate
          ? (new Date(r.eventenddate) - new Date(r.eventstartdate)) /
            (1000 * 60 * 60 * 24)
          : null,
    };

    res.json(row);
  } catch (err) {
    console.error("Error fetching event record:", err);
    res.status(500).json({ error: "Failed to fetch event record" });
  }
});

/**
 * @route POST /events
 * @desc Create a new event
 * Validates required fields and date ranges
 * @access Public
 */
router.post("/", async (req, res) => {
  try {
    const {
      eventname,
      eventstartdate,
      eventenddate,
      eventstarttime,
      eventendtime,
      eventphoto,
      eventassignedpeople,
    } = req.body;

    // Validation
    if (!eventname || typeof eventname !== "string") {
      return res.status(400).json({ error: "Invalid or missing eventname" });
    }
    if (!eventstartdate || isNaN(Date.parse(eventstartdate))) {
      return res
        .status(400)
        .json({ error: "Invalid or missing eventstartdate" });
    }
    if (!eventenddate || isNaN(Date.parse(eventenddate))) {
      return res.status(400).json({ error: "Invalid or missing eventenddate" });
    }
    if (new Date(eventenddate) < new Date(eventstartdate)) {
      return res
        .status(400)
        .json({ error: "eventenddate cannot be before eventstartdate" });
    }

    const result = await pool.query(
      `INSERT INTO events
       (eventname, eventstartdate, eventenddate, eventstarttime, eventendtime, eventphoto, eventassignedpeople)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        eventname,
        eventstartdate,
        eventenddate,
        eventstarttime || null,
        eventendtime || null,
        eventphoto || null,
        eventassignedpeople || null,
      ]
    );

    const r = result.rows[0];

    res.status(201).json({
      ...r,
      eventstartdate: r.eventstartdate?.toISOString().split("T")[0],
      eventenddate: r.eventenddate?.toISOString().split("T")[0],
      eventstarttime: r.eventstarttime?.slice(0, 5),
      eventendtime: r.eventendtime?.slice(0, 5),
      duration:
        (new Date(r.eventenddate) - new Date(r.eventstartdate)) /
        (1000 * 60 * 60 * 24),
    });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

/**
 * @route PATCH /events/:id
 * @desc Update an event record (partial update)
 * Validates at least one field is provided and date ranges
 * @access Public
 */
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      eventname,
      eventstartdate,
      eventenddate,
      eventstarttime,
      eventendtime,
      eventphoto,
      eventassignedpeople,
    } = req.body;

    // Validate at least one field is provided
    if (
      eventname === undefined &&
      eventstartdate === undefined &&
      eventenddate === undefined &&
      eventstarttime === undefined &&
      eventendtime === undefined &&
      eventphoto === undefined &&
      eventassignedpeople === undefined
    ) {
      return res.status(400).json({
        error: "At least one event field must be provided",
      });
    }

    // Prevent invalid Date ranges
    if (
      eventstartdate &&
      eventenddate &&
      new Date(eventenddate) < new Date(eventstartdate)
    ) {
      return res.status(400).json({
        error: "eventenddate cannot be before eventstartdate",
      });
    }

    const result = await pool.query(
      `UPDATE events SET 
      eventname = COALESCE($1, eventname), 
      eventstartdate = COALESCE($2, eventstartdate), 
      eventenddate = COALESCE($3, eventenddate), 
      eventstarttime = COALESCE($4, eventstarttime), 
      eventendtime = COALESCE($5, eventendtime), 
      eventphoto = COALESCE($6, eventphoto), 
      eventassignedpeople = COALESCE($7, eventassignedpeople)
      WHERE eventid = $8
      RETURNING *`,
      [
        eventname,
        eventstartdate,
        eventenddate,
        eventstarttime,
        eventendtime,
        eventphoto,
        eventassignedpeople,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event record not found" });
    }

    const r = result.rows[0];

    res.json({
      ...r,
      eventstartdate: r.eventstartdate?.toISOString().split("T")[0],
      eventenddate: r.eventenddate?.toISOString().split("T")[0],
      eventstarttime: r.eventstarttime?.slice(0, 5),
      eventendtime: r.eventendtime?.slice(0, 5),
      duration:
        r.eventenddate && r.eventstartdate
          ? (new Date(r.eventenddate) - new Date(r.eventstartdate)) /
            (1000 * 60 * 60 * 24)
          : null,
    });
  } catch (err) {
    console.error("Error updating event record:", err);
    res.status(500).json({ error: "Failed to update event record" });
  }
});

/**
 * @route DELETE /events/:id
 * @desc Delete a single event by ID
 * @access Public
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "DELETE FROM events WHERE eventid = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0)
    return res.status(404).json({ error: "Event record not found" });

  res.json({ message: "Event deleted successfully", deleted: result.rows[0] });
});

/**
 * @route DELETE /events
 * @desc Bulk delete events by array of IDs
 * @access Public
 */
router.delete("/", async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0)
    return res.status(400).json({ error: "No IDs provided" });

  const result = await pool.query(
    "DELETE FROM events WHERE eventid = ANY($1::int[]) RETURNING *",
    [ids]
  );

  res.json({
    message: "Events deleted successfully",
    deletedCount: result.rows.length,
    deleted: result.rows,
  });
});

module.exports = router;
