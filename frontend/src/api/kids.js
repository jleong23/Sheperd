import axios from "axios";

export async function fetchKids(status = "ALL") {
  const params = status && status !== "ALL" ? { status } : {};
  const response = await axios.get("/kids", { params });
  return response.data;
}

export async function createKid(kidData) {
  const response = await axios.post("/kids", kidData);
  return response.data;
}

export async function updateKid(id, updates) {
  const response = await axios.put(`/kids/${id}`, updates);
  return response.data;
}

export async function fetchKidById(id) {
  const response = await axios.get(`/kids/${id}`);
  return response.data;
}

export async function fetchKidStats() {
  const response = await axios.get("/kids/stats");
  return response.data;
}

export async function fetchNewPeopleKids(status = "NP") {
  const response = await axios.get("/kids", { params: { status } });
  return response.data;
}

export async function deleteKid(id) {
  const response = await axios.delete(`/kids/${id}`);
  return response.data;
}
