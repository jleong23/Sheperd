const BASE_URL = "http://localhost:4000";

export async function fetchKids(status = "ALL") {
  const query = status && status !== "ALL" ? `?status=${status}` : "";

  const res = await fetch(`${BASE_URL}/kids${query}`);

  if (!res.ok) {
    throw new Error("Failed to fetch kids");
  }

  return res.json();
}

export async function updateKid(id, updates) {
  const res = await fetch(`${BASE_URL}/kids/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    throw new Error(`Failed to update kid with id ${id}`);
  }
  if (res.status === 204) {
    return null;
  }
  return res.json();
}

export async function fetchKidById(id) {
  const res = await fetch(`${BASE_URL}/kids/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch kid with id ${id}`);
  }
  return res.json();
}

export async function fetchKidStats() {
  const res = await fetch(`${BASE_URL}/kids/stats`);
  if (!res.ok) {
    throw new Error("Failed to fetch kid stats");
  }
  return res.json();
}

export async function fetchNewPeopleKids(status = "NP") {
  const query = status ? `?status=${status}` : "";

  const res = await fetch(`${BASE_URL}/kids${query}`);

  if (!res.ok) {
    throw new Error("Failed to fetch new people kids");
  }

  return res.json();
}
