import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function SplashHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      className="flex min-h-[65vh] flex-col items-center justify-center text-center"
    >
      <section className="flex min-h-[65vh] flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300"
        >
          ✨ Youth Ministry Management Platform
        </motion.div>

        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl">
          Manage Your{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Youth Ministry
          </span>{" "}
          With Confidence.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Keep track of kids, attendance, events, catchups, and new people in
          one simple dashboard built for leaders.
        </p>

        <div className="mt-10 flex w-full max-w-xs flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center">
          <Link
            to="/signup"
            className="block w-full rounded-full bg-white px-8 py-4 text-center text-sm font-bold text-slate-900 hover:bg-slate-200 sm:w-auto"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="block w-full rounded-full bg-slate-800 px-8 py-4 text-center text-sm font-bold text-white hover:bg-slate-700 sm:w-auto"
          >
            Login
          </Link>
        </div>
      </section>
    </motion.section>
  );
}
