import { motion } from "framer-motion";
import KidCard from "./KidCard";
import KidsCardSkeleton from "./KidsCardSkeleton.jsx";

export default function KidListGrid({
  kids,
  selected = [],
  toggleSelect,
  bulkMode = false,
  loading = false,
  onDelete,
  onEdit,
  onTransfer,
  actions,
  linkToProfile,
  onCardClick,
}) {
  if (!loading && kids.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center text-slate-400"
      >
        <p className="text-lg font-semibold text-white">No kids found</p>
        <p className="mt-2 text-sm">
          Try changing the filter or add a new kid profile.
        </p>
      </motion.div>
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
      className="mx-auto mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {loading
        ? Array.from({ length: 8 }).map((_, i) => <KidsCardSkeleton key={i} />)
        : kids.map((kid) => (
            <motion.div
              key={kid.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <KidCard
                kid={kid}
                onDelete={onDelete}
                onEdit={onEdit}
                onTransfer={onTransfer}
                showCheckbox={bulkMode}
                isSelected={selected.includes(kid.id)}
                onSelect={toggleSelect}
                actions={actions}
                linkToProfile={linkToProfile}
                onCardClick={onCardClick}
              />
            </motion.div>
          ))}
    </motion.div>
  );
}
