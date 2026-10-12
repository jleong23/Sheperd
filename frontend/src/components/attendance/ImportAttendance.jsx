export default function ImportAttendance({ onImport, week }) {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Load Excel parsing library only when a file is selected.
      const XLSX = await import("xlsx");

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      let allRows = [];

      // Find and combine all sheets with "week" in their name.
      workbook.SheetNames.forEach((sheetName) => {
        if (sheetName.toLowerCase().includes("week")) {
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet);
          allRows = [...allRows, ...rows];
        }
      });

      if (allRows.length === 0) {
        alert("No valid 'Week' sheets found in the file.");
        return;
      }

      const requiredHeaders = [
        "Name",
        "Status",
        "Reason",
        "Week",
        "Term",
        "Year",
      ];

      const headers = Object.keys(allRows[0] || {});
      const missing = requiredHeaders.filter(
        (header) => !headers.includes(header),
      );

      if (missing.length) {
        alert(
          `Invalid file. Missing required columns: ${missing.join(", ")}.\n\nPlease export using the system template.`,
        );
        return;
      }

      const cleaned = allRows.map((row, index) => {
        const rowWeek = Number(row.Week);
        const rowTerm = Number(row.Term);
        const rowYear = Number(row.Year);

        if (!rowWeek || !rowTerm || !rowYear) {
          throw new Error(`Invalid Week/Term/Year at row ${index + 2}`);
        }

        return {
          name: row.Name?.trim(),
          status: row.Status?.toLowerCase().trim().replace(/\s+/g, " "),
          callStatus: normalizeCallStatus(row.Call),
          reason: row.Reason || "",
          week: rowWeek,
          term: rowTerm,
          year: rowYear,
        };
      });

      onImport(cleaned);
    } catch (err) {
      alert(err.message || "Failed to import the Excel file.");
    }
  };

  function normalizeCallStatus(value) {
    const normalized = value
      ?.toLowerCase()
      .trim()
      .replace(/[\s-]+/g, "_");

    return ["called", "no_call", "npu"].includes(normalized)
      ? normalized
      : "no_call";
  }

  return (
    <input
      type="file"
      accept=".xlsx,.xls"
      onChange={handleFileUpload}
      className="hidden"
      id={`import-attendance-${week || "term"}`}
    />
  );
}
