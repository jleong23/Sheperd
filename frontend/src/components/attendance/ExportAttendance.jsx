/**
 * attendance/ExportAttendance.jsx
 */
import * as XLSX from "xlsx";
import React from "react";

export default function ExportAttendance({ attendance }) {
  const handleExport = () => {
    if (!attendance || attendance.length === 0) return;

    const workbook = XLSX.utils.book_new();

    // Group attendance by week
    const groupedByWeek = attendance.reduce((acc, record) => {
      if (!acc[record.week]) acc[record.week] = [];
      acc[record.week].push(record);
      return acc;
    }, {});

    // Create sheet per week
    Object.entries(groupedByWeek).forEach(([week, records]) => {
      const exportData = records.map((r) => ({
        Name: r.name,
        Status: r.status,
        Reason: r.reason || "",
      }));

      const worksheet = XLSX.utils.aoa_to_sheet([
        ["Name", "Status", "Reason"], // header row
        ...exportData.map((r) => [r.Name, r.Status, r.Reason]),
      ]);

      const headerCells = ["A1", "B1", "C1"];
      headerCells.forEach((cell) => {
        if (worksheet[cell]) {
          worksheet[cell].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4F81BD" } }, // blue header
            alignment: { horizontal: "center" },
          };
        }
      });

      // Column widths
      worksheet["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 30 }];

      XLSX.utils.book_append_sheet(workbook, worksheet, `Week ${week}`);
    });

    // 4.Export file
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
