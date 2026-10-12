/**
 * ExportAttendance.jsx
 * ---------------------
 * Excel export component for attendance records.
 */

export default function ExportAttendance({ attendance, label }) {
  /**
   * Main export handler.
   * Excel libraries are loaded only when export is requested.
   */
  const handleExport = async () => {
    if (!attendance || attendance.length === 0) return;

    try {
      // Load large export libraries on demand.
      const [{ default: ExcelJS }, { saveAs }] = await Promise.all([
        import("exceljs"),
        import("file-saver"),
      ]);

      // Create new Excel workbook.
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Sheperd App";

      // Group attendance by week.
      const groupedByWeek = attendance.reduce((acc, record) => {
        if (!acc[record.week]) acc[record.week] = [];
        acc[record.week].push(record);
        return acc;
      }, {});

      // Build summary data.
      const summaryData = Object.entries(groupedByWeek).map(
        ([week, records]) => {
          const counts = records.reduce(
            (acc, record) => {
              if (record.status === "coming") acc.coming++;
              else if (record.status === "maybe") acc.maybe++;
              else if (record.status === "not coming") acc.notComing++;
              else if (record.status === "tbc") acc.tbc++;

              if (record.call_status === "called") acc.called++;
              else if (record.call_status === "npu") acc.npu++;
              else acc.noCall++;

              return acc;
            },
            {
              coming: 0,
              maybe: 0,
              notComing: 0,
              tbc: 0,
              called: 0,
              noCall: 0,
              npu: 0,
            },
          );

          return {
            week: Number(week),
            total: records.length,
            coming: counts.coming,
            maybe: counts.maybe,
            notComing: counts.notComing,
            tbc: counts.tbc,
            called: counts.called,
            noCall: counts.noCall,
            npu: counts.npu,
          };
        },
      );

      // Summary sheet.
      const summarySheet = workbook.addWorksheet("Summary");

      summarySheet.columns = [
        { header: "Term", key: "term", width: 10 },
        { header: "Year", key: "year", width: 10 },
        { header: "Week", key: "week", width: 10 },
        { header: "Total", key: "total", width: 10 },
        { header: "Coming", key: "coming", width: 12 },
        { header: "Maybe", key: "maybe", width: 12 },
        { header: "Not Coming", key: "notComing", width: 15 },
        { header: "TBC", key: "tbc", width: 10 },
        { header: "Called", key: "called", width: 10 },
        { header: "No Call", key: "noCall", width: 10 },
        { header: "NPU", key: "npu", width: 10 },
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
        total: summaryData.reduce((sum, row) => sum + row.total, 0),
        coming: summaryData.reduce((sum, row) => sum + row.coming, 0),
        maybe: summaryData.reduce((sum, row) => sum + row.maybe, 0),
        notComing: summaryData.reduce((sum, row) => sum + row.notComing, 0),
        tbc: summaryData.reduce((sum, row) => sum + row.tbc, 0),
        called: summaryData.reduce((sum, row) => sum + row.called, 0),
        noCall: summaryData.reduce((sum, row) => sum + row.noCall, 0),
        npu: summaryData.reduce((sum, row) => sum + row.npu, 0),
      });

      totalRow.font = { bold: true };
      summarySheet.views = [{ state: "frozen", ySplit: 1 }];

      // Individual week sheets.
      Object.entries(groupedByWeek).forEach(([week, records]) => {
        const sheet = workbook.addWorksheet(`Week ${week}`);

        sheet.columns = [
          { header: "Name", key: "name", width: 25 },
          { header: "Status", key: "status", width: 15 },
          { header: "Call", key: "callStatus", width: 14 },
          { header: "Reason", key: "reason", width: 30 },
          { header: "Week", key: "week", width: 10 },
          { header: "Term", key: "term", width: 10 },
          { header: "Year", key: "year", width: 12 },
        ];

        records.forEach((record) => {
          sheet.addRow({
            name: record.name,
            status: record.status,
            callStatus: record.call_status || "no_call",
            reason: record.reason || "",
            week: record.week,
            term: record.term,
            year: record.year,
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

      // Generate and download the Excel file.
      const buffer = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([buffer]),
        `Attendance-Term-${attendance[0]?.term}-${attendance[0]?.year}.xlsx`,
      );
    } catch (err) {
      console.error("Failed to export attendance:", err);
      alert("Failed to export attendance. Please try again.");
    }
  };

  return (
    <div className="flex-shrink-0">
      <button
        onClick={handleExport}
        className="flex items-center justify-center px-4 py-2 min-h-[44px] rounded-xl bg-blue-500/10 text-blue-300 border border-blue-400/30 hover:bg-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95 text-sm font-bold transition-all shadow-sm"
      >
        {label || "Export Attendance"}
      </button>
    </div>
  );
}
