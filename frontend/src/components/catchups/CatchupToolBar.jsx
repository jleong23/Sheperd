import { motion } from "framer-motion";

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30";

const secondaryButtonClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-indigo-500/60 hover:bg-slate-900 hover:text-white";

export default function CatchupToolbar({
  searchTerm,
  onSearchChange,
  month,
  year,
  onMonthChange,
  onYearChange,
  onSearch,
  onClear,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  const handleThisMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    onMonthChange(currentMonth);
    onYearChange(currentYear);
  };

  const handleThisYear = () => {
    const now = new Date();

    onMonthChange("");
    onYearChange(now.getFullYear());
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.35 }}
      className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white">Filter Catchups</h2>
        <p className="mt-1 text-sm text-slate-400">
          Search catchups by purpose, comments, month, or year.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="space-y-2 lg:col-span-2">
          <label className="block text-sm font-medium text-slate-300">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by purpose or comments..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Month
          </label>
          <select
            value={month}
            onChange={(e) =>
              onMonthChange(e.target.value ? Number(e.target.value) : "")
            }
            onKeyDown={handleKeyDown}
            className={inputClass}
          >
            <option value="">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Year
          </label>
          <input
            type="number"
            placeholder="2026"
            value={year}
            onChange={(e) =>
              onYearChange(e.target.value ? Number(e.target.value) : "")
            }
            onKeyDown={handleKeyDown}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          <motion.button
            type="button"
            onClick={handleThisMonth}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={secondaryButtonClass}
          >
            This Month
          </motion.button>

          <motion.button
            type="button"
            onClick={handleThisYear}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={secondaryButtonClass}
          >
            This Year
          </motion.button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-2 lg:justify-end">
          <motion.button
            type="button"
            onClick={onClear}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white"
          >
            Clear Filters
          </motion.button>

          <motion.button
            type="button"
            onClick={onSearch}
            whileHover={{
              y: -2,
              scale: 1.02,
              boxShadow: "0px 0px 24px rgba(99,102,241,0.35)",
            }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500"
          >
            Search
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
