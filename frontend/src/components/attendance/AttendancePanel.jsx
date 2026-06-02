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

import { Calendar, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import AttendanceStudentCard from "./AttendanceStudentCard.jsx";
import ExportAttendance from "./ExportAttendance.jsx";
import ImportAttendance from "./ImportAttendance.jsx";
import InlineSpinner from "../ui/InlineSpinner.jsx";

export default function AttendancePanel({
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
  importing,
}) {
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
        relative group flex items-center justify-between w-full p-4 sm:p-5 transition-all border-b border-white/10 min-h-[72px]
        ${isOpen ? "bg-white/10" : "bg-white/5 hover:bg-white/10 active:bg-white/15"}
      `}
        onClick={() => setOpen(isOpen ? null : id)}
      >
        {/* Left Side */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm ${
              isOpen
                ? "bg-blue-500/15 text-blue-300 border border-blue-400/30"
                : "bg-white/10 text-slate-400 border border-white/10"
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
            className={`w-full h-full overflow-visible relative bg-transparent flex flex-col ${
              isOpen ? "z-50" : "z-0"
            }`}
          >
            {/* Panel Header / Summary */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-white/5 border-b border-white/10 flex flex-col gap-4 shadow-sm z-10 shrink-0"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 py-2 sm:px-3 sm:py-1 rounded-xl sm:rounded-full bg-green-500/15 text-green-300 border border-green-400/30 text-[10px] sm:text-xs font-bold uppercase tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="hidden sm:inline">Coming:</span>{" "}
                  {summary.coming}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 py-2 sm:px-3 sm:py-1 rounded-xl sm:rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-400/30 text-[10px] sm:text-xs font-bold uppercase tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span className="hidden sm:inline">Maybe:</span>{" "}
                  {summary.maybe}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 py-2 sm:px-3 sm:py-1 rounded-xl sm:rounded-full bg-red-500/15 text-red-300 border border-red-400/30 text-[10px] sm:text-xs font-bold uppercase tracking-tight">
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
                  {importing ? "Importing..." : `Import Week ${id}`}
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
              className="flex-1 overflow-visible p-4 lg:p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {records.map((record) => (
                  <AttendanceStudentCard
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
}

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
  closed: {
    opacity: 0,
    y: "20px",
  },
};
