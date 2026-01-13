import { useState, useEffect } from "react";
import profileIcon from "../../assets/profileIcon.png";

export default function AttendanceList({
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

  const [openDropdowns, setOpenDropdowns] = useState({});
  const [openWeeks, setOpenWeeks] = useState({});

  // Close all record dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdowns({});
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (recordId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  };

  const toggleWeek = (week) => {
    setOpenWeeks((prev) => ({
      ...prev,
      [week]: !prev[week],
    }));
  };

  return sortedWeeks.length > 0 ? (
    <div className="space-y-6">
      {sortedWeeks.map((week) => {
        const weekRecords = attendanceByWeek[week];

        // Weekly summary
        const summary = weekRecords.reduce(
          (acc, r) => {
            if (r.status === "coming") acc.coming += 1;
            else if (r.status === "maybe") acc.maybe += 1;
            else if (r.status === "not coming") acc.notComing += 1;
            return acc;
          },
          { coming: 0, maybe: 0, notComing: 0 }
        );

        const isWeekOpen = !!openWeeks[week];

        return (
          <div
            key={week}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Week Header */}
            <div
              onClick={() => toggleWeek(week)}
              className="bg-gray-50 px-6 py-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 transition-colors select-none"
            >
              <h3 className="text-lg font-bold text-gray-800">Week {week}</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 font-medium">
                  {weekRecords.length} Students
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isWeekOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Week Content */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                isWeekOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {/* Summary */}
              <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap gap-4 text-sm font-medium bg-white">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Coming: {summary.coming}
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Maybe: {summary.maybe}
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Not Coming: {summary.notComing}
                </div>
              </div>

              {/* Records Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 bg-gray-50">
                {weekRecords.map((record) => {
                  const isOpen = !!openDropdowns[record.id];
                  const styles = getStatusStyles(record.status);

                  return (
                    <div
                      key={record.id}
                      className={`border shadow-sm rounded-lg p-4 flex flex-col gap-3 transition-all hover:shadow-md ${styles.container}`}
                    >
                      {/* Header */}
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

                        {/* Status Dropdown */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(record.id);
                            }}
                            className={`px-3 py-1.5 rounded-md font-medium text-xs uppercase tracking-wide w-32 text-left flex justify-between items-center transition-colors ${styles.badge}`}
                          >
                            <span>{record.status}</span>
                            <svg
                              className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {/* Dropdown Options */}
                          <div
                            className={`absolute mt-1 w-28 bg-white border rounded shadow-lg z-10 overflow-hidden transition-all duration-300 ${
                              isOpen
                                ? "max-h-40 opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            {["maybe", "coming", "not coming"].map((option) => (
                              <button
                                key={option}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStatusChange(record.id, option);
                                  setOpenDropdowns({});
                                }}
                                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                                  record.status === option ? "font-bold" : ""
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Reason Box */}
                      {(record.status === "not coming" ||
                        record.status === "maybe") && (
                        <div className="mt-2 pt-3 border-t border-gray-100">
                          <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">
                            Reason
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add a note..."
                              value={record.reason || ""}
                              onChange={(e) =>
                                onReasonChange(record.id, e.target.value)
                              }
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
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-center text-gray-500 my-8">No attendance available.</p>
  );
}
