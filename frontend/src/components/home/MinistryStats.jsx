import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RadialProgress from "./RadialProgress";
import { fetchMinistryStats } from "../../api/leaders";

export default function MinistryStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMinistryStats()
      .then(setStats)
      .catch((err) => console.error("Failed to fetch ministry stats:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 px-5 py-7 sm:px-7 md:px-8 shadow-xl backdrop-blur-md animate-pulse">
        <div className="h-8 w-48 bg-white/10 rounded mx-auto mb-6" />
        <div className="h-40 bg-white/10 rounded" />
      </section>
    );
  }

  if (!stats) return null;

  const baptisedRate =
    stats.total_kids > 0
      ? Math.round((stats.baptised_kids / stats.total_kids) * 1000) / 10
      : null;

  const { status_breakdown, year_level_breakdown, attendance } = stats;

  const yearLevels = Object.keys(year_level_breakdown).sort((a, b) => {
    if (a === "Unassigned") return 1;
    if (b === "Unassigned") return -1;
    return Number(a) - Number(b);
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-white/10 bg-white/5 px-5 py-7 sm:px-7 md:px-8 shadow-xl backdrop-blur-md"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 text-white">
        Ministry Stats
      </h2>
      <p className="text-center text-slate-400 mb-7 text-sm">
        Pastor-only overview across the whole ministry
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-slate-400 text-sm">Total Kids</p>
          <p className="text-white text-3xl font-bold">{stats.total_kids}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-slate-400 text-sm">Total Leaders</p>
          <p className="text-white text-3xl font-bold">{stats.total_leaders}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 justify-items-center mb-8">
        <RadialProgress
          percentage={baptisedRate}
          value={`${stats.baptised_kids} / ${stats.total_kids} kids`}
          label="Kids Baptised"
          color="#38bdf8"
        />
        <RadialProgress
          percentage={attendance.rate}
          value={
            attendance.term
              ? `${attendance.coming} / ${attendance.total} · Term ${attendance.term.term}, ${attendance.term.year}`
              : "No active term"
          }
          label="Attendance Rate"
          color="#a78bfa"
        />
      </div>

      <div className="mb-8">
        <h3 className="text-white font-semibold mb-3 text-center">
          Status Breakdown
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {["CORE", "FRINGE", "NP"].map((key) => (
            <div
              key={key}
              className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center"
            >
              <p className="text-slate-400 text-xs">{key}</p>
              <p className="text-white text-xl font-bold">
                {status_breakdown[key] ?? 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3 text-center">
          Kids by Year Level
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {yearLevels.map((yl) => (
            <div
              key={yl}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center"
            >
              <p className="text-slate-400 text-xs">
                {yl === "Unassigned" ? "Unassigned" : `Year ${yl}`}
              </p>
              <p className="text-white text-lg font-bold">
                {year_level_breakdown[yl]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
