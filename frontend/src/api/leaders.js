import api from "./index";

export async function fetchLeader(leaderId) {
  const response = await api.get(`/leaders/${leaderId}`);
  return response.data;
}

export async function fetchLeaderKids(leaderId) {
  const response = await api.get(`/leaders/${leaderId}/kids`);
  return response.data;
}

export async function fetchLeaderStats(leaderId) {
  const response = await api.get(`/leaders/${leaderId}/stats`);
  return response.data;
}

/**
 * Fetch pastor-only ministry-wide stats
 * GET /leaders/ministry-stats
 */
export async function fetchMinistryStats() {
  const response = await api.get("/leaders/ministry-stats");
  return response.data;
}
