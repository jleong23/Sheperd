const BASE_URL = "http://localhost:4000/users";

export async function getUserProfile(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch user with id ${id}}`);
  }
  return res.json();
}
