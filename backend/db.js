const { Pool } = require("pg");
require("dotenv").config();

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER || "jleong_23",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "attendance",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test the connection
pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected successfully");
  }
});

module.exports = pool;
