import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-2xl mx-auto overflow-hidden">
      <div className="bg-gray-50/50 px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Configuration</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Add new academic years or terms to the system.
        </p>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* Year input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Year
            </label>
            <input
              type="number"
              placeholder="e.g. 2024"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border border-gray-300 min-h-[44px] px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
            />
          </div>

          {/* Term input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Term
            </label>
            <input
              type="number"
              placeholder="e.g. 1"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              className="w-full border border-gray-300 min-h-[44px] px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
            />
          </div>

          {/* Weeks input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Weeks Duration
            </label>
            <input
              type="number"
              placeholder="e.g. 10"
              value={weeks}
              onChange={(e) => setWeeks(e.target.value)}
              className="w-full border border-gray-300 min-h-[44px] px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleAddYear}
              className="bg-slate-900 hover:bg-black active:bg-slate-800 text-white min-h-[44px] px-4 rounded-xl font-bold text-xs uppercase tracking-wide transition-all shadow-sm flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Add Year {latestYear + 1}
            </button>
            <button
              onClick={handleAddTerm}
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white min-h-[44px] px-4 rounded-xl font-bold text-xs uppercase tracking-wide transition-all shadow-sm flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Add Term
            </button>
          </div>

          <button
            onClick={handleDeleteTerm}
            className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 active:bg-red-100 min-h-[44px] px-4 rounded-xl font-bold text-xs uppercase tracking-wide transition-all flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
            Delete Term
          </button>
        </div>
      </div>
    </div>
  );
}
