// =======================
// Attendance API
// Frontend wrapper around backend /attendance routes
// Uses axios instance: api (pre-configured baseURL + auth headers)
// =======================

import api from "./index";

/**
 * Fetch attendance records for the selected term.
 * GET /attendance?term_id=ID
 */
export async function getAttendance(termId = null) {
  try {
    const response = await api.get("/attendance", {
      params: { term_id: termId },
    });
    return response.data;
  } catch (err) {
    console.error("getAttendance failed:", err);
    throw err;
  }
}

/**
 * Fetch available attendance terms for the current user.
 * GET /attendance/terms
 */
export async function getAttendanceTerms() {
  try {
    const response = await api.get("/attendance/terms");
    return response.data;
  } catch (err) {
    console.error("getAttendanceTerms failed:", err);
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
    const response = await api.patch(`/attendance/${recordId}`, updates);
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
      year,
      term,
      weeks,
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
 * Delete a specific term.
 * DELETE /attendance/term/:id
 */
export async function deleteTerm(termId) {
  try {
    const response = await api.delete(`/attendance/term/${termId}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to delete term ${termId}:`, err);
    throw err;
  }
}
