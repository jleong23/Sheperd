import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";

const STATUS = {
  present: {
    label: "Present",
    cls: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/25",
  },
  absent: {
    label: "Absent",
    cls: "bg-rose-500/15 text-rose-300 ring-rose-400/25",
  },
  maybe: {
    label: "Maybe",
    cls: "bg-amber-500/15 text-amber-300 ring-amber-400/25",
  },
};
const ORDER = ["present", "absent", "maybe"];

const KIDS = [
  {
    name: "Ava Mitchell",
    status: "present",
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "Noah Turner",
    status: "maybe",
    color: "from-purple-400 to-fuchsia-500",
  },
  {
    name: "Mia Kowalski",
    status: "present",
    color: "from-pink-400 to-rose-500",
  },
  {
    name: "Liam Reid",
    status: "absent",
    color: "from-emerald-400 to-teal-500",
  },
  {
    name: "Zoe Parker",
    status: "present",
    color: "from-amber-400 to-orange-500",
  },
];

const NOTIFICATIONS = [
  "Week 4 attendance submitted",
  "Catchup logged with Noah",
  "New kid added to your group",
  "Youth Night starts Friday",
];

function StatusPill({ status }) {
  const { label, cls } = STATUS[status];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.18 }}
        className={`inline-flex w-[72px] justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${cls}`}
      >
        {label}
      </motion.span>
    </AnimatePresence>
  );
}

export default function HeroPreview() {
  const [kids, setKids] = useState(KIDS);
  const [notice, setNotice] = useState(0);

  // Cycle one row's status at a time
  useEffect(() => {
    let tick = 0;
    const id = setInterval(() => {
      const row = tick++ % KIDS.length;
      setKids((prev) =>
        prev.map((kid, i) =>
          i === row
            ? {
                ...kid,
                status: ORDER[(ORDER.indexOf(kid.status) + 1) % ORDER.length],
              }
            : kid,
        ),
      );
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Cycle notification toasts
  useEffect(() => {
    const id = setInterval(
      () => setNotice((n) => (n + 1) % NOTIFICATIONS.length),
      3500,
    );
    return () => clearInterval(id);
  }, []);

  const presentCount = useMemo(
    () => kids.filter((k) => k.status === "present").length,
    [kids],
  );

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Glow behind card */}
      <div
        aria-hidden
        className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-500/25 via-purple-500/15 to-pink-500/20 blur-2xl"
      />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl"
      >
        {/* Window chrome */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            Attendance · Term 3
          </span>
        </div>

        {/* Summary */}
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">Week 4</p>
            <p className="flex items-baseline gap-1 text-2xl font-bold text-white">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={presentCount}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                >
                  {presentCount}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm font-medium text-slate-500">
                / {kids.length} present
              </span>
            </p>
          </div>
          <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-[11px] font-semibold text-indigo-300 ring-1 ring-indigo-400/25">
            Live
          </span>
        </div>

        {/* Progress */}
        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/5">
          <motion.div
            animate={{ width: `${(presentCount / kids.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
          />
        </div>

        {/* Rows */}
        <ul className="space-y-2">
          {kids.map((kid) => (
            <li
              key={kid.name}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-bold text-white ${kid.color}`}
                >
                  {kid.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <span className="text-sm font-medium text-slate-200">
                  {kid.name}
                </span>
              </div>
              <StatusPill status={kid.status} />
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Floating notification */}
      <div className="absolute -bottom-5 left-4 right-4 sm:-left-6 sm:right-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={notice}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur-md"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
              <Bell className="h-4 w-4" />
            </span>
            <span className="text-xs font-medium text-slate-200">
              {NOTIFICATIONS[notice]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
