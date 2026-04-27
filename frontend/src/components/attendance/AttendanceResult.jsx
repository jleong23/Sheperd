/**
 * /Users/jleong_23/Documents/Folders/Sheperd/frontend/src/components/attendance/AttendanceResult.jsx
 */
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Users, ChevronDown } from "lucide-react";
import profileIcon from "../../assets/profileIcon.png";
import ExportAttendance from "./ExportAttendance.jsx";

export default function AttendanceResult({
  currentAttendance,
  onStatusChange,
  onReasonChange,
  onReasonSubmit,
}) {
  // Group records by week
  const attendanceByWeek = currentAttendance.reduce((acc, record) => {
    if (!acc[record.week]) acc[record.week] = [];
    acc[record.week].push(record);
    return acc;
  }, {});

  const sortedWeeks = Object.keys(attendanceByWeek)
    .map(Number)
    .sort((a, b) => a - b);

  // Default to opening the first available week
  const [open, setOpen] = useState(null);

  // Update open state if weeks change (e.g. filter change)
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
            onStatusChange={onStatusChange}
            onReasonChange={onReasonChange}
            onReasonSubmit={onReasonSubmit}
          />
        ))}
      </div>
    </section>
  ) : (
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
}) => {
  const isOpen = open === id;

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
      <button
        className={`
          relative group flex items-center justify-between w-full p-4 transition-colors border-b border-slate-700/50
          ${isOpen ? "bg-gray-800" : "bg-slate-800 hover:bg-slate-700"}
        `}
        onClick={() => setOpen(isOpen ? null : id)}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              isOpen
                ? "bg-indigo-500 text-white"
                : "bg-slate-700 text-slate-400"
            }`}
          >
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-xl font-light text-slate-200 tracking-wider">
              {title}
            </span>
            <span className="text-xs text-slate-400">{count} Students</span>
          </div>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-white border-b border-gray-200 flex flex-wrap gap-3 shadow-sm z-10 shrink-0"
            >
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Coming: {summary.coming}
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                Maybe: {summary.maybe}
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Not Coming: {summary.notComing}
              </div>
              <ExportAttendance attendance={records} />
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

const StudentCard = ({
  record,
  onStatusChange,
  onReasonChange,
  onReasonSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);

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

  const styles = getStatusStyles(record.status);

  return (
    <div
      className={`border shadow-sm rounded-lg p-4 flex flex-col gap-3 transition-all hover:shadow-md ${styles.container}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={profileIcon}
              alt={record.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
          </div>
          <span className="font-semibold text-gray-800 text-sm">
            {record.name}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className={`px-3 py-1.5 rounded-md font-medium text-xs uppercase tracking-wide w-32 text-left flex justify-between items-center transition-colors ${styles.badge}`}
          >
            <span>{record.status}</span>
            <ChevronDown
              className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow-lg z-20 overflow-hidden">
                {["maybe", "coming", "not coming"].map((option) => (
                  <button
                    key={option}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(record.id, option);
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-xs uppercase hover:bg-gray-50 ${
                      record.status === option ? "font-bold bg-gray-50" : ""
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

      {(record.status === "not coming" || record.status === "maybe") && (
        <div className="mt-2 pt-3 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">
            Reason
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a note..."
              value={record.reason || ""}
              onChange={(e) => onReasonChange(record.id, e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
            />
            <button
              className="bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
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
