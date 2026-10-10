import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SplashHeader from "./SplashHeader.jsx";
import SplashHero from "./SplashHero.jsx";
import FeatureCards from "./FeatureCard.jsx";

// Slowly drifting background glow
function Glow({ className, x, y, duration }) {
  return (
    <motion.div
      aria-hidden
      animate={{ x, y }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
      className={`pointer-events-none absolute h-[28rem] w-[28rem] rounded-full blur-[120px] ${className}`}
    />
  );
}

function FinalCta() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mb-20 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-slate-900/60 to-purple-500/15 px-6 py-14 text-center backdrop-blur-md sm:px-12"
    >
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Ready to lead with clarity?
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-slate-400">
        Bring your kids, attendance, events and follow-ups together in one place
        your whole leader team can rely on.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to="/signup"
          className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-slate-900 transition hover:bg-slate-200 sm:w-auto"
        >
          Create your account
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          to="/login"
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
        >
          I already have an account
        </Link>
      </div>
    </motion.section>
  );
}

export default function SplashScreen() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        {/* Ambient background */}
        <Glow
          className="-left-32 top-0 bg-indigo-600/25"
          x={[0, 60]}
          y={[0, 40]}
          duration={14}
        />
        <Glow
          className="-right-32 top-1/3 bg-purple-600/20"
          x={[0, -60]}
          y={[0, 50]}
          duration={18}
        />

        <div className="relative">
          <SplashHeader />

          <main className="mx-auto max-w-6xl px-4 sm:px-6">
            <SplashHero />
            <FeatureCards />
            <FinalCta />
          </main>

          <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Sheperd · Youth ministry management
          </footer>
        </div>
      </div>
    </MotionConfig>
  );
}
