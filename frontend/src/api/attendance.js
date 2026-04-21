// =======================
// Attendance API
// =======================

/**
 * Fetch attendance records
 * Optional: filter by year and term
 * GET /attendance?year=YYYY&term=TERM
 */
import api from "./index";

export async function fetchAttendance(year, term) {
  try {
    const response = await api.get("/attendance", { params: { year, term } });
    return response.data; // returns array of attendance records
  } catch (err) {
    console.error(err);
    return []; // return empty array if request fails
  }
}

/**
 * Update status of a specific attendance record
 * PATCH /attendance/:recordId
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
 * Add a new year to attendance
 * POST /attendance/year
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
 * Add a new term to a year
 * POST /attendance/term
 * Default weeks = 10
 */
export async function addTerm(year, term, weeks = 10) {
  try {
    const response = await api.post("/attendance/term", { year, term, weeks });
    return response.data;
  } catch (err) {
    console.error("Failed to add term:", err);
    throw err;
  }
}

/**
 * Delete a term for a specific year
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
