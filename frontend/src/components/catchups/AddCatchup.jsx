import { motion } from "framer-motion";

export default function AddCatchup({ onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{
        y: -3,
        scale: 1.03,
        boxShadow: "0px 0px 28px rgba(99,102,241,0.35)",
      }}
      whileTap={{ scale: 0.97 }}
      className="w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 sm:w-fit"
    >
      + Add Catchup
    </motion.button>
  );
}
