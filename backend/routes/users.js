const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

/**
 * @route GET /users
 * @desc Get the current logged-in user's data
 * @access Private
 */
router.get("/", async (req, res) => {
  try {
    // For security, this endpoint should only return the current user's data
    const { data, error } = await supabase
      .from("users")
      .select("id, email")
      .eq("id", req.userId)
      .single();
    if (error) throw error;
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
  try {
    const { id } = req.params; // Get ID from URL parameters

    // Security check: A user can only fetch their own data
    if (Number(id) !== req.userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only access your own data." });
    }

    const { data, error } = await supabase
      .from("users")
      .select("id, email")
      .eq("id", id)
      .single();

    if (error || !data) {
      // If no users is found
      return res.status(404).json({ error: "User not found" });
    }
    res.json(data); // Send the single user object
  } catch (err) {
    console.error(`Error fetching user: ${err}`);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
