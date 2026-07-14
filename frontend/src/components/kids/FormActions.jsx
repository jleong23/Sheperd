import { motion } from "framer-motion";

export default function FormActions({
  onCancel,
  onSubmit,
  loading = false,
  submitText = "Save",
  cancelText = "Cancel",
  submitColor = "indigo",
}) {
  const colorStyles = {
    indigo: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20",
    emerald: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20",
    red: "bg-red-600 hover:bg-red-500 shadow-red-500/20",
  };

  const shadowColors = {
    indigo: "rgba(99,102,241,0.35)",
    emerald: "rgba(16,185,129,0.35)",
    red: "rgba(239,68,68,0.35)",
  };

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
          boxShadow: `0px 0px 24px ${shadowColors[submitColor] || shadowColors.indigo}`,
        }}
        whileTap={{ scale: 0.97 }}
        className={`rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${
          colorStyles[submitColor] || colorStyles.indigo
        }`}
      >
        {loading ? "Saving..." : submitText}
      </motion.button>
    </div>
  );
}
