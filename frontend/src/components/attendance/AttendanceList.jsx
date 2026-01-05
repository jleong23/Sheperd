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

  const getStatusPillClass = (status) => {
    switch (status) {
      case "coming":
        return "bg-green-200 text-green-800";
      case "not coming":
        return "bg-red-200 text-red-800";
      case "maybe":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-800";
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
          <div key={week} className="bg-white rounded-xl shadow-md p-4">
            {/* Week Header */}
            <h3
              onClick={() => toggleWeek(week)}
              className="text-3xl text-center font-bold mb-4 cursor-pointer flex justify-center items-center gap-3 select-none"
            >
              Week {week}
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${
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
            </h3>

            {/* Week Content */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                isWeekOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {/* Summary */}
              <div className="flex justify-center gap-4 mb-4 text-lg font-semibold">
                <span className="text-green-700">Coming: {summary.coming}</span>
                <span className="text-yellow-700">Maybe: {summary.maybe}</span>
                <span className="text-red-700">
                  Not Coming: {summary.notComing}
                </span>
              </div>

              {/* Records Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-slate-100 p-6 rounded-xl">
                {weekRecords.map((record) => {
                  const isOpen = !!openDropdowns[record.id];

                  return (
                    <div
                      key={record.id}
                      className={`border shadow-md rounded-xl p-4 flex flex-col gap-3 ${
                        record.status === "coming"
                          ? "bg-green-100"
                          : record.status === "not coming"
                            ? "bg-red-100"
                            : "bg-yellow-100"
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={profileIcon}
                            alt={record.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="font-semibold text-sm 2xl:text-lg">
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
                            className={`px-3 py-1 rounded-full font-semibold text-sm w-28 text-left flex justify-between items-center ${getStatusPillClass(
                              record.status
                            )}`}
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
                                className={`block w-full text-left px-2 py-1 hover:bg-gray-100 ${
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
                        <div className="flex gap-2">
                          <textarea
                            placeholder="Reason..."
                            value={record.reason || ""}
                            onChange={(e) =>
                              onReasonChange(record.id, e.target.value)
                            }
                            rows={2}
                            className="border w-full rounded-md px-2 py-1 text-gray-700 resize-none"
                          />
                          <button
                            className="bg-green-200 hover:bg-green-400 px-3 rounded-md"
                            onClick={() => onReasonSubmit(record.id)}
                          >
                            Done
                          </button>
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
