import * as XLSX from "xlsx";

export default function ImportAttendance({ onImport, week, term, year }) {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    let allRows = [];

    // Iterate through all sheets and find those that contain "week" (e.g. "Week 1", "Week 2")
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
    const missing = requiredHeaders.filter((h) => !headers.includes(h));

    if (missing.length) {
      alert(
        `Invalid file. Missing required columns: ${missing.join(", ")}.\n\nPlease export using the system template.`,
      );
      return;
    }

    try {
      const cleaned = allRows.map((r, i) => {
        const rowWeek = Number(r.Week);
        const rowTerm = Number(r.Term);
        const rowYear = Number(r.Year);

        if (!rowWeek || !rowTerm || !rowYear) {
          throw new Error(`Invalid Week/Term/Year at row ${i + 2}`);
        }

        return {
          name: r.Name?.trim(),
          status: r.Status?.toLowerCase().trim().replace(/\s+/g, " "),
          reason: r.Reason || "",
          week: rowWeek,
          term: rowTerm,
          year: rowYear,
        };
      });

      onImport(cleaned);
    } catch (err) {
      alert(err.message);
    }
  };

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
