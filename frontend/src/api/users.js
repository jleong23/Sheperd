// =======================
// User API
// =======================
import api from "./index";

/**
 * Get user profile by ID
 * Sends GET request to /users/:id
 */
export async function getUserProfile(id) {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch user profile ${id}:`, err);
    throw err;
  }
}
