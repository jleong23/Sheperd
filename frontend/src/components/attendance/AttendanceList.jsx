import { useState } from "react";

export default function AttendanceList({
  currentAttendance,
  onStatusChange,
  onReasonChange,
  onReasonSubmit,
}) {
  // Group by week
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

  return sortedWeeks.length > 0 ? (
    <div className="space-y-6">
      {sortedWeeks.map((week) => (
        <div key={week}>
          <h3 className="text-4xl text-center font-bold mb-2">Week {week}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-white p-8 m-8 rounded-xl">
            {attendanceByWeek[week].map((record) => {
              const [dropdownOpen, setDropdownOpen] = useState(false);
              return (
                <div
                  key={record.id}
                  className={`border rounded p-4 flex flex-col gap-3 ${
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
                      {record.photo ? (
                        <img
                          src={record.photo}
                          alt={record.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300" />
                      )}
                      <span className="font-semibold lg:text-xl">
                        {record.name}
                      </span>
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`px-3 py-1 rounded-full font-semibold text-sm w-28 text-left ${getStatusPillClass(record.status)}`}
                      >
                        {record.status}
                      </button>

                      {dropdownOpen && (
                        <div className="absolute mt-1 w-28 bg-white border rounded shadow-lg z-10">
                          {["maybe", "coming", "not coming"].map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                onStatusChange(
                                  record.kidId,
                                  record.week,
                                  option
                                );
                                setDropdownOpen(false);
                              }}
                              className={`block w-full text-left px-2 py-1 hover:bg-gray-100 ${
                                record.status === option ? "font-bold" : ""
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reason box */}
                  {(record.status === "not coming" ||
                    record.status === "maybe") && (
                    <div className="flex gap-2">
                      <textarea
                        placeholder="Reason..."
                        value={record.reason || ""}
                        onChange={(e) =>
                          onReasonChange(
                            record.kidId,
                            record.week,
                            e.target.value
                          )
                        }
                        rows={2}
                        className="border w-full rounded-md px-2 py-1 text-gray-700 resize-none"
                      />

                      <button
                        className="bg-green-200 hover:bg-green-400 px-3 rounded-md"
                        onClick={() =>
                          onReasonSubmit(record.kidId, record.week)
                        }
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
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500 my-8">No attendance available.</p>
  );
}
