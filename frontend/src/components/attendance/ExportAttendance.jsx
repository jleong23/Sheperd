/**
 * attendance/ExportAttendance.jsx
 */
import { CSVLink } from "react-csv";

export default function ExportAttendance() {
  return (
    <>
      <div className="ml-auto">
        <CSVLink className="flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-200 text-sm font-medium">
          <button>Export Attendance</button>
        </CSVLink>
        12:06
      </div>
    </>
  );
}
