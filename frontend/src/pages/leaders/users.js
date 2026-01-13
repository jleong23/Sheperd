const db = require("../db");

// Get a single user by ID
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Select specific fields to avoid sending sensitive data if you add passwords later
    const query =
      "SELECT id, name, email, group_graduation_year FROM users WHERE id = $1";
    const { rows } = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getUser };
