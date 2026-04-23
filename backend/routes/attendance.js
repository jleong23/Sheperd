const express = require("express");
const router = express.Router();
const createSupabaseClient = require("../supabaseClient");

/**
 * @route GET /attendance
 * @desc Get attendance records with optional year and term filters
 * @access Public
 */
router.get("/",async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { year, term } = req.query;

    let query = supabase
        .from("attendance")
        .select("*")
        .eq("user_id", req.userId);

    // Filter by year if provided
    if (year) {
      query = query.eq("year", Number(year));
    }

    // Filter by term if provided
    if (term) {
      query = query.eq("term", Number(term));
    }

    const { data, error } = await query
      .order("week", { ascending: false })
      .order("kidid");
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
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
  const supabase = createSupabaseClient(req);
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Attendance record not found" });
    }
    res.json(data);
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
  const supabase = createSupabaseClient(req);
  try {
    const { kidId, week, status, reason, name, term, year } = req.body;

    if (!kidId || !week) {
      return res.status(400).json({ error: "kidId and week are required" });
    }

    const validStatuses = ["coming", "maybe", "not coming"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid attendance status" });
    }

    const { data: kidCheck, error: kidError } = await supabase
      .from("kids")
      .select("name")
      .eq("id", kidId)
      .eq("user_id", req.userId)
      .single();

    if (kidError || !kidCheck) {
      return res
        .status(404)
        .json({ error: "Kid not found or does not belong to this user" });
    }

    const { data, error } = await supabase
      .from("attendance")
      .insert({
        kidid: kidId,
        name: name || kidCheck.name,
        week,
        status: status || "maybe",
        reason: reason || null,
        term: term || null,
        year: year || null,
        user_id: req.userId,
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
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
  const supabase = createSupabaseClient(req);
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

    const updatePayload = { updated_at: new Date() };
    if (status !== undefined) updatePayload.status = status;
    if (reason !== undefined) updatePayload.reason = reason;

    const { data, error } = await supabase
      .from("attendance")
      .update(updatePayload)
      .eq("id", id)
      .eq("user_id", req.userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
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
  const supabase = createSupabaseClient(req);
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("attendance")
      .delete()
      .eq("id", id)
      .eq("user_id", req.userId);

    if (error) return res.status(400).json({ error: error.message });

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
  const supabase = createSupabaseClient(req);
  try {
    const { year } = req.body;

    if (!year) return res.status(400).json({ error: "Year is required" });

    // Check if the year already exists
    const { count, error: countError } = await supabase
      .from("attendance")
      .select("user_id", { count: "exact", head: true })
      .eq("year", year)
      .eq("user_id", req.userId);
    if (countError) return res.status(400).json({ error: countError.message });
    if (count > 0) {
      return res.status(400).json({ error: `Year ${year} already exists.` });
    }

    // Fetch all kids for the current user
    const { data: kids, error: kidsError } = await supabase
      .from("kids")
      .select("id, name")
      .eq("user_id", req.userId);
    if (kidsError) return res.status(400).json({ error: kidsError.message });

    // By default, term 1 and 10 weeks
    const term = 1;
    const weeks = 10;

    // Generate attendance records for each kid for each week
    const records = [];
    for (const kid of kids) {
      for (let week = 1; week <= weeks; week++) {
        records.push({
          kidid: kid.id,
          name: kid.name,
          week,
          status: "maybe",
          reason: "",
          term,
          year,
          user_id: req.userId,
        });
      }
    }

    // Insert into attendance table
    const { data: createdRecords, error: insertError } = await supabase
      .from("attendance")
      .insert(records)
      .select();
    if (insertError) return res.status(400).json({ error: insertError.message });

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
  const supabase = createSupabaseClient(req);
  try {
    const { year, term, weeks = 10 } = req.body;

    if (!year || !term)
      return res.status(400).json({ error: "Year & Term is required" });

    // Fetch all kids for the current user
    const { data: kids, error: kidsError } = await supabase
      .from("kids")
      .select("id, name")
      .eq("user_id", req.userId);
    if (kidsError) return res.status(400).json({ error: kidsError.message });

    // Generate attendance records
    const records = [];
    for (const kid of kids) {
      for (let week = 1; week <= weeks; week++) {
        records.push({
          kidid: kid.id,
          name: kid.name,
          week,
          status: "maybe",
          reason: "",
          term,
          year,
          user_id: req.userId,
        });
      }
    }

    // Insert into attendance tables
    const { data, error: insertError } = await supabase
      .from("attendance")
      .insert(records)
      .select();
    if (insertError) return res.status(400).json({ error: insertError.message });

    res.json({
      message: `Term ${term} added for year ${year} with ${weeks} weeks`,
      createdRecords: data,
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
  const supabase = createSupabaseClient(req);
  try {
    const { year } = req.params;
    const { error } = await supabase
      .from("attendance")
      .delete()
      .eq("year", year)
      .eq("user_id", req.userId);
    if (error) return res.status(400).json({ error: error.message });

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
  const supabase = createSupabaseClient(req);
  try {
    const { year, term } = req.params;

    if (!year || !term) {
      return res.status(400).json({ error: "Year and term are required" });
    }

    // Delele all attendance records for the year and term
    const { count, error } = await supabase
      .from("attendance")
      .delete({ count: "exact" })
      .eq("year", Number(year))
      .eq("term", Number(term))
      .eq("user_id", req.userId);

    if (error) return res.status(400).json({ error: error.message });

    if (count === 0) {
      return res.status(404).json({
        error: "No records found for that year and term",
      });
    }

    res.json({
      message: `Deleted all records for Year ${year} and Term ${term}`,
      deletedCount: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete term" });
  }
});

module.exports = router;
