const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * @route GET /events
 * @desc Get all events from the database
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const { year } = req.query;
    let query = "SELECT * FROM events";
    const params = [];

    if (year) {
      params.push(Number(year));
      query += ` WHERE EXTRACT(YEAR FROM eventstartdate) = $${params.length}`;
    }

    query += " ORDER BY eventstartdate DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

/**
 * @route GET /events/:id
 * @desc Get event record by ID
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

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching event record:", err);
    res.status(500).json({ error: "Failed to fetch event record" });
  }
});

/**
 * @route POST /events
 * @desc Create a new event
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

    // Validate required fields
    if (!eventname || !eventstartdate || !eventenddate) {
      return res.status(400).json({
        error: "eventname, eventstartdate, and eventenddate are required",
      });
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

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

/**
 * @route PATCH /events/:id
 * @desc Update an event record (partial update)
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

    // Validate that at least one field is provided
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

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating event record: ", err);
    res.status(500).json({ error: "Failed to update event record" });
  }
});
module.exports = router;
