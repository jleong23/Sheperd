// =======================
// User API
// =======================

import axios from "axios";

/**
 * Get user profile by ID
 * Sends GET request to /users/:id
 */
export async function getUserProfile(id) {
  const response = await axios.get(`/users/${id}`);
  return response.data;
}
