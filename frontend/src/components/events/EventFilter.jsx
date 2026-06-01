import { motion } from "framer-motion";

export default function EventFilter({
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
  onSearch,
  onClear,
}) {
  const handleChange = (e) => {
    onFilterChange({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.35, ease: "easeOut" }}
      className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white">Filter Events</h2>
        <p className="mt-1 text-sm text-slate-400">
          Search by event name, date range, or sort order.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Event Name
          </label>

          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Search events..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Start Date
          </label>

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            End Date
          </label>

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Sort By
          </label>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="eventstartdate">Start Date</option>
            <option value="eventenddate">End Date</option>
            <option value="eventname">Event Name</option>
            <option value="updated_at">Last Updated</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <motion.button
          type="button"
          onClick={onClear}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white"
        >
          Clear
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
          Search Events
        </motion.button>
      </div>
    </motion.section>
  );
}
