import { CatchupCard } from "./CatchupCard";
import { motion } from "framer-motion";

export default function CatchupResults({ catchups, onSelect, onDelete }) {
  if (catchups.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center">
        <p className="text-lg font-semibold text-white">No catchups found</p>

        <p className="mt-2 text-sm text-slate-400">
          Try changing your filters or create a new catchup.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      {catchups.map((catchup) => (
        <motion.div
          key={catchup.catchupid}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <CatchupCard
            catchup={catchup}
            onClick={() => onSelect(catchup)}
            onDeleted={() => onDelete(catchup.catchupid)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
