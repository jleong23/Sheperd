/**
 * attendance/ExportAttendance.jsx
 */
import * as XLSX from "xlsx";
import React from "react";

export default function ExportAttendance({ attendance }) {
  const handleExport = () => {
    if (!attendance || attendance.length === 0) return;

    // 1.Transform data to match
    const exportData = attendance.map((record) => ({
      Name: record.name,
      Status: record.status,
      Reason: record.reason || "",
    }));

    // 2.Convert JSON -> worksheet

    // 3.Create workbook
    const workbook = XLSX.utils.book_new();

    // 4.Append sheet
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(exportData),
      "Attendance",
    );

    // 5.Export file
    XLSX.writeFile(
      workbook,
      `Attendance-Term-${attendance[0]?.term}-Week-${attendance[0]?.week || "data"}-${attendance[0]?.year}.xlsx`,
    );
  };

  return (
    <>
      <div className="ml-auto">
        <button
          onClick={handleExport}
          className="flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-200 text-sm font-medium"
        >
          Export Attendance
        </button>
      </div>
    </>
  );
}
