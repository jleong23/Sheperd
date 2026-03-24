const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

/**
 * @route GET /kids
 * @desc Get all kids from the database
 * @access Public
 */
router.get("/", async (req, res) => {
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
    if (error) throw error;
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
  try {
    const { count: total_kids, error: totalError } = await supabase
      .from("kids")
      .select("*", { count: "exact", head: true })
      .eq("user_id", req.userId);
    if (totalError) throw totalError;

    const { count: regular_kids, error: regularError } = await supabase
      .from("kids")
      .select("*", { count: "exact", head: true })
      .eq("user_id", req.userId)
      .eq("sunday_regulars", true);
    if (regularError) throw regularError;

    const { count: baptised_kids, error: baptisedError } = await supabase
      .from("kids")
      .select("*", { count: "exact", head: true })
      .eq("user_id", req.userId)
      .eq("baptised", true);
    if (baptisedError) throw baptisedError;

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
  try {
    const { id } = req.params; // Get the ID from URL parameters
    const { data, error } = await supabase
      .from("kids")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.userId)
      .single();

    if (error || !data) {
      // If no kid is found
      return res.status(404).json({ error: "Kid not found" });
    }
    res.json(data); // Send the single kid object
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
        school: school || null,
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

    if (error) {
      console.error("Error creating kid:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data); // Return the newly created kid
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
        school: school,
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

    if (error) {
      console.error("Error updating kid:", error);
      return res.status(500).json({ error: error.message });
    }

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

    const { data, error } = await supabase
      .from("kids")
      .delete()
      .eq("id", id)
      .eq("user_id", req.userId)
      .select();

    if (error) {
      console.error("Error deleting kid:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: "Kid not found or you don't have permission to delete it.",
      });
    }

    res.json({ message: "Kid deleted successfully", deleted: data[0] }); // Confirm deletion
  } catch (err) {
    console.error("Error deleting kid:", err);
    res.status(500).json({ error: "Failed to delete kid" });
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
 * - `pool.query(...)` → executes SQL queries safely using parameterized queries
 * - Error handling returns proper HTTP status codes
 *
 * This router is mounted in server.js with:
 *   app.use("/kids", kidsRoutes)
 * so all routes are prefixed with /kids
 */
