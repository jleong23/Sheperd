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
 * @route GET /catchups
 * @desc Get all catchups with optional filtering, sorting, and pagination
 * @access Public
 */
router.get("/", async (req, res) => {
  const supabase = createSupabaseClient(req);
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

    let query = supabase
      .from("catchups")
      .select("*, kids(name, status_code, baptised, sunday_regulars)", {
        count: "exact",
      })
      .eq("user_id", req.user.id);

    // --------------------
    // Filtering
    // --------------------
    if (kidid && !isNaN(Number(kidid))) {
      query = query.eq("kidid", Number(kidid));
    }

    if (purpose) {
      query = query.ilike("catchuppurpose", `%${purpose}%`);
    }

    if (startDate && !isNaN(Date.parse(startDate))) {
      query = query.gte("catchupdate", startDate);
    }

    if (endDate && !isNaN(Date.parse(endDate))) {
      query = query.lte("catchupdate", endDate);
    }

    if (catchupdate && !isNaN(Date.parse(catchupdate))) {
      query = query.eq("catchupdate", catchupdate);
    }

    // --------------------
    // Sorting
    // --------------------
    const allowedSort = ["catchupdate", "kidid", "createdate"];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : "catchupdate";
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
    if (error) throw error;

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limitNum);

    // --------------------
    // Frontend-friendly formatting
    // --------------------
    const rows = data.map((r) => {
      const { kids, ...catchupData } = r;
      return {
        ...catchupData,
        kidName: kids?.name,
        kidStatus: kids?.status_code,
        kidBaptised: kids?.baptised,
        kidSundayRegulars: kids?.sunday_regulars,
        catchupdate: formatDate(r.catchupdate),
        catchupstarttime: r.catchupstarttime?.slice(0, 5),
        catchupendtime: r.catchupendtime?.slice(0, 5),
        updatedate: r.updatedate,
        createdate: r.createdate,
      };
    });

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
  const supabase = createSupabaseClient(req);
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("catchups")
      .select("*")
      .eq("catchupid", id)
      .eq("user_id", req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Catchup record not found" });
    }

    const row = {
      ...data,
      catchupdate: formatDate(data.catchupdate),
      catchupstarttime: data.catchupstarttime?.slice(0, 5),
      catchupendtime: data.catchupendtime?.slice(0, 5),
      updatedate: data.updatedate,
      createdate: data.createdate,
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
  const supabase = createSupabaseClient(req);
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

    // Security Check: Ensure the kid belongs to the user
    const { data: kidCheck, error: kidError } = await supabase
      .from("kids")
      .select("id")
      .eq("id", kidid)
      .eq("user_id", req.user.id)
      .single();
    if (kidError || !kidCheck) {
      return res
        .status(404)
        .json({ error: "Kid not found or does not belong to this user" });
    }

    const { data, error } = await supabase
      .from("catchups")
      .insert({
        kidid,
        catchupdate,
        catchupstarttime: catchupstarttime || null,
        catchupendtime: catchupendtime || null,
        catchuppurpose: catchuppurpose || null,
        catchupcomments: catchupcomments || null,
        user_id: req.user.id,
      })
      .select()
      .single();
    if (error) throw error;

    res.status(201).json({
      ...data,
      catchupdate: formatDate(data.catchupdate),
      catchupstarttime: data.catchupstarttime?.slice(0, 5),
      catchupendtime: data.catchupendtime?.slice(0, 5),
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
  const supabase = createSupabaseClient(req);
  try {
    const { id } = req.params;
    const {
      kidid,
      catchupdate,
      catchupstarttime,
      catchupendtime,
      catchuppurpose,
      catchupcomments
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

    // Security Check: If kidid is being changed, ensure the new kid belongs to the user
    if (kidid !== undefined) {
      const { data: kidCheck, error: kidError } = await supabase
        .from("kids")
        .select("id")
        .eq("id", kidid)
        .eq("user_id", req.user.id)
        .single();
      if (kidError || !kidCheck) {
        return res
          .status(404)
          .json({ error: "Kid not found or does not belong to this user" });
      }
    }

    const { data, error } = await supabase
      .from("catchups")
      .update({
        kidid,
        catchupdate,
        catchupstarttime,
        catchupendtime,
        catchuppurpose,
        catchupcomments,
        updatedate: new Date(),
      })
      .eq("catchupid", id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Catchup record not found" });
    }

    res.json({
      ...data,
      catchupdate: formatDate(data.catchupdate),
      catchupstarttime: data.catchupstarttime?.slice(0, 5),
      catchupendtime: data.catchupendtime?.slice(0, 5),
      updatedate: data.updatedate,
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
  const supabase = createSupabaseClient(req);
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("catchups")
      .delete()
      .eq("catchupid", id)
      .eq("user_id", req.user.id)
      .select();

    if (error) {
      console.error("Error deleting catchup record:", error);
      return res.status(500).json({ error: "Failed to delete catchup record" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Catchup record not found" });
    }

    res.json({
      message: "Catchup deleted successfully",
      deleted: data[0],
    });
  } catch (err) {
    console.error("Error in delete route:", err);
    res.status(500).json({ error: "Failed to delete catchup record" });
  }
});

/**
 * @route DELETE /catchups
 * @desc Bulk delete catchups by array of IDs
 * @access Public
 */
router.delete("/", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ error: "No IDs provided" });

    const { data, error } = await supabase
      .from("catchups")
      .delete()
      .in("catchupid", ids)
      .eq("user_id", req.user.id)
      .select();

    if (error) {
      console.error("Error bulk deleting catchup records:", error);
      return res.status(500).json({ error: "Failed to bulk delete catchup records" });
    }

    res.json({
      message: "Catchups deleted successfully",
      deletedCount: data ? data.length : 0,
      deleted: data,
    });
  } catch (err) {
    console.error("Error in bulk delete route:", err);
    res.status(500).json({ error: "Failed to bulk delete catchup records" });
  }
});

module.exports = router;
