import { BsCardChecklist } from "react-icons/bs";
import { motion } from "framer-motion";
/**
 *
 * Welcome Component + buttons to Attendance / New People Page
 */
export default function Welcome() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-5 py-8 sm:px-8 md:px-10 text-center shadow-xl backdrop-blur-md"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />

      <div className="relative">
        <p className="mx-auto mb-4 w-fit rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-xs sm:text-sm text-blue-300">
          ✨ Dreamers Youth Dashboard
        </p>

        <h1 className="text-3xl text-white sm:text-4xl md:text-5xl font-extrabold leading-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Dreamers Youth
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed text-slate-300">
          “Do nothing out of selfish ambition or vain conceit. Rather, in
          humility value others above yourselves, not looking to your own
          interests but each of you to the interests of the others.”
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          {[
            ["Attendance", "/attendance"],
            ["New People", "/new-people"],
          ].map(([label, href]) => (
            <motion.a
              key={label}
              href={href}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:shadow-[0_0_25px_rgba(96,165,250,0.45)]"
            >
              <BsCardChecklist />
              {label}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
