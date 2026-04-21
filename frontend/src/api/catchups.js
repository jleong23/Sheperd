import api from "./index";

/**
 * Get all catchups with optional filtering, sorting, pagination
 */
export const getCatchups = async (params = {}) => {
  try {
    // remove undefined values
    const cleanParams = {};
    for (const key in params) {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        // Fix: Convert Date objects to ISO string to ensure backend readability
        if (params[key] instanceof Date) {
          cleanParams[key] = params[key].toISOString();
        } else {
          cleanParams[key] = params[key];
        }
      }
    }

    const response = await api.get("/catchups", { params: cleanParams });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch catchups:", err);
    throw err;
  }
};

/**
 * Get a single catchup by ID
 */
export const getCatchupById = async (id) => {
  try {
    const response = await api.get(`/catchups/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch catchup ${id}:`, err);
    throw err;
  }
};

/**
 * Add a new catchup
 * @param {object} catchup - { kidid, catchupdate, catchupstarttime, catchupendtime, catchuppurpose, catchupcomments }
 */
export const addCatchup = async (catchup) => {
  try {
    const response = await api.post("/catchups", catchup);
    return response.data;
  } catch (err) {
    console.error("Failed to add catchup:", err);
    throw err;
  }
};

/**
 * Update a catchup (partial update)
 * @param {number|string} id
 * @param {object} updatedFields - Partial catchup object
 */
export const updateCatchup = async (id, updatedFields) => {
  try {
    const response = await api.patch(`/catchups/${id}`, updatedFields);
    return response.data;
  } catch (err) {
    console.error(`Failed to update catchup ${id}:`, err);
    throw err;
  }
};

/**
 * Delete a single catchup by ID
 */
export const deleteCatchup = async (id) => {
  try {
    const response = await api.delete(`/catchups/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to delete catchup ${id}:`, err);
    throw err;
  }
};

/**
 * Bulk delete catchups by array of IDs
 */
export const bulkDeleteCatchups = async (ids) => {
  try {
    const response = await api.delete("/catchups", { data: { ids } });
    return response.data;
  } catch (err) {
    console.error("Failed bulk delete catchups:", err);
    throw err;
  }
};
