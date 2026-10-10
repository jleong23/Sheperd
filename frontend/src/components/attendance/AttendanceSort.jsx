/**
 * AttendanceSort.jsx
 * -------------------
 * Attendance filtering and configuration component.
 *
 * - Displays page heading
 * - Filters attendance by academic year and term
 * - Toggles the AddYearTerm management panel (pastor only)
 *
 * Props:
 * - selectedYear / selectedTerm → current filters
 * - availableYears / availableTerms → filter options
 * - allTerms → every term (used by the manager)
 * - onYearChange / onTermChange → filter callbacks
 * - refreshAttendance → refresh data after manager updates
 */

import { useState } from "react";
import { ChevronDown, Settings, X } from "lucide-react";
import AddYearTerm from "./AddYearTerm";
import useUser from "../../hooks/useUser";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";

const SELECT_CLASS =
  "w-full min-h-[44px] appearance-none rounded-xl border px-4 pr-10 text-sm font-medium transition-all";
const SELECT_ACTIVE =
  "cursor-pointer border-white/10 bg-white/5 text-white hover:bg-white/10 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30";
const SELECT_DISABLED =
  "cursor-not-allowed border-white/5 bg-white/[0.03] text-slate-600";

function SelectField({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  children,
}) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <label
        className={`text-xs font-semibold ${
          disabled ? "text-slate-600" : "text-slate-300"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${SELECT_CLASS} ${disabled ? SELECT_DISABLED : SELECT_ACTIVE}`}
        >
          <option value="">{placeholder}</option>
          {children}
        </select>
        <ChevronDown
          className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
            disabled ? "text-slate-600" : "text-slate-400"
          }`}
        />
      </div>
    </div>
  );
}

export default function AttendanceSort({
  selectedYear,
  selectedTerm,
  availableYears,
  availableTerms,
  allTerms,
  onYearChange,
  onTermChange,
  refreshAttendance,
}) {
  const [showManager, setShowManager] = useState(false);

  const { yearLevel } = useUser(1);
  const { profile } = useAuth();
  const isPastor = profile?.role === "pastor";

  // Normalise terms into { value, label } options
  const termOptions = (availableTerms ?? []).map((term) => {
    const isObject = term && typeof term === "object";
    const number = Number(isObject ? (term.term ?? term.id) : term);
    const value = Number(isObject ? (term.id ?? term.term) : term);

    return {
      value,
      label: Number.isFinite(number) ? `Term ${number}` : "Term",
    };
  });

  return (
    <Motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mb-8"
    >
      {/* Page header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {yearLevel} Attendance
          </h1>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Manage attendance records and weekly reports
          </p>
        </div>

        {isPastor && (
          <button
            onClick={() => setShowManager((prev) => !prev)}
            aria-expanded={showManager}
            className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all active:scale-[0.98] ${
              showManager
                ? "border-white/10 bg-white/10 text-slate-200 hover:bg-white/15"
                : "border-white/10 bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            {showManager ? (
              <>
                <X className="h-4 w-4" />
                Close Manager
              </>
            ) : (
              <>
                <Settings className="h-4 w-4" />
                Manage Years &amp; Terms
              </>
            )}
          </button>
        )}
      </div>

      {/* Collapsible manager panel */}
      {isPastor && (
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            showManager
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="pb-6">
              <AddYearTerm
                onUpdate={refreshAttendance}
                availableYears={availableYears}
                allTerms={allTerms}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-md sm:flex-row sm:gap-6">
        <SelectField
          label="Academic year"
          placeholder="Select year"
          value={selectedYear || ""}
          onChange={(e) => onYearChange(Number(e.target.value))}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Term"
          placeholder="Select term"
          value={selectedTerm || ""}
          onChange={(e) => onTermChange(Number(e.target.value))}
          disabled={!selectedYear}
        >
          {termOptions.map((term) => (
            <option key={term.value} value={term.value}>
              {term.label}
            </option>
          ))}
        </SelectField>
      </div>
    </Motion.div>
  );
}
