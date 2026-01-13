import { useState } from "react";
import AddYearTerm from "./AddYearTerm";
import useUser from "../../hooks/useUser";

export default function AttendanceSort({
  selectedYear,
  selectedTerm,
  availableYears,
  availableTerms,
  onYearChange,
  onTermChange,
  refreshAttendance,
}) {
  const [showAddYearTerm, setShowAddYearTerm] = useState(false);
  const { yearLevel } = useUser(1);

  return (
    <div className="mb-8 ">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            {yearLevel} Attendance
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and view attendance records
          </p>
        </div>

        <button
          onClick={() => setShowAddYearTerm((prev) => !prev)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            showAddYearTerm
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
          }`}
        >
          {showAddYearTerm ? (
            <>
              <span>Close Manager</span>
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </>
          ) : (
            <>
              <span>Manage Years & Terms</span>
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </>
          )}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showAddYearTerm
            ? "max-h-[500px] opacity-100 mb-8"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-50 rounded-2xl p-1 border border-gray-100 shadow-inner">
          <AddYearTerm refreshAttendance={refreshAttendance} />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-6 items-center">
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Academic Year
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8"
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label
            className={`text-xs font-bold uppercase tracking-wider ${!selectedYear ? "text-gray-300" : "text-gray-500"}`}
          >
            Term
          </label>
          <div className="relative">
            <select
              className={`w-full appearance-none border text-sm rounded-lg block p-2.5 pr-8 transition-colors ${
                !selectedYear
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              }`}
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
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${!selectedYear ? "text-gray-300" : "text-gray-700"}`}
            >
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
