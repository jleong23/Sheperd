import { motion } from "framer-motion";

const STATUSES = [
  { value: "ALL", label: "All" },
  { value: "CORE", label: "Core" },
  { value: "FRINGE", label: "Fringe" },
  { value: "NP", label: "New People" },
];

export default function KidStatusFilter({ value, onChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-white">Filter Kids</h2>
        <p className="text-sm text-slate-400">
          View kids by their ministry status.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {STATUSES.map((status) => {
          const isActive = value === status.value;

          return (
            <motion.button
              key={status.value}
              onClick={() => onChange(status.value)}
              whileHover={{
                y: -2,
                scale: 1.03,
                boxShadow: "0px 0px 20px rgba(99,102,241,0.25)",
              }}
              whileTap={{ scale: 0.96 }}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "border-slate-700 bg-slate-950/70 text-slate-300 hover:border-indigo-500/60 hover:text-white"
              }`}
            >
              {status.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
