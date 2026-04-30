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
 * - Panel → Expandable week section
 * - StudentCard → Individual student attendance card
 */
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Users, ChevronDown } from "lucide-react";
import profileIcon from "../../assets/profileIcon.png";
import ExportAttendance from "./ExportAttendance.jsx";
import ImportAttendance from "./ImportAttendance.jsx";

export default function AttendanceResult({
  currentAttendance,
  onStatusChange,
  onReasonChange,
  onReasonSubmit,
  onImport,
  selectedTerm,
  selectedYear,
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
    <section className="xl:pb-6 rounded-2xl shadow-xl overflow-hidden">
      {/* ---------------------------------------------------
          Top Toolbar
      --------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border-b border-gray-200 gap-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
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
            className="flex items-center justify-center px-4 py-2 min-h-[44px] rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 active:bg-indigo-200 text-sm font-bold cursor-pointer transition-colors"
          >
            Import Term
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
      <div className="flex flex-col w-full max-w-7xl mx-auto overflow-hidden rounded-xl bg-slate-800">
        {sortedWeeks.map((week) => (
          <Panel
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
          />
        ))}
      </div>
    </section>
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

/**
 * Panel Component
 * ---------------------------------------------------
 * Expandable section for a single week.
 *
 * Features:
 * - Expand/collapse animation
 * - Weekly attendance summary
 * - Weekly export/import
 * - Displays student cards
 */
const Panel = ({
  open,
  setOpen,
  id,
  title,
  count,
  records,
  onStatusChange,
  onReasonChange,
  onReasonSubmit,
  onImport,
  selectedTerm,
  selectedYear,
}) => {
  const isOpen = open === id; // Check if this week is currently open

  // Calculate summary stats
  const summary = records.reduce(
    (acc, r) => {
      if (r.status === "coming") acc.coming += 1;
      else if (r.status === "maybe") acc.maybe += 1;
      else if (r.status === "not coming") acc.notComing += 1;
      return acc;
    },
    { coming: 0, maybe: 0, notComing: 0 },
  );

  return (
    <>
      {/* ---------------------------------------------------
          Panel Header Button
      --------------------------------------------------- */}
      <button
        className={`
          relative group flex items-center justify-between w-full p-4 sm:p-5 transition-all border-b border-slate-700/50 min-h-[72px]
          ${isOpen ? "bg-slate-800/50" : "bg-slate-800 hover:bg-slate-700/80 active:bg-slate-700"}
        `}
        onClick={() => setOpen(isOpen ? null : id)}
      >
        {/* Left Side */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm ${
              isOpen
                ? "bg-indigo-500 text-white shadow-indigo-500/20"
                : "bg-slate-700 text-slate-400"
            }`}
          >
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-lg sm:text-xl font-medium text-slate-200 tracking-wide">
              {title}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">
              {count} Students
            </span>
          </div>
        </div>

        {/* Expand Icon */}
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ---------------------------------------------------
          Animated Expand/Collapse Content
      --------------------------------------------------- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`panel-${id}`}
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="w-full h-full overflow-hidden relative bg-slate-50 flex flex-col"
          >
            {/* Panel Header / Summary */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-white border-b border-gray-200 flex flex-col gap-4 shadow-sm z-10 shrink-0"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 py-2 sm:px-3 sm:py-1 rounded-xl sm:rounded-full bg-green-50 text-green-700 border border-green-100 text-[10px] sm:text-xs font-bold uppercase tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="hidden sm:inline">Coming:</span>{" "}
                  {summary.coming}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 py-2 sm:px-3 sm:py-1 rounded-xl sm:rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100 text-[10px] sm:text-xs font-bold uppercase tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span className="hidden sm:inline">Maybe:</span>{" "}
                  {summary.maybe}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 py-2 sm:px-3 sm:py-1 rounded-xl sm:rounded-full bg-red-50 text-red-700 border border-red-100 text-[10px] sm:text-xs font-bold uppercase tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="hidden sm:inline">Not Coming:</span>{" "}
                  {summary.notComing}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <ExportAttendance
                  attendance={records}
                  label={`Export Week ${id}`}
                />
                <label
                  htmlFor={`import-attendance-${id}`}
                  className="flex items-center justify-center px-4 py-2 min-h-[44px] rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 active:bg-indigo-200 text-sm font-bold cursor-pointer transition-colors"
                >
                  Import Week {id}
                </label>
              </div>
              <ImportAttendance
                onImport={onImport}
                week={id}
                term={selectedTerm}
                year={selectedYear}
              />
            </motion.div>

            {/* Scrollable Content Area */}
            <motion.div
              variants={descriptionVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex-1 overflow-y-auto p-4 lg:p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {records.map((record) => (
                  <StudentCard
                    key={record.id}
                    record={record}
                    onStatusChange={onStatusChange}
                    onReasonChange={onReasonChange}
                    onReasonSubmit={onReasonSubmit}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * StudentCard Component
 * ---------------------------------------------------
 * Displays an individual student's attendance record.
 *
 * Features:
 * - Attendance status dropdown
 * - Attendance reason input
 * - Dynamic styling based on attendance status
 */
const StudentCard = ({
  record,
  onStatusChange,
  onReasonChange,
  onReasonSubmit,
}) => {
  // Controls drop down visibility
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Returns Tailwind styles depending on attendance status
   */
  const getStatusStyles = (status) => {
    switch (status) {
      case "coming":
        return {
          container: "border-l-4 border-l-green-500 bg-white",
          badge: "bg-green-100 text-green-800",
        };
      case "not coming":
        return {
          container: "border-l-4 border-l-red-500 bg-white",
          badge: "bg-red-100 text-red-800",
        };
      case "maybe":
        return {
          container: "border-l-4 border-l-yellow-500 bg-white",
          badge: "bg-yellow-100 text-yellow-800",
        };
      default:
        return {
          container: "border-l-4 border-l-gray-300 bg-white",
          badge: "bg-gray-100 text-gray-800",
        };
    }
  };

  // Get matching styles for current status
  const styles = getStatusStyles(record.status);

  return (
    <div
      className={`border shadow-sm rounded-xl p-4 flex flex-col gap-4 transition-all hover:shadow-md ${styles.container}`}
    >
      {/* Student Header */}
      <div className="flex items-center justify-between gap-2">
        {/* Student Info */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex-shrink-0">
            <img
              src={profileIcon}
              alt={record.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
          </div>
          <span className="font-bold text-gray-900 text-sm sm:text-base truncate">
            {record.name}
          </span>
        </div>

        {/* Status Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className={`px-3 py-2 min-h-[44px] rounded-lg font-bold text-[10px] sm:text-xs uppercase tracking-wider w-28 sm:w-32 text-left flex justify-between items-center transition-colors shadow-sm active:scale-95 ${styles.badge}`}
          >
            <span className="truncate">{record.status}</span>
            <ChevronDown
              className={`w-4 h-4 ml-1 flex-shrink-0 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-30 bg-black/5"
                onClick={() => setIsOpen(false)}
              />
              {/* Dropdown options */}
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-40 overflow-hidden py-1">
                {["maybe", "coming", "not coming"].map((option) => (
                  <button
                    key={option}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(record.id, option);
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 text-xs font-bold uppercase hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                      record.status === option
                        ? "text-indigo-600 bg-indigo-50/50"
                        : "text-gray-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------
          Reason Input
          Only shown for "maybe" or "not coming"
      --------------------------------------------------- */}
      {(record.status === "not coming" || record.status === "maybe") && (
        <div className="mt-1 pt-4 border-t border-gray-100 flex flex-col gap-2.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Reason for {record.status}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Controlled input */}
            <input
              type="text"
              placeholder="Add a note..."
              value={record.reason || ""}
              onChange={(e) => onReasonChange(record.id, e.target.value)}
              className="flex-1 min-h-[44px] border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all placeholder:text-gray-400"
            />
            {/* Save button */}
            <button
              className="bg-slate-900 hover:bg-black active:bg-slate-800 text-white min-h-[44px] sm:px-6 px-4 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-sm active:scale-95"
              onClick={() => onReasonSubmit(record.id)}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------
// Framer Motion Animation Variants
// ---------------------------------------------------
const panelVariants = {
  open: {
    height: "auto",
    opacity: 1,
  },
  closed: {
    height: 0,
    opacity: 0,
  },
};

const descriptionVariants = {
  open: {
    opacity: 1,
    y: "0%",
    transition: {
      delay: 0.125,
    },
  },
  closed: { opacity: 0, y: "20px" },
};
