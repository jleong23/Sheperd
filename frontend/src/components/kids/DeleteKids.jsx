import { motion } from "framer-motion";

export default function DeleteKids({
  bulkMode,
  selected,
  enterBulkMode,
  cancelSelection,
  handleDelete,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {!bulkMode ? (
        <motion.button
          onClick={enterBulkMode}
          whileHover={{
            y: -3,
            scale: 1.03,
            boxShadow: "0px 0px 24px rgba(239,68,68,0.25)",
          }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border border-red-500/40 bg-red-500/10 px-6 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
        >
          Delete Kids
        </motion.button>
      ) : (
        <>
          <motion.button
            onClick={handleDelete}
            disabled={selected.length === 0}
            whileHover={
              selected.length > 0
                ? {
                    y: -3,
                    scale: 1.03,
                    boxShadow: "0px 0px 24px rgba(239,68,68,0.35)",
                  }
                : {}
            }
            whileTap={selected.length > 0 ? { scale: 0.97 } : {}}
            className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none"
          >
            Delete Selected ({selected.length})
          </motion.button>

          <motion.button
            onClick={cancelSelection}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white"
          >
            Cancel
          </motion.button>
        </>
      )}
    </div>
  );
}
