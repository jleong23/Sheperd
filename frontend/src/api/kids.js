// =======================
// Kids API
// =======================
import api from "./index";

/**
 * Fetch list of kids
 * Optional: filter by status (ALL, NP, etc.)
 */
export async function fetchKids(status = "ALL") {
  const params = status && status !== "ALL" ? { status } : {};
  const response = await api.get("/kids", { params });
  return response.data;
}

/**
 * Create a new kid
 * POST kid data to /kids
 */
export async function createKid(kidData) {
  const response = await api.post("/kids", kidData);
  return response.data;
}

/**
 * Update an existing kid
 * PUT updates to /kids/:id
 */
export async function updateKid(id, updates) {
  const response = await api.put(`/kids/${id}`, updates);
  return response.data;
}

/**
 * Fetch a single kid by ID
 */
export async function fetchKidById(id) {
  const response = await api.get(`/kids/${id}`);
  return response.data;
}

/**
 * Fetch kids statistics
 * GET /kids/stats
 */
export async function fetchKidStats() {
  const response = await api.get("/kids/stats");
  return response.data;
}

/**
 * Fetch "New People" kids
 * Default status = NP
 */
export async function fetchNewPeopleKids(status = "NP") {
  const response = await api.get("/kids", { params: { status } });
  return response.data; // returns filtered array of kids
}

/**
 * Delete a kid by ID
 * DELETE /kids/:id
 */
export async function deleteKid(id) {
  const response = await api.delete(`/kids/${id}`);
  return response.data; // returns result confirmation
}
