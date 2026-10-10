import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HeroPreview from "./HeroPreview.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

export default function SplashHero() {
  return (
    <section className="grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-2 lg:gap-10">
      {/* Copy */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="text-center lg:text-left"
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 sm:text-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
          </span>
          Youth Ministry Management Platform
        </motion.div>

        <motion.h1
          variants={fadeUp}
          custom={1}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Manage your{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            youth ministry
          </span>{" "}
          with confidence.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg lg:mx-0"
        >
          Keep track of kids, attendance, events, catchups and new people in one
          simple dashboard built for leaders.
        </motion.p>
      </motion.div>

      {/* Live product preview */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      >
        <HeroPreview />
      </motion.div>
    </section>
  );
}
