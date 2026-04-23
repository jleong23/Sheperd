const express = require("express");
const router = express.Router();
const createSupabaseClient = require("../supabaseClient");

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
 * @route GET /events
 * @desc Get all events with optional filtering, sorting, and pagination
 * Returns frontend-friendly fields and pagination metadata
 * @access Public
 */
router.get("/", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { year, name, startDate, endDate, sortBy, order, page, limit } =
      req.query;

    let query = supabase
      .from("events")
      .select("eventid, eventname, eventstartdate, eventenddate, eventstarttime, eventendtime, updated_at", { count: "exact" })
      .eq("user_id", req.userId);

    // --------------------
    // Filtering
    // --------------------
    if (year && !isNaN(Number(year))) {
      query = query
        .gte("eventstartdate", `${year}-01-01`)
        .lte("eventstartdate", `${year}-12-31`);
    }

    if (name) {
      query = query.ilike("eventname", `%${name}%`);
    }

    if (startDate && !isNaN(Date.parse(startDate))) {
      query = query.gte("eventstartdate", startDate);
    }

    if (endDate && !isNaN(Date.parse(endDate))) {
      query = query.lte("eventenddate", endDate);
    }

    // --------------------
    // Sorting
    // --------------------
    const allowedSort = ["eventname", "eventstartdate", "eventenddate"];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : "eventstartdate";
    const sortOrder = order === "asc";

    // --------------------
    // Pagination
    // --------------------
    const limitNum = parseInt(limit) || 20;
    const pageNum = parseInt(page) || 1;
    const offset = (pageNum - 1) * limitNum;

    query = query
      .order(sortColumn, { ascending: sortOrder })
      .range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;
    if (error) return res.status(400).json({ error: error.message });

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limitNum);

    // --------------------
    // Frontend-friendly formatting
    // --------------------
    const rows = data.map((r) => ({
      ...r,
      eventstartdate: formatDate(r.eventstartdate),
      eventenddate: formatDate(r.eventenddate),
      eventstarttime: r.eventstarttime?.slice(0, 5),
      eventendtime: r.eventendtime?.slice(0, 5),
      updated_at: r.updated_at,
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
  const supabase = createSupabaseClient(req);
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("eventid", id)
      .eq("user_id", req.userId)
      .single();

    if (error) return res.status(400).json({ error: error.message });
    if (!data) {
      return res.status(404).json({ error: "Event record not found" });
    }

    const row = {
      ...data,
      eventstartdate: formatDate(data.eventstartdate),
      eventenddate: formatDate(data.eventenddate),
      eventstarttime: data.eventstarttime?.slice(0, 5),
      eventendtime: data.eventendtime?.slice(0, 5),
      updated_at: data.updated_at,
      duration:
        data.eventenddate && data.eventstartdate
          ? (new Date(data.eventenddate) - new Date(data.eventstartdate)) /
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
  const supabase = createSupabaseClient(req);
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

    const { data, error } = await supabase
      .from("events")
      .insert({
        eventname,
        eventstartdate,
        eventenddate,
        eventstarttime: eventstarttime || null,
        eventendtime: eventendtime || null,
        eventphoto: eventphoto || null,
        eventassignedpeople: eventassignedpeople || null,
        user_id: req.userId,
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({
      ...data,
      eventstartdate: formatDate(data.eventstartdate),
      eventenddate: formatDate(data.eventenddate),
      eventstarttime: data.eventstarttime?.slice(0, 5),
      eventendtime: data.eventendtime?.slice(0, 5),
      duration:
        (new Date(data.eventenddate) - new Date(data.eventstartdate)) /
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
  const supabase = createSupabaseClient(req);
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

    const { data, error } = await supabase
      .from("events")
      .update({
        eventname,
        eventstartdate,
        eventenddate,
        eventstarttime,
        eventendtime,
        eventphoto,
        eventassignedpeople,
        updated_at: new Date(),
      })
      .eq("eventid", id)
      .eq("user_id", req.userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    if (!data) {
      return res.status(404).json({ error: "Event record not found" });
    }

    res.json({
      ...data,
      eventstartdate: formatDate(data.eventstartdate),
      eventenddate: formatDate(data.eventenddate),
      eventstarttime: data.eventstarttime?.slice(0, 5),
      eventendtime: data.eventendtime?.slice(0, 5),
      duration:
        data.eventenddate && data.eventstartdate
          ? (new Date(data.eventenddate) - new Date(data.eventstartdate)) /
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
  const supabase = createSupabaseClient(req);
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("events")
      .delete()
      .eq("eventid", id)
      .eq("user_id", req.userId)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Event record not found" });
    }

    res.json({ message: "Event deleted successfully", deleted: data[0] });
  } catch (err) {
    console.error("Error in delete route:", err);
    res.status(500).json({ error: "Failed to delete event record" });
  }
});

/**
 * @route DELETE /events
 * @desc Bulk delete events by array of IDs
 * @access Public
 */
router.delete("/", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ error: "No IDs provided" });

    const { data, error } = await supabase
      .from("events")
      .delete()
      .in("eventid", ids)
      .eq("user_id", req.userId)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      message: "Events deleted successfully",
      deletedCount: data ? data.length : 0,
      deleted: data,
    });
  } catch (err) {
    console.error("Error in bulk delete route:", err);
    res.status(500).json({ error: "Failed to bulk delete event records" });
  }
});

module.exports = router;
