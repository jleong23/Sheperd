import { motion } from "framer-motion";

export default function DeleteEvent({ eventId, onDeleted }) {
  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) return;

    onDeleted(eventId);
  };

  return (
    <motion.button
      type="button"
      onClick={handleDelete}
      whileHover={{
        y: -2,
        scale: 1.03,
        boxShadow: "0px 0px 20px rgba(239,68,68,0.3)",
      }}
      whileTap={{ scale: 0.97 }}
      className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
    >
      Delete
    </motion.button>
  );
}
