/**
 * ExportAttendance.jsx
 * ---------------------
 * Excel export component for attendance records.
 *
 * Responsibilities:
 * - Export attendance data into an Excel (.xlsx) file
 * - Generate a summary sheet with attendance statistics
 * - Generate individual sheets for each week
 * - Format Excel sheets with headers, colours, and frozen rows
 *
 * Libraries Used:
 * - ExcelJS → create and style Excel workbooks
 * - file-saver → trigger browser file download
 *
 * Props:
 * - attendance → array of attendance records
 * - label → optional custom button label
 */

import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function ExportAttendance({ attendance, label }) {
  /**
   * Main export handler
   * Runs when user clicks Export button
   */
  const handleExport = async () => {
    if (!attendance || attendance.length === 0) return;

    // Create new Excel workbook
    const workbook = new ExcelJS.Workbook();

    // Metadata shown inside Excel document properties
    workbook.creator = "Sheperd App";

    // -----------------------------
    // Group attendance by week
    // -----------------------------
    const groupedByWeek = attendance.reduce((acc, record) => {
      // If week doesn't exist yet, create empty array
      if (!acc[record.week]) acc[record.week] = [];
      // Push attendance record into correct week group
      acc[record.week].push(record);
      return acc;
    }, {});

    // -----------------------------
    // Summary Data
    // -----------------------------
    const summaryData = Object.entries(groupedByWeek).map(([week, records]) => {
      // Count attendance statuses
      const counts = records.reduce(
        (acc, r) => {
          if (r.status === "coming") acc.coming++;
          else if (r.status === "maybe") acc.maybe++;
          else if (r.status === "not coming") acc.notComing++;
          return acc;
        },
        // Initial counter values
        { coming: 0, maybe: 0, notComing: 0 },
      );

      // Return formatted summary row
      return {
        week: Number(week),
        total: records.length,
        coming: counts.coming,
        maybe: counts.maybe,
        notComing: counts.notComing,
      };
    });

    // -----------------------------
    // Summary Sheet
    // -----------------------------
    const summarySheet = workbook.addWorksheet("Summary");

    summarySheet.columns = [
      { header: "Term", key: "term", width: 10 },
      { header: "Year", key: "year", width: 10 },
      { header: "Week", key: "week", width: 10 },
      { header: "Total", key: "total", width: 10 },
      { header: "Coming", key: "coming", width: 12 },
      { header: "Maybe", key: "maybe", width: 12 },
      { header: "Not Coming", key: "notComing", width: 15 },
    ];

    summaryData
      .sort((a, b) => a.week - b.week)
      .forEach((row) =>
        summarySheet.addRow({
          ...row,
          term: attendance[0]?.term,
          year: attendance[0]?.year,
        }),
      );

    const summaryHeaderRow = summarySheet.getRow(1);

    summaryHeaderRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2F5597" },
      };
      cell.alignment = { horizontal: "center" };
    });

    const totalRow = summarySheet.addRow({
      week: "TOTAL",
      total: summaryData.reduce((sum, r) => sum + r.total, 0),
      coming: summaryData.reduce((sum, r) => sum + r.coming, 0),
      maybe: summaryData.reduce((sum, r) => sum + r.maybe, 0),
      notComing: summaryData.reduce((sum, r) => sum + r.notComing, 0),
    });

    totalRow.font = { bold: true };

    summarySheet.views = [{ state: "frozen", ySplit: 1 }];

    // -----------------------------
    // Week Sheets
    // -----------------------------
    Object.entries(groupedByWeek).forEach(([week, records]) => {
      const sheet = workbook.addWorksheet(`Week ${week}`);

      sheet.columns = [
        { header: "Name", key: "name", width: 25 },
        { header: "Status", key: "status", width: 15 },
        { header: "Reason", key: "reason", width: 30 },
        { header: "Week", key: "week", width: 10 },
        { header: "Term", key: "term", width: 10 },
        { header: "Year", key: "year", width: 12 },
      ];

      records.forEach((r) => {
        sheet.addRow({
          name: r.name,
          status: r.status,
          reason: r.reason || "",
          week: r.week,
          term: r.term,
          year: r.year,
        });
      });

      const weekHeaderRow = sheet.getRow(1);

      weekHeaderRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4F81BD" },
        };
        cell.alignment = { horizontal: "center" };
      });

      sheet.views = [{ state: "frozen", ySplit: 1 }];
    });

    // -----------------------------
    // EXPORT (must be LAST)
    // -----------------------------
    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer]),
      `Attendance-Term-${attendance[0]?.term}-${attendance[0]?.year}.xlsx`,
    );
  };

  return (
    <div className="flex-shrink-0">
      <button
        onClick={handleExport}
        className="flex items-center justify-center px-4 py-2 min-h-[44px] rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 active:bg-blue-200 active:scale-95 text-sm font-bold transition-all shadow-sm"
      >
        {label || "Export Attendance"}
      </button>
    </div>
  );
}
