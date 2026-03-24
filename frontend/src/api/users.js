// =======================
// User API
// =======================
import api from "./index";

/**
 * Get user profile by ID
 * Sends GET request to /users/:id
 */
export async function getUserProfile(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}
