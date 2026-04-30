// components/newPeople/KidCard.jsx
import { FaTrash } from "react-icons/fa";

export default function KidCard({
  kid,
  onToggleCall,
  onFeedbackChange,
  onSave,
  onDelete,
}) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold">{kid.name}</h2>
          <p className="text-gray-600">Phone: {kid.phone || "N/A"}</p>
          <p className="text-gray-600">
            Parent: {kid.parentname} ({kid.parent_phone || "N/A"})
          </p>
          <p className="text-gray-600">School: {kid.school}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
            {kid.status_code}
          </div>

          <button
            onClick={() => onDelete(kid.id)}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </div>

      {/* Calls */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* First Call */}
        <div className="bg-gray-50 p-3 rounded border">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">First Call</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!kid.first_call}
                onChange={() => onToggleCall(kid, "first_call")}
              />
              <span
                className={kid.first_call ? "text-green-600" : "text-gray-500"}
              >
                {kid.first_call ? "Done" : "Not Done"}
              </span>
            </label>
          </div>

          <textarea
            className="w-full p-2 border rounded text-sm"
            rows="3"
            value={kid.first_call_feedback || ""}
            onChange={(e) =>
              onFeedbackChange(kid.id, "first_call_feedback", e.target.value)
            }
          />
        </div>

        {/* Second Call */}
        <div className="bg-gray-50 p-3 rounded border">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">Second Call</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!kid.second_call}
                onChange={() => onToggleCall(kid, "second_call")}
              />
              <span
                className={kid.second_call ? "text-green-600" : "text-gray-500"}
              >
                {kid.second_call ? "Done" : "Not Done"}
              </span>
            </label>
          </div>

          <textarea
            className="w-full p-2 border rounded text-sm"
            rows="3"
            value={kid.second_call_feedback || ""}
            onChange={(e) =>
              onFeedbackChange(kid.id, "second_call_feedback", e.target.value)
            }
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onSave(kid)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Feedback
        </button>
      </div>
    </div>
  );
}
