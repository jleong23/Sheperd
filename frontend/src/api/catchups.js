import axios from "axios";

/**
 * Get all catchups with optional filtering, sorting, pagination
 */
export const getCatchups = async (params = {}) => {
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

  const query = new URLSearchParams(cleanParams).toString();
  const response = await axios.get(`/catchups${query ? `?${query}` : ""}`);
  return response.data;
};

/**
 * Get a single catchup by ID
 */
export const getCatchupById = async (id) => {
  const response = await axios.get(`/catchups/${id}`);
  return response.data;
};

/**
 * Add a new catchup
 * @param {object} catchup - { kidid, catchupdate, catchupstarttime, catchupendtime, catchuppurpose, catchupcomments }
 */
export const addCatchup = async (catchup) => {
  const response = await axios.post("/catchups", catchup);
  return response.data;
};

/**
 * Update a catchup (partial update)
 * @param {number|string} id
 * @param {object} updatedFields - Partial catchup object
 */
export const updateCatchup = async (id, updatedFields) => {
  const response = await axios.patch(`/catchups/${id}`, updatedFields);
  return response.data;
};

/**
 * Delete a single catchup by ID
 */
export const deleteCatchup = async (id) => {
  const response = await axios.delete(`/catchups/${id}`);
  return response.data;
};

/**
 * Bulk delete catchups by array of IDs
 */
export const bulkDeleteCatchups = async (ids) => {
  const response = await axios.delete("/catchups", { data: { ids } });
  return response.data;
};
