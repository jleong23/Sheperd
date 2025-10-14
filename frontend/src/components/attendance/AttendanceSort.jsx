import { useState } from "react";
import AddYearTerm from "./AddYearTerm";

export default function AttendanceSort({
  selectedYear,
  selectedTerm,
  availableYears,
  availableTerms,
  onYearChange,
  onTermChange,
}) {
  const [showAddYearTerm, setShowAddYearTerm] = useState(false);

  return (
    <div className="flex flex-col gap-4 mb-8 px-8 text-2xl">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-10 items-end">
        {/* Year */}
        <div className="flex flex-col">
          <label className="font-semibold mb-2">Year</label>
          <select
            className="p-2 border rounded-lg"
            value={selectedYear || ""}
            onChange={(e) => onYearChange(Number(e.target.value))}
          >
            <option value="">Select Year</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Term */}
        <div className="flex flex-col">
          <label className="font-semibold mb-2">Term</label>
          <select
            className="p-2 border rounded-lg"
            value={selectedTerm || ""}
            onChange={(e) => onTermChange(Number(e.target.value))}
            disabled={!selectedYear}
          >
            <option value="">Select Term</option>
            {availableTerms.map((term) => (
              <option key={term} value={term}>
                Term {term}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setShowAddYearTerm((prev) => !prev)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition"
        >
          {showAddYearTerm ? "Hide Add Year & Term" : "Add Year & Term"}
        </button>
      </div>

      {/* Dropdown panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          showAddYearTerm ? "max-h-96 mt-4" : "max-h-0"
        }`}
      >
        {showAddYearTerm && <AddYearTerm refreshAttendance={() => {}} />}
      </div>
    </div>
  );
}
