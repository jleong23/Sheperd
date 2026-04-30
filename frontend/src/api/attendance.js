// =======================
// Attendance API
// Frontend wrapper around backend /attendance routes
// Uses axios instance: api (pre-configured baseURL + auth headers)
// =======================

import api from "./index";

/**
 * Fetch attendance records
 * GET /attendance?year=YYYY&term=TERM
 */
export async function getAttendance(year, term) {
  try {
    const response = await api.get("/attendance", {
      params: { year, term }, // converst into query string (attendance?year=2026&term=1)
    });
    return response.data; // returns array of attendance records
  } catch (err) {
    console.error("getAttendance failed:", err);
    throw err;
  }
}

/**
 * Update attendance record
 * PATCH /attendance/:recordId
 * Body = partial update fields (status, reason)
 */
export async function updateAttendance(recordId, updates) {
  try {
    const response = await api.patch(
      `/attendance/${recordId}`,
      updates, // request body example: { status: "coming", reason: "sick" }
    );

    return response.data;
  } catch (err) {
    console.error(`Failed to update attendance ${recordId}:`, err);
    throw err;
  }
}

/**
 * Create a new attendance year
 * POST /attendance/year
 * Body: { year: 2026 }
 */
export async function addYear(year) {
  try {
    const response = await api.post("/attendance/year", { year });
    return response.data;
  } catch (err) {
    console.error("Failed to add year:", err);
    throw err;
  }
}

/**
 * Create a new term inside a year
 * POST /attendance/term
 * Body: { year, term, weeks }
 */
export async function addTerm(year, term, weeks = 10) {
  try {
    const response = await api.post("/attendance/term", {
      // backend uses below to generate records
      year,
      term,
      weeks, // default to 10 weeks if not provided
    });
    return response.data;
  } catch (err) {
    console.error("Failed to add term:", err);
    throw err;
  }
}

/**
 * Bulk insert / update attendance records
 * POST /attendance/bulk
 * Body: ARRAY of attendance objects
 */
export async function addBulkAttendance(cleanedData) {
  if (!Array.isArray(cleanedData) || cleanedData.length === 0) {
    throw new Error("No valid attendance data provided");
  }

  try {
    const response = await api.post("/attendance/bulk", cleanedData);
    return response.data;
  } catch (err) {
    console.error("Failed to bulk add attendance:", err);
    throw err;
  }
}

/**
 * Delete a specific term in a year
 * DELETE /attendance/term/:year/:term
 */
export async function deleteTerm(year, term) {
  try {
    const response = await api.delete(`/attendance/term/${year}/${term}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to delete term ${term} for year ${year}:`, err);
    throw err;
  }
}
