import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function ExportAttendance({ attendance }) {
  const handleExport = async () => {
    if (!attendance || attendance.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Sheperd App";

    // -----------------------------
    // Group attendance by week
    // -----------------------------
    const groupedByWeek = attendance.reduce((acc, record) => {
      if (!acc[record.week]) acc[record.week] = [];
      acc[record.week].push(record);
      return acc;
    }, {});

    // -----------------------------
    // Summary Data
    // -----------------------------
    const summaryData = Object.entries(groupedByWeek).map(([week, records]) => {
      const counts = records.reduce(
        (acc, r) => {
          if (r.status === "coming") acc.coming++;
          else if (r.status === "maybe") acc.maybe++;
          else if (r.status === "not coming") acc.notComing++;
          return acc;
        },
        { coming: 0, maybe: 0, notComing: 0 },
      );

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
      { header: "Week", key: "week", width: 10 },
      { header: "Total", key: "total", width: 10 },
      { header: "Coming", key: "coming", width: 12 },
      { header: "Maybe", key: "maybe", width: 12 },
      { header: "Not Coming", key: "notComing", width: 15 },
    ];

    summaryData
      .sort((a, b) => a.week - b.week)
      .forEach((row) => summarySheet.addRow(row));

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
      ];

      records.forEach((r) => {
        sheet.addRow({
          name: r.name,
          status: r.status,
          reason: r.reason || "",
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
    <div className="ml-auto">
      <button
        onClick={handleExport}
        className="flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-200 text-sm font-medium"
      >
        Export Attendance
      </button>
    </div>
  );
}
