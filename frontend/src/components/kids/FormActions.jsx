import { motion } from "framer-motion";

export default function FormActions({
  onCancel,
  onSubmit,
  loading = false,
  submitText = "Save",
  cancelText = "Cancel",
}) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <motion.button
        type="button"
        onClick={onCancel}
        disabled={loading}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cancelText}
      </motion.button>

      <motion.button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        whileHover={{
          y: -2,
          scale: 1.02,
          boxShadow: "0px 0px 24px rgba(99,102,241,0.35)",
        }}
        whileTap={{ scale: 0.97 }}
        className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving..." : submitText}
      </motion.button>
    </div>
  );
}
