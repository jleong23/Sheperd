const express = require("express");
const router = express.Router();
const createSupabaseClient = require("../supabaseClient");

/**
 * @route GET /kids
 * @desc Get all kids from the database
 * @access Public
 */
router.get("/", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { status } = req.query;

    let query = supabase
      .from("kids")
      .select("*")
      .eq("user_id", req.userId)
      .order("id");

    if (status && ["CORE", "FRINGE", "NP"].includes(status)) {
      query = query.eq("status_code", status);
    }

    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    console.error("Error fetching kids:", err);
    res.status(500).json({ error: "Failed to fetch kids" }); // Handle errors
  }
});

/**
 * @route GET /kids/stats
 * @desc Get statistics for kids (Total, Regulars, etc.)
 * @access Public
 */
router.get("/stats", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { count: total_kids, error: totalError } = await supabase
      .from("kids")
      .select("user_id", { count: "exact", head: true })
      .eq("user_id", req.userId);
    if (totalError) return res.status(400).json({ error: totalError.message });

    const { count: regular_kids, error: regularError } = await supabase
      .from("kids")
      .select("user_id", { count: "exact", head: true })
      .eq("user_id", req.userId)
      .eq("sunday_regulars", true);
    if (regularError) return res.status(400).json({ error: regularError.message });

    const { count: baptised_kids, error: baptisedError } = await supabase
      .from("kids")
      .select("user_id", { count: "exact", head: true })
      .eq("user_id", req.userId)
      .eq("baptised", true);
    if (baptisedError) return res.status(400).json({ error: baptisedError.message });

    res.json({ total_kids, regular_kids, baptised_kids });
  } catch (err) {
    console.error("Error fetching kid stats:", err);
    res.status(500).json({ error: "Failed to fetch kid stats" });
  }
});

/**
 * @route GET /kids/:id
 * @desc Get a single kid by their ID
 * @access Public
 */
router.get("/:id", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { id } = req.params; // Get the ID from URL parameters
    const { data, error } = await supabase
      .from("kids")
      .select("*")
      .eq("user_id", req.userId)
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Kid not found" });
    }
    res.json(data);
  } catch (err) {
    console.error("Error fetching kid:", err);
    res.status(500).json({ error: "Failed to fetch kid" });
  }
});

/**
 * @route POST /kids
 * @desc Create a new kid
 * @access Public
 */
router.post("/", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const {
      name,
      birthday,
      school,
      phone,
      parent_phone,
      parentname,
      address,
      status_code,
      baptised,
      sunday_regulars,
      first_call,
      second_call,
      first_call_feedback,
      second_call_feedback,
    } = req.body; // Extract data from request body

    if (!name) {
      return res.status(400).json({ error: "Name is required" }); // Validate input
    }

    // Insert new kid into the database
      const { data, error } = await supabase
          .from("kids")
          .insert({
              name,
              birthday: birthday || null,
              school: school !== undefined ? school : null,
              phone: phone || null,
              parent_phone: parent_phone || null,
              parentname: parentname || null,
              address: address || null,
              status_code: status_code || "NP",
              baptised: baptised || false,
              sunday_regulars: sunday_regulars || false,
              first_call: first_call || false,
              second_call: second_call || false,
              first_call_feedback: first_call_feedback || "",
              second_call_feedback: second_call_feedback || "",
              user_id: req.userId,
          })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating kid:", err);
    res.status(500).json({ error: "Failed to create kid" });
  }
});

/**
 * @route PUT /kids/:id
 * @desc Update an existing kid
 * @access Public
 */
router.put("/:id", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { id } = req.params;
    const {
      name,
      birthday,
      school,
      parentname,
      phone,
      parent_phone,
      address,
      status_code,
      baptised,
      sunday_regulars,
      first_call,
      second_call,
      first_call_feedback,
      second_call_feedback,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const { data, error } = await supabase
      .from("kids")
      .update({
        name,
        birthday: birthday || null,
        school: school !== undefined ? school : null,
        parentname: parentname,
        phone: phone,
        parent_phone: parent_phone,
        address: address,
        status_code: status_code,
        baptised: baptised || false,
        sunday_regulars: sunday_regulars || false,
        first_call: first_call || false,
        second_call: second_call || false,
        first_call_feedback: first_call_feedback || "",
        second_call_feedback: second_call_feedback || "",
        updated_at: new Date(),
      })
      .eq("id", id)
      .eq("user_id", req.userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    if (!data) {
      return res.status(404).json({ error: "Kid not found" });
    }
    res.json(data); // Return the updated kid
  } catch (err) {
    console.error("Error updating kid:", err);
    res.status(500).json({ error: "Failed to update kid" });
  }
});

/**
 * @route DELETE /kids/:id
 * @desc Delete a kid from the database
 * @access Public
 */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("AUTH HEADER:", req.headers.authorization);

        const supabase = createSupabaseClient(req);

        const { data, error } = await supabase
            .from("kids")
            .delete()
            .eq("id", id)
            .eq("user_id", req.userId)
            .select();

        if (error) return res.status(400).json({ error: error.message });

        if (!data || data.length === 0) {
            return res.status(404).json({
                error: "Kid not found or you don't have permission to delete it.",
            });
        }

        res.json({ message: "Kid deleted successfully", deleted: data[0] });
    } catch (err) {
        console.error("Error deleting kid:", err);
        res.status(500).json({ error: "Failed to delete kid" });
    }
});

/**
 * @route DELETE /kids
 * @desc Bulk delete kids
 * @access Private
 */
router.delete("/", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Array of IDs is required" });
    }

    const { data, error } = await supabase
      .from("kids")
      .delete()
      .in("id", ids)
      .eq("user_id", req.userId)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      message: "Kids deleted successfully",
      deletedCount: data ? data.length : 0,
      deleted: data,
    });
  } catch (err) {
    console.error("Error bulk deleting kids:", err);
    res.status(500).json({ error: "Failed to bulk delete kids" });
  }
});

module.exports = router;

/**
 * ===================== NOTE =====================
 * This file defines the API endpoints for managing "kids":
 * - GET /kids → list all kids
 * - GET /kids/:id → get a specific kid by ID
 * - POST /kids → create a new kid
 * - PUT /kids/:id → update an existing kid
 * - DELETE /kids/:id → delete a kid
 *
 * Key concepts:
 * - `req.params` → used to get URL parameters like ID
 * - `req.body` → contains data sent by client for POST/PUT
 * - `supabase.from(...)` → executes database operations via Supabase client
 * - Error handling returns proper HTTP status codes
 *
 * This router is mounted in server.js with:
 *   app.use("/kids", kidsRoutes)
 * so all routes are prefixed with /kids
 */
