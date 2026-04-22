/**
 * Main Backend Server for Attendance App
 * --------------------------------------
 * - Sets up Express app and middleware (CORS, JSON parsing)
 * - Connects API routes for kids, attendance, events, catchups, users, and auth
 * - Provides a root health check endpoint
 * - Handles 404 Not Found and 500 Server errors
 * - Starts listening on configured PORT
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://sheperd-ywyz.vercel.app"
];

// Import API route modules
const kidsRoutes = require("./routes/kids");
const attendanceRoutes = require("./routes/attendance");
const eventsRouter = require("./routes/events");
const catchupRouter = require("./routes/catchups");
const usersRouter = require("./routes/users");
const authRoutes = require("./routes/auth");
const requireAuth = require("./auth/requireAuth");

const app = express(); // Creating express app instance
const PORT = process.env.PORT || 4000; // uses the env variabel Port, else defaults to 4000

// Middleware should come BEFORE routes
// enable CORS for front end
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://sheperd-ywyz.vercel.app"
    ];

    // allow server-to-server or curl requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

// API Routes comes after middleware
app.use("/auth", authRoutes); // Public auth routes
app.use("/kids", requireAuth, kidsRoutes); // Protected
app.use("/attendance", requireAuth, attendanceRoutes); // Protected
app.use("/events", requireAuth, eventsRouter); // Protected
app.use("/catchups", requireAuth, catchupRouter); // Protected
app.use("/users", requireAuth, usersRouter); // Protected

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
