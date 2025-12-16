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
    const result = await pool.query("SELECT * FROM events ORDER BY eventid");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
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
