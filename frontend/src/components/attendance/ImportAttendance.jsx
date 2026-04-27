import * as XLSX from "xlsx";

export default function ImportAttendance({ onImport, week, term, year }) {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const requiredHeaders = ["Name", "Status", "Reason"];
    const headers = Object.keys(rows[0] || {});
    const missing = requiredHeaders.filter((h) => !headers.includes(h));

    if (missing.length) {
      alert(`Missing columns: ${missing.join(", ")}`);
      return;
    }

    onImport(
      rows.map((r) => ({
        name: r.Name?.trim(),
        status: r.Status?.toLowerCase().trim().replace(/\s+/g, " "),
        reason: r.Reason || "",
      })),
    );
  };

  return <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />;
}
