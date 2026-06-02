/**
 * AttendanceResult.jsx
 * ---------------------------------------------------
 * Displays attendance records grouped by week.
 *
 * Features:
 * - Groups attendance data into collapsible weekly panels
 * - Displays attendance summary statistics
 * - Allows updating attendance status
 * - Allows adding/editing attendance reasons
 * - Supports importing and exporting attendance data
 * - Uses Framer Motion for smooth animations
 *
 * Main Components:
 * - AttendanceResult → Main container
 * - AttendancePanel → Expandable week section
 * - AttendanceStudentCard → Individual student attendance card
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

import AttendancePanel from "./AttendancePanel.jsx";
import ExportAttendance from "./ExportAttendance.jsx";
import ImportAttendance from "./ImportAttendance.jsx";
import InlineSpinner from "../ui/InlineSpinner.jsx";

export default function AttendanceResult({
  currentAttendance,
  onStatusChange,
  onReasonChange,
  onReasonSubmit,
  onImport,
  selectedTerm,
  selectedYear,
  importing,
}) {
  // ---------------------------------------------------
  // Group attendance records by week
  // Example:
  // {
  //   1: [records...],
  //   2: [records...]
  // }
  // ---------------------------------------------------
  const attendanceByWeek = currentAttendance.reduce((acc, record) => {
    if (!acc[record.week]) acc[record.week] = [];
    acc[record.week].push(record);
    return acc;
  }, {});

  // ---------------------------------------------------
  // Convert grouped week keys into sorted number array
  // Example:
  // ["1","2"] -> [1,2]
  // ---------------------------------------------------
  const sortedWeeks = Object.keys(attendanceByWeek)
    .map(Number)
    .sort((a, b) => a - b);

  // Controls which week panel is currently open
  const [open, setOpen] = useState(null);

  // Ensure an open panel still exists after filters change
  useEffect(() => {
    if (
      open !== null &&
      sortedWeeks.length > 0 &&
      !sortedWeeks.includes(open)
    ) {
      setOpen(sortedWeeks[0]);
    }
  }, [sortedWeeks, open]);

  return sortedWeeks.length > 0 ? (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="xl:pb-6 rounded-3xl shadow-xl overflow-visible border border-white/10 bg-white/5 backdrop-blur-md"
    >
      {/* ---------------------------------------------------
          Top Toolbar
      --------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border-b border-white/10 gap-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-300" />
          <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Full Term
          </span>
        </div>

        {/* Export + Import buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <ExportAttendance
            attendance={currentAttendance}
            label="Export Term"
          />
          <label
            htmlFor="import-attendance-term"
            className={`
              flex items-center justify-center gap-2
              px-4 py-2 min-h-[44px]
              rounded-xl border text-sm font-bold
              transition-all
              ${
                importing
                  ? "bg-purple-500/10 text-purple-300 border-purple-400/30 cursor-wait pointer-events-none"
                  : "bg-purple-500/10 text-purple-300 border-purple-400/30 hover:bg-purple-500/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer active:scale-95"
              }
            `}
          >
            {importing && <InlineSpinner />}
            {importing ? "Importing..." : "Import Term"}
          </label>
        </div>

        {/* Hidden import input */}
        <ImportAttendance
          onImport={onImport}
          term={selectedTerm}
          year={selectedYear}
        />
      </div>

      {/* ---------------------------------------------------
          Weekly Attendance Panels
      --------------------------------------------------- */}
      <div className="flex flex-col w-full max-w-7xl mx-auto overflow-visible rounded-3xl bg-transparent">
        {sortedWeeks.map((week) => (
          <AttendancePanel
            key={week}
            id={week}
            open={open}
            setOpen={setOpen}
            title={`Week ${week}`}
            count={attendanceByWeek[week].length}
            records={attendanceByWeek[week]}
            allAttendance={currentAttendance}
            onStatusChange={onStatusChange}
            onImport={onImport}
            onReasonChange={onReasonChange}
            onReasonSubmit={onReasonSubmit}
            selectedTerm={selectedTerm}
            selectedYear={selectedYear}
            importing={importing}
          />
        ))}
      </div>
    </motion.section>
  ) : (
    // ---------------------------------------------------
    // Empty State
    // ---------------------------------------------------
    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">
        No attendance records
      </h3>
      <p className="text-gray-500 mt-1">
        Try selecting a different year or term.
      </p>
    </div>
  );
}
