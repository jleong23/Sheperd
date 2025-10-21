import { useState, useEffect } from "react";

export default function AttendanceReasonModal({
  open,
  onClose,
  record,
  onSubmit,
}) {
  const [reason, setReason] = useState(record?.reason || "");

  useEffect(() => {
    setReason(record?.reason || "");
  }, [record]);

  if (!open || !record) return null;

  return (
    // Full-screen overlay
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {/* Modal box */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h2 className="text-lg font-semibold mb-3 text-center">
          Reason for <span className="text-blue-600">{record.name}</span>
        </h2>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason..."
          rows={5}
          className="border w-full rounded-md p-3 text-sm mb-4 focus:ring-2 focus:ring-blue-400 resize-none"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(record, reason)}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
