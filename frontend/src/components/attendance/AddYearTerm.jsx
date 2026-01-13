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
    alert(data.message || data.error);
    if (res.ok) {
      refreshAttendance(data.createdRecords);
    }
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
    alert(data.message || data.error);
    if (res.ok) {
      refreshAttendance();
    }
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-2xl mx-auto overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Configuration</h2>
        <p className="text-sm text-gray-500">
          Add new academic years or terms to the system.
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Year input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              placeholder="e.g. 2026"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Term input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Term</label>
            <input
              type="number"
              placeholder="e.g. 4"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Weeks input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Weeks Duration
            </label>
            <input
              type="number"
              placeholder="e.g. 10"
              value={weeks}
              onChange={(e) => setWeeks(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleAddYear}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex justify-center items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Year
          </button>
          <button
            onClick={handleAddTerm}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex justify-center items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Term
          </button>

          <button
            onClick={handleDeleteTerm}
            className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Term
          </button>
        </div>
      </div>
    </div>
  );
}
