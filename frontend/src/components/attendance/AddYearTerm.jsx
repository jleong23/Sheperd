import { useState } from "react";

export default function AddYearTerm({ refreshAttendance }) {
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");
  const [weeks, setWeeks] = useState(10);

  const handleAddYear = async () => {
    if (!year) return alert("Enter a year");
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
    if (!year || !term) return alert("Enter both year and term");
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

  const handleDeleteTerm = async () => {
    if (!year || !term) {
      alert("Please enter both year and term to delete");
      return;
    }

    if (
      !confirm(`Are you sure you want to delete Year ${year} , Term ${term}? `)
    )
      return;

    const res = await fetch(
      `http://localhost:4000/attendance/term/${year}/${term}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: Number(year),
          term: Number(term),
        }),
      }
    );

    const data = await res.json();
    alert(data.message || data.error);
    refreshAttendance();
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-xl border border-gray-200 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Add Year / Term</h2>
      <div className="flex justify-center space-x-4 mb-5">
        {/* Year input */}
        <div className="flex flex-col w-24">
          <label className="mb-1 font-medium text-sm">Year</label>
          <input
            type="number"
            placeholder="2026"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Term input */}
        <div className="flex flex-col w-24">
          <label className="mb-1 font-medium text-sm">Term</label>
          <input
            type="number"
            placeholder="e.g. 4"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Weeks input */}
        <div className="flex flex-col w-24">
          <label className="mb-1 font-medium text-sm">Weeks</label>
          <input
            type="number"
            placeholder="e.g. 10"
            value={weeks}
            onChange={(e) => setWeeks(e.target.value)}
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleAddYear}
          className="bg-black hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Add Year
        </button>
        <button
          onClick={handleAddTerm}
          className="bg-black hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Add Term
        </button>

        <button
          onClick={handleDeleteTerm}
          className="bg-black hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Delete Term
        </button>
      </div>
    </div>
  );
}
