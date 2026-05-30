import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    icon: "👥",
    title: "Kids Management",
    description:
      "View profiles, organise details, and keep important information in one place.",
    glow: "rgba(59,130,246,0.3)",
    iconStyle: "bg-blue-500/20 text-blue-300",
  },
  {
    id: 2,
    icon: "✅",
    title: "Attendance Tracking",
    description:
      "Record attendance clearly and help leaders stay aligned each week.",
    glow: "rgba(168,85,247,0.3)",
    iconStyle: "bg-purple-500/20 text-purple-300",
  },
  {
    id: 3,
    icon: "📅",
    title: "Events & Catchups",
    description:
      "Plan events, follow up with new people, and support your youth team.",
    glow: "rgba(236,72,153,0.3)",
    iconStyle: "bg-pink-500/20 text-pink-300",
  },
];

export default function FeatureCards() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className="grid gap-6 pb-16 md:grid-cols-3"
    >
      {features.map((feature) => (
        <motion.div
          key={feature.id}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{
            y: -8,
            scale: 1.02,
            boxShadow: `0px 0px 35px ${feature.glow}`,
            borderColor: "rgba(99,102,241,0.7)",
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/70 p-8 backdrop-blur-sm"
        >
          <div
            className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${feature.iconStyle}`}
          >
            {feature.icon}
          </div>

          <h3 className="text-lg font-bold text-white">{feature.title}</h3>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </motion.section>
  );
}
