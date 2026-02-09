import { useState } from "react";
import { addYear, addTerm, deleteTerm } from "../../api/attendance";

export default function AddYearTerm({ onUpdate, availableYears = [] }) {
  const latestYear =
    availableYears.length > 0
      ? Math.max(...availableYears)
      : new Date().getFullYear();

  const [year, setYear] = useState(latestYear);
  const [newTerm, setNewTerm] = useState("");
  const [weeks, setWeeks] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleAddYear = async () => {
    const nextYear = latestYear + 1;
    if (
      !window.confirm(
        `Are you sure you want to add year ${nextYear}? This will create default attendance for all current kids.`,
      )
    )
      return;

    setLoading(true);
    try {
      const response = await addYear(nextYear);
      alert(`Year ${nextYear} added successfully!`);
      onUpdate(response.createdRecords); // Pass new records up for a fast update
    } catch (err) {
      console.error("Failed to add year:", err);
      alert(err.response?.data?.error || "Failed to add year.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTerm = async () => {
    if (!newTerm || isNaN(Number(newTerm)))
      return alert("Please enter a valid term number.");
    if (
      !window.confirm(
        `Are you sure you want to add term ${newTerm} to year ${year}?`,
      )
    )
      return;

    setLoading(true);
    try {
      await addTerm(year, Number(newTerm), Number(weeks));
      alert(`Term ${newTerm} for year ${year} added successfully!`);
      onUpdate(); // A full refresh is easier here
    } catch (err) {
      console.error("Failed to add term:", err);
      alert(err.response?.data?.error || "Failed to add term.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTerm = async () => {
    if (!year || !newTerm) {
      alert("Please enter both year and term to delete");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ALL records for Year ${year}, Term ${newTerm}? This cannot be undone.`,
      )
    )
      return;

    setLoading(true);
    try {
      const response = await deleteTerm(year, newTerm);
      alert(response.message || "Term deleted successfully!");
      onUpdate();
    } catch (err) {
      console.error("Failed to delete term:", err);
      alert(err.response?.data?.error || "Failed to delete term.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-2xl mx-auto overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Configuration</h2>
        <p className="text-sm text-gray-500">
          Add new academic years or terms to the system.
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Year input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              placeholder="Select or enter year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Term input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Term</label>
            <input
              type="number"
              placeholder="Term to add/delete"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Weeks input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Weeks Duration
            </label>
            <input
              type="number"
              placeholder="e.g. 10"
              value={weeks}
              onChange={(e) => setWeeks(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleAddYear}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex justify-center items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Year {latestYear + 1}
          </button>
          <button
            onClick={handleAddTerm}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex justify-center items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Term
          </button>

          <button
            onClick={handleDeleteTerm}
            className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg font-medium transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Term
          </button>
        </div>
      </div>
    </div>
  );
}
