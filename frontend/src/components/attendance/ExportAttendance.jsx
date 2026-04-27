/**
 * attendance/ExportAttendance.jsx
 */
import { CSVLink } from "react-csv";
import React from "react";

export default function ExportAttendance({ attendance }) {
  const headers = [
    { label: "Name", key: "name" },
    { label: "Term", key: "term" },
    { label: "Week", key: "week" },
    { label: "Status", key: "status" },
    { label: "Reason", key: "reason" },
  ];

  // Transform data to match
  const csvData = attendance.map((record) => ({
    name: record.name,
    term: record.term,
    week: record.week,
    status: record.status,
    reason: record.reason,
  }));
  // for debug purposes
  console.log(csvData);

  return (
    <>
      <div className="ml-auto">
        <CSVLink
          headers={headers}
          data={csvData} // pass the transformed data array here
          // Exported file name
          filename={`Attendance-Week-${attendance[0]?.week || "data"}.csv`}
          className="flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-200 text-sm font-medium"
        >
          <button>Export Attendance</button>
        </CSVLink>
      </div>
    </>
  );
}
