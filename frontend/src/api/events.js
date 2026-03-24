import api from "./index";

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
  const response = await api.get("/events", { params });
  return response.data;
};

/**
 * Fetch a single event by ID
 * @param {number|string} id
 */
export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

/**
 * Add a new event
 * @param {object} event - Event object
 */
export const addEvent = async (event) => {
  const response = await api.post("/events", event);
  return response.data;
};

/**
 * Update an existing event (partial update)
 * @param {number|string} id
 * @param {object} updatedFields - Partial event object
 */
export const updateEvent = async (id, updatedFields) => {
  const response = await api.patch(`/events/${id}`, updatedFields);
  return response.data;
};

/**
 * Delete a single event by ID
 * @param {number|string} id
 */
export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

/**
 * Bulk delete events by an array of IDs
 * @param {Array<number|string>} ids
 */
export const bulkDeleteEvents = async (ids) => {
  // For DELETE with body, axios uses the `data` property
  const response = await api.delete("/events", { data: { ids } });
  return response.data;
};
