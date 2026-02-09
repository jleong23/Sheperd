import axios from "axios";

export async function fetchAttendance(year, term) {
  try {
    const response = await axios.get("/attendance", { params: { year, term } });
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function updateAttendanceStatus(recordId, status) {
  const response = await axios.patch(`/attendance/${recordId}`, {
    status,
  });
  return response.data;
}

export async function addYear(year) {
  const response = await axios.post("/attendance/year", { year });
  return response.data;
}

export async function addTerm(year, term, weeks = 10) {
  const response = await axios.post("/attendance/term", { year, term, weeks });
  return response.data;
}

export async function deleteTerm(year, term) {
  const response = await axios.delete(`/attendance/term/${year}/${term}`);
  return response.data;
}
