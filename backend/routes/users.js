const express = require("express");
const router = express.Router();
const createSupabaseClient = require("../supabaseClient");
const supabaseAdmin = require("../lib/supabaseClient");

/**
 * @route POST /users/sync
 * @desc Sync authenticated Supabase user with local database
 * @access Private
 */
router.post("/sync", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { email } = req.user;

    const { data, error } = await supabaseAdmin
      .from("users")
      .upsert({ leader_id: req.userId, email, user_name: email })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({
      message: "User synced successfully",
      user: data,
    });
  } catch (err) {
    console.error("Error syncing user:", err);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

/**
 * @route GET /users
 * @desc Get the current logged-in user's data
 * @access Private
 */
router.get("/", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    // For security, this endpoint should only return the current user's data
    const { data, error } = await supabase
      .from("users")
      .select("leader_id, email")
      .eq("leader_id", req.userId)
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" }); // Handle errors
  }
});

/**
 * @route GET /users/:id
 * @desc Get a single user by their ID, but only if it's the current user
 * @access Private
 */
router.get("/:id", async (req, res) => {
  const supabase = createSupabaseClient(req);
  try {
    const { id } = req.params; // Get ID from URL parameters

    // Security check: A user can only fetch their own data
    if (id !== req.userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only access your own data." });
    }

    const { data, error } = await supabase
      .from("users")
      .select("leader_id, email")
      .eq("leader_id", id)
      .single();

    if (error) return res.status(400).json({ error: error.message });

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(data);
  } catch (err) {
    console.error(`Error fetching user: ${err}`);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
