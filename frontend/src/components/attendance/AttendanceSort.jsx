/**
 * AttendanceSort.jsx
 * -------------------
 * Attendance filtering and configuration component.
 *
 * Responsibilities:
 * - Display page heading and attendance information
 * - Filter attendance by academic year and term
 * - Toggle the AddYearTerm management panel
 * - Pass selected filters back to parent component
 *
 * Props:
 * - selectedYear → currently selected academic year
 * - selectedTerm → currently selected term
 * - availableYears → list of available years
 * - availableTerms → list of available terms for selected year
 * - onYearChange → callback when year changes
 * - onTermChange → callback when term changes
 * - refreshAttendance → refresh attendance data after updates
 */

import { useState } from "react";
import { Settings, X } from "lucide-react";
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
  // Controls whether the AddYearTerm manager panel is visible
  const [showAddYearTerm, setShowAddYearTerm] = useState(false);

  // Custom hook to fetch current user information
  // yearLevel is displayed in the page heading
  const { yearLevel } = useUser(1);

  return (
    <div className="mb-6 sm:mb-8">
      {/* ======================================
          Page Header
      ====================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {yearLevel} Attendance
          </h1>

          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Manage and view attendance records
          </p>
        </div>

        {/* ======================================
            Toggle AddYearTerm Manager
        ====================================== */}
        <button
          // prev => !prev toggles boolean state
          // true becomes false, false becomes true
          onClick={() => setShowAddYearTerm((prev) => !prev)}
          className={`flex items-center justify-center gap-2 px-4 py-2 min-h-[44px] rounded-xl font-bold transition-all duration-200 active:scale-95 ${
            showAddYearTerm
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              : "bg-slate-900 text-white hover:bg-black shadow-md hover:shadow-lg"
          }`}
        >
          {/* Conditional rendering based on state */}
          {showAddYearTerm ? (
            <>
              <X className="w-4 h-4" />
              <span>Close Manager</span>
            </>
          ) : (
            <>
              <Settings className="w-4 h-4" />
              <span>Manage Years & Terms</span>
            </>
          )}
        </button>
      </div>

      {/* ======================================
          Expandable AddYearTerm Panel
      ====================================== */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showAddYearTerm
            ? "max-h-[1000px] opacity-100 mb-8"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-50 rounded-2xl p-1 sm:p-2 border border-gray-100 shadow-inner">
          <AddYearTerm
            // Refresh attendance after adding/deleting year or term
            onUpdate={refreshAttendance}
            availableYears={availableYears}
          />
        </div>
      </div>

      {/* ======================================
          Filters Bar
      ====================================== */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-8 items-stretch sm:items-center">
        {/* ======================================
            Academic Year Filter
        ====================================== */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Academic Year
          </label>

          <div className="relative">
            <select
              className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm font-medium rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block min-h-[44px] px-4 pr-10 transition-all cursor-pointer"
              // Controlled component value
              value={selectedYear || ""}
              // Convert dropdown string value into Number
              // HTML select values are always strings
              onChange={(e) => onYearChange(Number(e.target.value))}
            >
              <option value="">Select Year</option>

              {/* Render available years dynamically */}
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Custom dropdown arrow icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ======================================
            Term Filter
        ====================================== */}
        <div className="flex flex-col gap-2 flex-1">
          <label
            className={`text-[10px] font-black uppercase tracking-widest ml-1 ${
              // Make label lighter when disabled
              !selectedYear ? "text-gray-300" : "text-gray-400"
            }`}
          >
            Term
          </label>

          <div className="relative">
            <select
              className={`w-full appearance-none border text-sm font-medium rounded-xl block min-h-[44px] px-4 pr-10 transition-all ${
                // Disable styling when no year selected
                !selectedYear
                  ? "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed"
                  : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              }`}
              value={selectedTerm || ""}
              // Convert selected value to Number
              onChange={(e) => onTermChange(Number(e.target.value))}
              // Disable term dropdown until a year is selected
              disabled={!selectedYear}
            >
              <option value="">Select Term</option>

              {/* Render available terms dynamically */}
              {availableTerms.map((term) => (
                <option key={term} value={term}>
                  Term {term}
                </option>
              ))}
            </select>

            {/* Custom dropdown icon */}
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${
                !selectedYear ? "text-gray-200" : "text-gray-400"
              }`}
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
