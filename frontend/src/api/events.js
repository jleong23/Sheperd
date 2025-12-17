// src/api/events.js
const BASE_URL = "http://localhost:4000";

/**
 * Helper function to handle fetch requests
 * @param {string} url - Endpoint URL
 * @param {object} options - Fetch options (method, headers, body)
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
 * Fetch all events with optional query parameters
 * @param {object} params - Filtering, sorting, and pagination options
 * @param {number} params.year
 * @param {string} params.name
 * @param {string} params.startDate
 * @param {string} params.endDate
 * @param {string} params.sortBy
 * @param {string} params.order
 * @param {number} params.page
 * @param {number} params.limit
 */
export const getEvents = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/events${query ? `?${query}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
};

/**
 * Fetch a single event by ID
 * @param {number|string} id
 */
export const getEventById = async (id) => {
  return fetchJSON(`${BASE_URL}/events/${id}`);
};

/**
 * Add a new event
 * @param {object} event - Event object
 */
export const addEvent = async (event) => {
  return fetchJSON(`${BASE_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
};

/**
 * Update an existing event (partial update)
 * @param {number|string} id
 * @param {object} updatedFields - Partial event object
 */
export const updateEvent = async (id, updatedFields) => {
  return fetchJSON(`${BASE_URL}/events/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedFields),
  });
};

/**
 * Delete a single event by ID
 * @param {number|string} id
 */
export const deleteEvent = async (id) => {
  const response = await fetch(`${BASE_URL}/events/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete event");
  return await response.json();
};

/**
 * Bulk delete events by an array of IDs
 * @param {Array<number|string>} ids
 */
export const bulkDeleteEvents = async (ids) => {
  return fetchJSON(`${BASE_URL}/events`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
};
