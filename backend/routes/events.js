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
    const { year, term } = req.query;
    let query = "SELECT * FROM events";
    const params = [];

    if (year) {
      params.push(Number(year));
      query += ` WHERE EXTRACT(YEAR FROM eventstartdate) = $${params.length}`;
    }

    if (term) {
      params.push(Number(term));
      query +=
        params.length === 1
          ? ` WHERE term = $${params.length}`
          : ` AND term = $${params.length}`;
    }

    query += " ORDER BY eventid DESC";

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
      EventName,
      EventStartDate,
      EventEndDate,
      EventStartTime,
      EventEndTime,
      EventPhoto,
      EventAssignedPeople,
    } = req.body;

    if (!EventName) {
      return res.status(400).json({ error: "Event name is required" });
    }

    const result = await pool.query(
      `INSERT INTO events 
   (eventname, eventstartdate, eventenddate, eventstarttime, eventendtime, eventphoto, eventassignedpeople) 
   VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        EventName,
        EventStartDate,
        EventEndDate,
        EventStartTime,
        EventEndTime,
        EventPhoto,
        EventAssignedPeople,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

module.exports = router;
