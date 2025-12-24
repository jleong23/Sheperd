// src/api/catchups.js
const BASE_URL = "http://localhost:4000";

/**
 * Helper to fetch JSON with error handling
 */
const fetchJSON = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const isJSON = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJSON ? await response.json() : null;

    if (!response.ok) {
      throw new Error(data?.error || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};

/**
 * Get all catchups with optional filtering, sorting, pagination
 */
export const getCatchups = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/catchups${query ? `?${query}` : ""}`;
  return fetchJSON(url);
};

/**
 * Get a single catchup by ID
 */
export const getCatchupById = async (id) => {
  return fetchJSON(`${BASE_URL}/catchups/${id}`);
};

/**
 * Add a new catchup
 * @param {object} catchup - { kidid, catchupdate, catchupstarttime, catchupendtime, catchuppurpose, catchupcomments }
 */
export const addCatchup = async (catchup) => {
  return fetchJSON(`${BASE_URL}/catchups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(catchup),
  });
};

/**
 * Update a catchup (partial update)
 * @param {number|string} id
 * @param {object} updatedFields - Partial catchup object
 */
export const updateCatchup = async (id, updatedFields) => {
  return fetchJSON(`${BASE_URL}/catchups/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedFields),
  });
};

/**
 * Delete a single catchup by ID
 */
export const deleteCatchup = async (id) => {
  return fetchJSON(`${BASE_URL}/catchups/${id}`, {
    method: "DELETE",
  });
};

/**
 * Bulk delete catchups by array of IDs
 */
export const bulkDeleteCatchups = async (ids) => {
  return fetchJSON(`${BASE_URL}/catchups`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
};
