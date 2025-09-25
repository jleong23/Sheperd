const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 4000;

// Connect to PostgreSQL
const pool = new Pool({
  user: "jleong_23", // your Postgres user
  host: "localhost",
  database: "attendance", // the DB we just created
  password: "@0128193303Postgres", // your Postgres password
  port: 5432,
});

app.use(cors());
app.use(express.json());

/**
 * GET /attendance
 * Optional query params: ?year=2025&term=1
 * Returns attendance records filtered by year/term if provided
 */
app.get("/attendance", async (req, res) => {
  try {
    const { year, term } = req.query;

    let query = "SELECT * FROM attendance";
    const params = [];

    // Filter by year if provided
    if (year) {
      params.push(Number(year));
      query += ` WHERE EXTRACT(YEAR FROM created_at) = $${params.length}`;
    }

    // Filter by term if provided (assuming term is stored in a "term" column)
    if (term) {
      params.push(Number(term));
      query +=
        params.length === 1
          ? ` AND term = $${params.length}`
          : ` WHERE term = $${params.length}`;
    }

    query += " ORDER BY week DESC, kidId";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// POST new attendance record
app.post("/attendance", async (req, res) => {
  try {
    const {
      kidId,
      name,
      week,
      present = false,
      reason = "",
      photo = "",
      term = 1, // optional term
    } = req.body;

    const result = await pool.query(
      "INSERT INTO attendance (kidId, name, week, present, reason, photo, term) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [kidId, name, week, present, reason, photo, term]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create attendance record" });
  }
});

// PATCH update record (toggle attendance / add reason)
app.patch("/attendance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { present, reason } = req.body;

    const result = await pool.query(
      "UPDATE attendance SET present=$1, reason=$2, updated_at=NOW() WHERE id=$3 RETURNING *",
      [present, reason, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Attendance record not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update attendance record" });
  }
});

app.listen(PORT, () => {
  console.log(`Attendance API running at http://localhost:${PORT}`);
});
