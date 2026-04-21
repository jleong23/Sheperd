// =======================
// Kids API
// =======================
import api from "./index";

/**
 * Fetch list of kids
 * Optional: filter by status (ALL, NP, etc.)
 */
export async function fetchKids(status = "ALL") {
  try {
    const params = status && status !== "ALL" ? { status } : {};
    const response = await api.get("/kids", { params });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch kids:", err);
    throw err;
  }
}

/**
 * Create a new kid
 * POST kid data to /kids
 */
export async function createKid(kidData) {
  try {
    const response = await api.post("/kids", kidData);
    return response.data;
  } catch (err) {
    console.error("Failed to create kid:", err);
    throw err;
  }
}

/**
 * Update an existing kid
 * PUT updates to /kids/:id
 */
export async function updateKid(id, updates) {
  try {
    const response = await api.put(`/kids/${id}`, updates);
    return response.data;
  } catch (err) {
    console.error(`Failed to update kid ${id}:`, err);
    throw err;
  }
}

/**
 * Fetch a single kid by ID
 */
export async function fetchKidById(id) {
  try {
    const response = await api.get(`/kids/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch kid ${id}:`, err);
    throw err;
  }
}

/**
 * Fetch kids statistics
 * GET /kids/stats
 */
export async function fetchKidStats() {
  try {
    const response = await api.get("/kids/stats");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch kid stats:", err);
    throw err;
  }
}

/**
 * Fetch "New People" kids
 * Default status = NP
 */
export async function fetchNewPeopleKids(status = "NP") {
  try {
    const response = await api.get("/kids", { params: { status } });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch new people kids:", err);
    throw err;
  }
}

/**
 * Delete a kid by ID
 * DELETE /kids/:id
 */
export async function deleteKid(id) {
  try {
    const response = await api.delete(`/kids/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to delete kid ${id}:`, err);
    throw err;
  }
}
