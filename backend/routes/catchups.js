const express = require("express");
const router = express.Router();
const createSupabaseClient = require("../supabaseClient");
const supabaseAdmin = require("../lib/supabaseClient");

// --------------------
// Date formatter
// --------------------
const formatDate = (d) => {
  if (!d) return null;
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// =====================================================
// GET /catchups
// =====================================================
router.get("/", async (req, res) => {
  const supabase = createSupabaseClient(req);

  try {
    const {
      kidid,
      purpose,
      month,
      year,
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
        .eq("user_id", req.userId);

    // --------------------
    // Filtering
    // --------------------
    if (kidid && !isNaN(Number(kidid))) {
      query = query.eq("kidid", Number(kidid));
    }

    if (purpose) {
      query = query.ilike("catchuppurpose", `%${purpose}%`);
    }

    // --------------------
    // MONTH + YEAR FILTER (NEW)
    // --------------------
    if (month && year) {
      const m = String(month).padStart(2, "0");
      const y = year;

      const startDate = `${y}-${m}-01`;
      const endDate = new Date(y, month, 0) // last day of month
          .toISOString()
          .split("T")[0];

      query = query
          .gte("catchupdate", startDate)
          .lte("catchupdate", endDate);
    } else if (year) {
      query = query.gte("catchupdate", `${year}-01-01`).lte("catchupdate", `${year}-12-31`);
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

    if (error) return res.status(400).json({ error: error.message });

    const rows = data.map((r) => {
      const { kids, ...rest } = r;

      return {
        ...rest,
        kidName: kids?.name,
        kidStatus: kids?.status_code,
        kidBaptised: kids?.baptised,
        kidSundayRegulars: kids?.sunday_regulars,
        catchupdate: formatDate(r.catchupdate),
        catchupstarttime: r.catchupstarttime?.slice(0, 5),
        catchupendtime: r.catchupendtime?.slice(0, 5),
      };
    });

    res.json({
      data: rows,
      pagination: {
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
        page: pageNum,
        limit: limitNum,
      },
    });
  } catch (err) {
    console.error("Error fetching catchups:", err);
    res.status(500).json({ error: "Failed to fetch catchups" });
  }
});

// =====================================================
// DELETE /catchups/pastor/:id
// Pastor deletes a catchup owned by a selected leader
// =====================================================
router.delete("/pastor/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { leaderId } = req.body;

    if (!leaderId) {
      return res.status(400).json({ error: "Missing leaderId" });
    }

    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("user_id", req.userId)
      .single();

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    if (currentUser?.role?.toLowerCase() !== "pastor") {
      return res.status(403).json({ error: "Only pastors can delete leader catchups" });
    }

    const { data, error } = await supabaseAdmin
      .from("catchups")
      .delete()
      .eq("catchupid", id)
      .eq("user_id", leaderId)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    if (!data?.length) {
      return res.status(404).json({ error: "Catchup not found" });
    }

    res.json({ message: "Deleted successfully", deleted: data[0] });
  } catch (err) {
    console.error("Error deleting pastor catchup:", err);
    res.status(500).json({ error: "Failed to delete pastor catchup" });
  }
});

// =====================================================
// GET /catchups/:id
// =====================================================
router.get("/:id", async (req, res) => {
  const supabase = createSupabaseClient(req);

  try {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("catchups")
        .select("*")
        .eq("catchupid", id)
        .eq("user_id", req.userId)
        .single();

    if (error) return res.status(400).json({ error: error.message });
    if (!data) {
      return res.status(404).json({ error: "Catchup not found" });
    }

    res.json({
      ...data,
      catchupdate: formatDate(data.catchupdate),
      catchupstarttime: data.catchupstarttime?.slice(0, 5),
      catchupendtime: data.catchupendtime?.slice(0, 5),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch catchup" });
  }
});

// =====================================================
// POST /catchups
// =====================================================
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

    if (!kidid || isNaN(Number(kidid))) {
      return res.status(400).json({ error: "Invalid kidid" });
    }

    const { data: kidCheck } = await supabase
        .from("kids")
        .select("id")
        .eq("id", kidid)
        .eq("user_id", req.userId)
        .single();

    if (!kidCheck) {
      return res.status(404).json({ error: "Kid not found" });
    }

    const { data, error } = await supabase
        .from("catchups")
        .insert({
          kidid,
          catchupdate,
          catchupstarttime,
          catchupendtime,
          catchuppurpose,
          catchupcomments,
          user_id: req.userId,
        })
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create catchup" });
  }
});

// =====================================================
// PATCH /catchups/:id
// =====================================================
router.patch("/:id", async (req, res) => {
  const supabase = createSupabaseClient(req);

  try {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("catchups")
        .update({
          ...req.body,
          updatedate: new Date(),
        })
        .eq("catchupid", id)
        .eq("user_id", req.userId)
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });
    if (!data) {
      return res.status(404).json({ error: "Catchup not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update catchup" });
  }
});

// =====================================================
// DELETE /catchups/:id
// =====================================================
router.delete("/:id", async (req, res) => {
  const supabase = createSupabaseClient(req);

  try {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("catchups")
        .delete()
        .eq("catchupid", id)
        .eq("user_id", req.userId)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    if (!data?.length) {
      return res.status(404).json({ error: "Catchup not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete catchup" });
  }
});

// =====================================================
// DELETE /catchups (bulk)
// =====================================================
router.delete("/", async (req, res) => {
  const supabase = createSupabaseClient(req);

  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ error: "No IDs provided" });
    }

    const { data, error } = await supabase
        .from("catchups")
        .delete()
        .in("catchupid", ids)
        .eq("user_id", req.userId)
        .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      message: "Bulk delete successful",
      deletedCount: data.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Bulk delete failed" });
  }
});

module.exports = router;
