import { useState, useEffect } from "react";
import { toggleAttendance } from "../../api/attendance";

export default function AttendanceList({
  currentAttendance,
  onToggleAttendance,
}) {
  const [localAttendance, setLocalAttendance] = useState(currentAttendance);

  // Keep local state in sync when props change
  useEffect(() => {
    const mapped = currentAttendance.map((record) => ({
      ...record,
      kidId: record.kidid, // ensure consistent casing
    }));
    setLocalAttendance(mapped); // use mapped array, not currentAttendance directly
  }, [currentAttendance]);

  // Update local state for toggle
  const handleToggle = async (recordId, currentPresent) => {
    // optimistic update
    setLocalAttendance((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              present: !currentPresent,
            }
          : r
      )
    );

    try {
      await toggleAttendance(recordId, !currentPresent);
    } catch (err) {
      console.error(err);
      //Optionally revert change on failure
      setLocalAttendance((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? {
                ...r,
                present: currentPresent,
              }
            : r
        )
      );
    }
  };

  // Handle reason update
  const handleReasonChange = (kidId, week, value) => {
    setLocalAttendance((prev) =>
      prev.map((r) =>
        r.kidId === kidId && r.week === week ? { ...r, reason: value } : r
      )
    );
  };

  const handleReasonSubmit = async (record) => {
    try {
      const res = await fetch(`http://localhost:4000/attendance/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          present: record.present,
          reason: record.reason,
        }),
      });

      if (!res.ok) throw new Error("Failed to update reason");

      const updated = await res.json();
      // Update local state
      setLocalAttendance((prev) =>
        prev.map((r) =>
          r.id === updated.id ? { ...r, reason: updated.reason } : r
        )
      );
      alert(`Reason for ${record.name} updated!`);
    } catch (err) {
      console.error(err);
      alert("Failed to update reason.");
    }
  };

  // Group by week
  const attendanceByWeek = localAttendance.reduce((acc, record) => {
    if (!acc[record.week]) acc[record.week] = [];
    acc[record.week].push(record);
    return acc;
  }, {});

  const sortedWeeks = Object.keys(attendanceByWeek)
    .map(Number)
    .sort((a, b) => b - a);

  return sortedWeeks.length > 0 ? (
    <div className="space-y-6">
      {sortedWeeks.map((week) => (
        <div key={week}>
          <h3 className="text-4xl text-center font-bold mb-2">Week {week}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-white p-8 m-8 rounded-xl">
            {attendanceByWeek[week].map((record, index) => {
              return (
                <div
                  key={`${record.kidId}-${record.week}-${index}`}
                  className={`border rounded p-4 flex flex-col gap-3 ${
                    record.present ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {record.photo && (
                        <img
                          src={record.photo}
                          alt={record.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <span className="font-semibold lg:text-xl">
                        {record.name}
                      </span>
                    </div>

                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={record.present}
                        onChange={() => handleToggle(record.id, record.present)}
                      />
                      <div
                        className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600
                         after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300
                         after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                         peer-checked:after:translate-x-full"
                      ></div>
                      <span className="ms-3 text-xl font-medium">
                        {record.present ? "Present" : "Absent"}
                      </span>
                    </label>
                  </div>

                  {!record.present && (
                    <div className="flex gap-2">
                      <textarea
                        type="text"
                        placeholder="Reason:"
                        value={record.reason || ""}
                        onChange={(e) =>
                          handleReasonChange(
                            record.kidId,
                            record.week,
                            e.target.value
                          )
                        }
                        className="border w-full rounded-md px-2 py-1 text-gray-700"
                      />
                      <button
                        className="bg-green-200 hover:bg-green-400 px-3 rounded-md"
                        onClick={() => handleReasonSubmit(record)}
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
