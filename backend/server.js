/**
 * Main backend server for the Attendance app
 * - Sets up Express app, middleware (CORS, JSON parsing)
 * - Connects /kids and /attendance API routes
 * - Provides a root health check route
 * - Handles 404 and server errors
 * - Starts listening on PORT for incoming requests
 */
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import routes
const kidsRoutes = require("./routes/kids");
const attendanceRoutes = require("./routes/attendance");
const eventsRouter = require("./routes/events");

const app = express(); // Creating express app instance
const PORT = process.env.PORT || 4000; // uses the env variabel Port, else defaults to 4000

// MIddleware should come BEFORE routes
app.use(
  cors({
    origin: "http://localhost:5173", // allow your React app
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());

// API Routes comes after middleware
app.use("/kids", kidsRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/events", eventsRouter); //

// Root route
app.get("/", (_, res) => {
  res.json({
    message: "Attendance API is running",
    endpoints: {
      kids: {
        GET: "/kids - Get all kids",
        GET_ONE: "/kids/:id - Get a kid by ID",
        POST: "/kids - Create a new kid",
        PUT: "/kids/:id - Update a kid",
        DELETE: "/kids/:id - Delete a kid",
      },
      attendance: {
        GET: "/attendance - Get all attendance records (optional query params: year, term)",
        GET_ONE: "/attendance/:id - Get an attendance record by ID",
        POST: "/attendance - Create a new attendance record",
        PATCH: "/attendance/:id - Update an attendance record",
        DELETE: "/attendance/:id - Delete an attendance record",
      },
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected error occurred",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "The requested resource does not exist",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Attendance API running at http://localhost:${PORT}`);
});

module.exports = app; // Export for testing
