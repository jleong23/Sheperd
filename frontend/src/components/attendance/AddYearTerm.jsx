/**
 * AddYearTerm Component
 * ---------------------------------------
 * Admin utility for managing attendance structure:
 * - Create new academic year
 * - Create new term under a year
 * - Delete term (removes all related attendance records)
 */

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { addYear, addTerm, deleteTerm } from "../../api/attendance";
import { motion } from "framer-motion";

export default function AddYearTerm({ onUpdate, availableYears = [] }) {
  const latestYear =
    // If backend returns years, use the latest one, else fallback to current system year
    availableYears.length > 0
      ? Math.max(...availableYears)
      : new Date().getFullYear();

  // Selected year for term operations
  const [year, setYear] = useState(latestYear);
  // Term number input (1,2,3)
  const [newTerm, setNewTerm] = useState("");
  // Number of weeks in a term (default = 10)
  const [weeks, setWeeks] = useState(10);
  // Disables buttons while API calls are running
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
      // POST /attendance/term - creates attendance rows for all kids for this term
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
      // DELETE /attendance/term/:year/:term
      // removes ALL attendance rows matching filters
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white/5 rounded-3xl shadow-xl border border-white/10 w-full max-w-2xl mx-auto overflow-hidden backdrop-blur-md"
    >
      <div className="bg-white/5 px-5 py-4 border-b border-white/10">
        <h2 className="text-lg font-bold text-white">Configuration</h2>
        <p className="text-xs text-slate-300 mt-0.5">
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
              className="w-full border border-white/10 bg-white/10 text-white min-h-[44px] px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-sm font-medium placeholder:text-slate-500"
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
              className="w-full border border-white/10 bg-white/10 text-white min-h-[44px] px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-sm font-medium placeholder:text-slate-500"
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
              className="w-full border border-white/10 bg-white/10 text-white min-h-[44px] px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-sm font-medium placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleAddYear}
              className="bg-blue-500/10 text-white min-h-[44px] px-4 rounded-xl font-bold text-xs uppercase tracking-wide transition-all shadow-sm flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Add Year {latestYear + 1}
            </button>
            <button
              onClick={handleAddTerm}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white min-h-[44px] px-4 rounded-xl font-bold text-xs uppercase tracking-wide transition-all shadow-sm flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100 hover:shadow-[0_0_25px_rgba(99,102,241,0.45)]"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              Add Term
            </button>
          </div>

          <button
            onClick={handleDeleteTerm}
            className="w-full bg-red-500/10 border border-red-400/30 text-red-300 hover:bg-red-500/20 min-h-[44px] px-4 rounded-xl font-bold text-xs uppercase tracking-wide transition-all flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100 hover:shadow-[0_0_25px_rgba(239,68,68,0.35)]"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
            Delete Term
          </button>
        </div>
      </div>
    </motion.div>
  );
}
