import { motion } from "framer-motion";

export function CatchupActions({
  isEdit,
  isDirty,
  onCancel,
  onSave,
  onDelete,
}) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      {isEdit && (
        <motion.button
          type="button"
          onClick={onDelete}
          whileHover={{
            y: -2,
            scale: 1.02,
            boxShadow: "0px 0px 20px rgba(239,68,68,0.3)",
          }}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
        >
          Delete
        </motion.button>
      )}

      <motion.button
        type="button"
        onClick={onCancel}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white"
      >
        Cancel
      </motion.button>

      <motion.button
        type="button"
        onClick={onSave}
        disabled={!isDirty}
        whileHover={
          isDirty
            ? {
                y: -2,
                scale: 1.02,
                boxShadow: "0px 0px 24px rgba(99,102,241,0.35)",
              }
            : {}
        }
        whileTap={isDirty ? { scale: 0.97 } : {}}
        className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
      >
        Save
      </motion.button>
    </div>
  );
}
