import { useState } from "react";

export default function AddYearTerm({ refreshAttendance }) {
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");
  const [weeks, setWeeks] = useState(10);

  const handleAddYear = async () => {
    const res = await fetch("http://localhost:4000/attendance/year", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: Number(year) }),
    });
    const data = await res.json();
    alert(data.message);
    refreshAttendance();
  };

  const handleAddTerm = async () => {
    const res = await fetch("http://localhost:4000/attendance/term", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: Number(year),
        term: Number(term),
        weeks: Number(weeks),
      }),
    });
    const data = await res.json();
    alert(data.message);
    refreshAttendance();
  };

  return (
    <div className="space-y-4 p-4 border rounded">
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="border p-2 rounded"
      />
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="borders p-2 rounded"
        />
        <input
          type="numnber"
          placeholder="Week"
          value={weeks}
          onChange={(e) => setWeeks(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleAddYear}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Year
        </button>
        <button
          onClick={handleAddTerm}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Term
        </button>
      </div>
    </div>
  );
}
