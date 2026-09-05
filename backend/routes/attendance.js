/**
 * routes/attendance.js - Attendance Management API
 *
 * This module handles all attendance-related operations for the application,
 * including:
 * - Retrieving attendance records (filtered + paginated)
 * - Creating and updating attendance entries
 * - Managing bulk operations (year/term creation, bulk upserts)
 * - Deleting attendance data by record, year, or term
 *
 * Data model is user-scoped via `leader_id` to ensure multi-tenancy isolation.
 * All queries are restricted using `req.userId`.
 *
 * Core concept:
 * Attendance is structured by:
 * - kidid
 * - week
 * - attendance_terms relationship
 * - leader_id
 */

const express = require("express");
const router = express.Router();
const createSupabaseClient = require("../supabaseClient");
const {
  getVisibleTermOwners,
  getVisibleTermCreators,
} = require("../lib/attendanceHierarchy");

/**
 * @route GET /attendance/terms
 * @desc Get all available attendance years and terms
 * @access Authenticated
 */
router.get("/terms", async (req, res) => {
  const supabase = createSupabaseClient(req);

  try {
    const visibleCreators = await getVisibleTermCreators(supabase, req.userId);

    const { data, error } = await supabase
      .from("attendance_terms")
      .select("*")
      .in("created_by", visibleCreators)
      .order("year", { ascending: false })
      .order("term", { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Failed to fetch attendance terms:", err);
    res.status(500).json({ error: "Failed to fetch attendance terms" });
  }
});

/**
 * @route GET /attendance
 * @desc Get attendance records with optional year and term filters
 * Flow:
 * 1. Build base query scoped to authenticated user
 * 2. Apply optional filters (year, term)
 * 3. Sort by week (descending) and kidid
 * 4. Return filtered dataset
 */
router.get("/", async (req, res) => {
  const supabase = createSupabaseClient(req);

  try {
    const { term_id } = req.query;

    let query = supabase
      .from("attendance")
      .select(
        `
 *,
 attendance_terms(
    year,
    term,
    weeks
 )
`,
      )
      .eq("leader_id", req.userId);

    if (term_id) {
      query = query.eq("term_id", Number(term_id));
    }

    const { data, error } = await query.order("week", { ascending: true });

    if (error)
      return res.status(400).json({
        error: error.message,
      });

    res.json(data);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed fetching attendance",
    });
  }
});

/**
 * @route GET /attendance/:id
 * @desc Retrieve a single attendance record by ID
 */
router.get("/:id", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { id } = req.params;
    const visibleOwners = await getVisibleTermOwners(supabase, req.userId);
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("id", id) // WHERE id = req.userID
      .in("leader_id", visibleOwners.length > 0 ? visibleOwners : [req.userId])
      .single(); // expects EXACTLY one row (throws error if 0 or >1)

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
 * Validation:
 * - kidId and week are required
 * - status must match allowed enum if provided
 * - kid must belong to authenticated user
 */

/**
 * @route POST /attendance
 * @desc Create a new attendance record
 */
router.post("/", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { kidId, week, status, reason, name, term_id } = req.body;

    if (!kidId || !week || !term_id) {
      return res
        .status(400)
        .json({ error: "kidId, week and term_id are required" });
    }

    const validStatuses = ["coming", "maybe", "not coming"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid attendance status" });
    }

    const { data: kidCheck, error: kidError } = await supabase
      .from("kids")
      .select("name")
      .eq("id", kidId)
      .eq("leader_id", req.userId)
      .single();

    if (kidError || !kidCheck) {
      return res
        .status(404)
        .json({ error: "Kid not found or does not belong to this user" });
    }

    // ↓↓↓ REPLACE THE OLD TERM CHECK WITH THIS ↓↓↓
    const visibleCreators = await getVisibleTermCreators(supabase, req.userId);
    const { data: termCheck, error: termError } = await supabase
      .from("attendance_terms")
      .select("id")
      .eq("id", term_id)
      .in("created_by", visibleCreators)
      .single();
    // ↑↑↑ REPLACE THE OLD TERM CHECK WITH THIS ↑↑↑

    if (termError || !termCheck) {
      return res
        .status(404)
        .json({ error: "Term not found or does not belong to user" });
    }

    const { data, error } = await supabase
      .from("attendance")
      .insert({
        kidid: kidId,
        name: name || kidCheck.name,
        week,
        status: status || "maybe",
        reason: reason || null,
        term_id,
        leader_id: req.userId,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating attendance record:", err);
    res.status(500).json({ error: "Failed to create attendance record" });
  }
});

/**
 * @route PATCH /attendance/:id
 * @desc Partially update an attendance record (status or reason)
 * @access Private
 *
 * Flow:
 * 1. Validate at least one field provided
 * 2. Validate status enum
 * 3. Build dynamic update payload
 * 4. Persist changes for user-scoped record
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
      // Update attendance SET
      .update(updatePayload)
      .eq("id", id) // WHERE id = record to update
      .eq("leader_id", req.userId) // extra safety: ensures user owns record
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    console.error("Error updating attendance record:", err);
    res.status(500).json({ error: "Failed to update attendance record" });
  }
});

router.delete("/term/:id", async (req, res) => {
  const supabase = createSupabaseClient(req);

  const { data, error } = await supabase
    .from("attendance_terms")
    .delete()
    .eq("id", req.params.id)
    .eq("created_by", req.userId)
    .select();

  if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({
      error: "Term not found",
    });
  }

  res.json({
    message: "Term deleted",
  });
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
    if (!year) {
      return res.status(400).json({ error: "Year required" });
    }

    // Guard: only pastors can create years
    const { data: currentUser, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("leader_id", req.userId)
      .single();

    if (userError || currentUser?.role?.toLowerCase() !== "pastor") {
      return res.status(403).json({ error: "Pastor access required" });
    }

    const term = 1;
    const weeks = 10;

    // 1. Find or create the ONE shared term row for (year, term:1)
    let { data: termData, error: termFetchError } = await supabase
      .from("attendance_terms")
      .select("*")
      .eq("year", year)
      .eq("term", term)
      .maybeSingle();

    if (termFetchError) {
      return res.status(400).json({ error: termFetchError.message });
    }

    if (!termData) {
      const { data: newTerm, error: termInsertError } = await supabase
        .from("attendance_terms")
        .insert({ year, term, weeks, created_by: req.userId })
        .select()
        .single();

      if (termInsertError) {
        return res.status(400).json({ error: termInsertError.message });
      }
      termData = newTerm;
    }

    // 2. Fan out attendance rows to every leader in this pastor's hierarchy
    const ownerIds = await getVisibleTermOwners(supabase, req.userId);
    const createdRecords = [];

    for (const ownerId of ownerIds) {
      const { data: existingAttendance, error: existingError } = await supabase
        .from("attendance")
        .select("id")
        .eq("term_id", termData.id)
        .eq("leader_id", ownerId)
        .limit(1);

      if (existingError)
        return res.status(400).json({ error: existingError.message });
      if (existingAttendance.length > 0) continue;

      const { data: kids, error: kidsError } = await supabase
        .from("kids")
        .select("id, name, leader_id")
        .eq("leader_id", ownerId);

      if (kidsError) return res.status(400).json({ error: kidsError.message });

      const records = [];
      for (const kid of kids) {
        for (let week = 1; week <= termData.weeks; week++) {
          records.push({
            kidid: kid.id,
            name: kid.name,
            week,
            term_id: termData.id,
            status: "maybe",
            reason: "",
            leader_id: ownerId,
          });
        }
      }

      if (records.length > 0) {
        const { data: inserted, error: insertError } = await supabase
          .from("attendance")
          .insert(records)
          .select();
        if (insertError)
          return res.status(400).json({ error: insertError.message });
        createdRecords.push(...inserted);
      }
    }

    res.json({
      message: `Year ${year} ready for ${ownerIds.length} leader scope(s)`,
      term: termData,
      createdRecords,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed creating year" });
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
    if (!year || !term) {
      return res.status(400).json({ error: "Year and term are required" });
    }

    // Guard: only pastors can create terms
    const { data: currentUser, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("leader_id", req.userId)
      .single();

    if (userError || currentUser?.role?.toLowerCase() !== "pastor") {
      return res.status(403).json({ error: "Pastor access required" });
    }

    // 1. Find or create the ONE shared term row for (year, term)
    let { data: termData, error: termFetchError } = await supabase
      .from("attendance_terms")
      .select("*")
      .eq("year", year)
      .eq("term", term)
      .maybeSingle();

    if (termFetchError) {
      return res.status(400).json({ error: termFetchError.message });
    }

    if (!termData) {
      const { data: newTerm, error: termInsertError } = await supabase
        .from("attendance_terms")
        .insert({ year, term, weeks, created_by: req.userId })
        .select()
        .single();

      if (termInsertError) {
        return res.status(400).json({ error: termInsertError.message });
      }
      termData = newTerm;
    }

    // 2. Fan out attendance rows to every leader in this pastor's hierarchy
    const ownerIds = await getVisibleTermOwners(supabase, req.userId);
    const createdRecords = [];

    for (const ownerId of ownerIds) {
      // Skip a leader who already has rows for this term (idempotent retries)
      const { data: existingAttendance, error: existingError } = await supabase
        .from("attendance")
        .select("id")
        .eq("term_id", termData.id)
        .eq("leader_id", ownerId)
        .limit(1);

      if (existingError)
        return res.status(400).json({ error: existingError.message });
      if (existingAttendance.length > 0) continue;

      const { data: kids, error: kidsError } = await supabase
        .from("kids")
        .select("id, name, leader_id")
        .eq("leader_id", ownerId);

      if (kidsError) return res.status(400).json({ error: kidsError.message });

      const records = [];
      for (const kid of kids) {
        for (let week = 1; week <= termData.weeks; week++) {
          records.push({
            kidid: kid.id,
            name: kid.name,
            week,
            term_id: termData.id,
            status: "maybe",
            reason: "",
            leader_id: ownerId,
          });
        }
      }

      if (records.length > 0) {
        const { data: inserted, error: insertError } = await supabase
          .from("attendance")
          .insert(records)
          .select();
        if (insertError)
          return res.status(400).json({ error: insertError.message });
        createdRecords.push(...inserted);
      }
    }

    res.json({
      message: `Term ${term} ${year} ready for ${ownerIds.length} leader scope(s)`,
      term: termData,
      createdRecords,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed creating term" });
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

    // 1. Find terms belonging to year

    const { data: terms, error: termError } = await supabase
      .from("attendance_terms")
      .select("id")
      .eq("year", Number(year))
      .eq("created_by", req.userId);

    if (termError) {
      return res.status(400).json({
        error: termError.message,
      });
    }

    if (!terms || terms.length === 0) {
      return res.status(404).json({
        error: "No terms found for this year",
      });
    }

    // 2. Delete terms
    // Cascade deletes attendance automatically

    const { error: deleteError } = await supabase
      .from("attendance_terms")
      .delete()
      .in(
        "id",
        terms.map((t) => t.id),
      );

    if (deleteError) {
      return res.status(400).json({
        error: deleteError.message,
      });
    }

    res.json({
      message: `Year ${year} deleted successfully`,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed deleting year",
    });
  }
});

/**
 * @route DELETE /attendance/:id
 * @desc Delete a single attendance record
 */
router.delete("/:id", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("attendance")
      // Delete from Attendance
      .delete()
      .eq("id", id)
      .eq("leader_id", req.userId);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Attendance record deleted successfully" });
  } catch (err) {
    console.error("Error deleting attendance record:", err);
    res.status(500).json({ error: "Failed to delete attendance record" });
  }
});

/**
 * @route DELETE/attendance/term
 * @desc Delete a term in a year
 * @access public
 */
/*
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
      .delete({ count: "exact" }) // also return how many rows were deleted
      .eq("year", Number(year)) // filter year
      .eq("term", Number(term)) // filter term inside the year
      .eq("leader_id", req.userId); // only this user's data

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
}); */

/**
 * @route POST /attendance/bulk
 * @desc Bulk insert or update attendance records
 * @access Public
 */
router.post("/bulk", async (req, res) => {
  const supabase = createSupabaseClient(req);

  try {
    const records = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: "Records array is required" });
    }

    const validStatuses = ["coming", "maybe", "not coming"];

    // -----------------------------
    // Validate & sanitize records
    // -----------------------------
    const cleanedRecords = records.map((r, index) => {
      if (r.kidid == null || r.week == null || r.term_id == null) {
        throw new Error(`Missing required fields at index ${index}`);
      }

      if (r.status && !validStatuses.includes(r.status)) {
        throw new Error(`Invalid status at index ${index}: ${r.status}`);
      }

      return {
        kidid: r.kidid,

        week: Number(r.week),
        term_id: Number(r.term_id),
        status: r.status || "maybe",
        reason: r.reason || "",
        leader_id: req.userId,
        updated_at: new Date(),
      };
    });

    // -----------------------------
    // BULK UPSERT (insert or update)
    // -----------------------------
    const { data, error } = await supabase
      .from("attendance")
      .upsert(cleanedRecords, {
        onConflict: "kidid,week,term_id,leader_id",
        // if a row already exists the same -> UPDATE instead of insert
      })
      .select();

    if (error) {
      console.error("Bulk upsert error:", error);
      // Fallback: If onConflict fails due to missing unique constraint, try simple insert or individual upserts
      // But for now, let's report it.
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: `Successfully processed ${data.length} records`,
      data,
    });
  } catch (err) {
    console.error("Bulk import error:", err);
    res.status(500).json({ error: err.message || "Bulk import failed" });
  }
});
module.exports = router;
