const BASE_URL = "http://localhost:4000";

export async function fetchAttendance(year, term) {
  try {
    const res = await fetch(`${BASE_URL}/attendance?year=${year}&term=${term}`);
    if (!res.ok) throw new Error("Failed to fetch attendance");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function toggleAttendance(recordId, present) {
  try {
    const res = await fetch(`${BASE_URL}/attendance/${recordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ present }),
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}
