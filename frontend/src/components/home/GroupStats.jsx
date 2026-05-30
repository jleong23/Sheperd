import StatCardSkeleton from "./StatCardSkeleton.jsx";
import { motion } from "framer-motion";

export default function GroupStats({ yearLevel, stats, loading }) {
  const cards = [
    { label: "Year Level", value: yearLevel ?? "Unavailable", icon: "🏫" },
    {
      label: "Number of kids in this group",
      value: stats?.total_kids ?? "Unavailable",
      icon: "🤦🏼‍♂️",
    },
    {
      label: "Kids Baptised",
      value: stats?.baptised_kids ?? "Unavailable",
      icon: "💧",
    },
    {
      label: "Comes Sunday Service",
      value: stats?.regular_kids ?? "Unavailable",
      icon: "⛪️",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-white/10 bg-white/5 px-5 py-7 sm:px-7 md:px-8 shadow-xl backdrop-blur-md"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-5 md:mb-7 text-white">
        Group Stats
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <StatCardSkeleton key={index} />
            ))
          : cards.map((card) => (
              <motion.div
                key={card.label}
                whileHover={{
                  scale: 1.03,
                  y: -4,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="
          bg-white/5
          border border-white/10
          backdrop-blur-md
          rounded-2xl
          p-4
          flex items-center
          hover:border-blue-400/50
          hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]
          transition
        "
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  {card.icon}
                </div>

                <div className="ml-4">
                  <p className="text-slate-400">{card.label}</p>

                  <p className="text-white text-xl font-bold">{card.value}</p>
                </div>
              </motion.div>
            ))}
      </div>
    </motion.section>
  );
}
