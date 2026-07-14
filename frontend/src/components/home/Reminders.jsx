import { IoCheckboxOutline } from "react-icons/io5";
import { motion } from "framer-motion";

export default function Reminders() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="
    rounded-3xl
    border border-white/10
    bg-white/5
    backdrop-blur-md
    px-5 py-7
    shadow-xl
  "
    >
      <h2 className="text-center text-3xl font-bold text-white mb-6">
        Reminders
      </h2>

      {[
        "Send in attendance by 9pm Friday",
        "Lock In and Hungry",
        "Update Pastoral Care Logs",
      ].map((title) => (
        <motion.div
          key={title}
          whileHover={{
            x: 5,
          }}
          className="
        flex items-center
        gap-3
        p-3
        rounded-xl
        mb-3
        bg-white/5
        border border-white/10
        hover:border-pink-400/50
        hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]
        transition
      "
        >
          <span className="text-pink-400">✓</span>
          <span className="text-slate-200">{title}</span>
        </motion.div>
      ))}
    </motion.section>
  );
}
