const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  user: "jleong_23",
  host: "localhost",
  database: "attendance",
  password: "@0128193303Postgres",
  port: 5432,
});

// GET attendance by year & term
router.get("/", async (req, res) => {
  const { year, term } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM attendance WHERE week >= 1 ORDER BY week DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

module.exports = router;
