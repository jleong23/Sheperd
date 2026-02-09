import axios from "axios";

export async function getUserProfile(id) {
  const response = await axios.get(`/users/${id}`);
  return response.data;
}
