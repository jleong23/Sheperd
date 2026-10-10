import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Check, PhoneCall, UserRound, Users } from "lucide-react";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ACCENTS = {
  blue: {
    icon: "bg-blue-500/15 text-blue-300",
    hover: "hover:border-blue-400/40 hover:shadow-blue-500/10",
  },
  purple: {
    icon: "bg-purple-500/15 text-purple-300",
    hover: "hover:border-purple-400/40 hover:shadow-purple-500/10",
  },
  pink: {
    icon: "bg-pink-500/15 text-pink-300",
    hover: "hover:border-pink-400/40 hover:shadow-pink-500/10",
  },
  emerald: {
    icon: "bg-emerald-500/15 text-emerald-300",
    hover: "hover:border-emerald-400/40 hover:shadow-emerald-500/10",
  },
};

/* ---------- Mini live previews ---------- */

function KidsPreview() {
  const kids = [
    { name: "Ava Mitchell", tags: ["Baptised", "Sunday regular"] },
    { name: "Noah Turner", tags: ["New"] },
    { name: "Mia Kowalski", tags: ["Sunday regular"] },
  ];

  return (
    <ul className="space-y-2">
      {kids.map((kid, i) => (
        <motion.li
          key={kid.name}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
          className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
        >
          <span className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
            <UserRound className="h-4 w-4 text-slate-500" />
            {kid.name}
          </span>
          <span className="flex gap-1.5">
            {kid.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-300 ring-1 ring-blue-400/20"
              >
                {tag}
              </span>
            ))}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}

const BAR_HEIGHTS = [45, 70, 60, 85, 55, 90, 65, 80, 50, 75];

function AttendancePreview() {
  return (
    <div>
      <div className="flex h-24 items-end gap-1.5">
        {BAR_HEIGHTS.map((h, i) => (
          <motion.div
            key={i}
            style={{ height: `${h}%` }}
            animate={{ scaleY: [1, 0.6, 1] }}
            transition={{
              duration: 3 + (i % 3) * 0.6,
              delay: i * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full origin-bottom rounded-t-md bg-gradient-to-t from-purple-500/30 to-purple-300"
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-500">
        <span>Week 1</span>
        <span>Week 10</span>
      </div>
    </div>
  );
}

function EventsPreview() {
  const events = [
    { day: "14", month: "Oct", name: "Youth Night" },
    { day: "21", month: "Oct", name: "Leaders Meeting" },
    { day: "02", month: "Nov", name: "Camp Weekend" },
  ];

  return (
    <ul className="space-y-2">
      {events.map((event, i) => (
        <li
          key={event.name}
          className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
        >
          <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-pink-500/15 leading-none text-pink-300">
            <span className="text-sm font-bold">{event.day}</span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase">
              {event.month}
            </span>
          </span>
          <span className="flex-1 text-sm font-medium text-slate-200">
            {event.name}
          </span>
          {i === 0 && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-400" />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

const STEPS = ["First call", "Second call", "Caught up"];

function CatchupsPreview() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => (s + 1) % (STEPS.length + 2)),
      1500,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center">
      {STEPS.map((label, i) => {
        const done = i < step;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <motion.span
                animate={{
                  backgroundColor: done
                    ? "rgb(16 185 129)"
                    : "rgba(255,255,255,0.06)",
                  scale: done ? [1, 1.15, 1] : 1,
                }}
                transition={{ duration: 0.35 }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white ring-1 ring-white/10"
              >
                {done ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <PhoneCall className="h-4 w-4 text-slate-500" />
                )}
              </motion.span>
              <span className="text-[11px] font-medium text-slate-400">
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="mx-2 mb-6 h-px flex-1 overflow-hidden bg-white/10">
                <motion.div
                  animate={{
                    width:
                      i < step - 1 || (i === step - 1 && done) ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-emerald-400"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Card + data ---------- */

const features = [
  {
    id: "kids",
    icon: Users,
    accent: "blue",
    title: "Kids Management",
    description:
      "Profiles, contact details and milestones, all organised in one place.",
    Preview: KidsPreview,
    className: "md:col-span-2",
  },
  {
    id: "attendance",
    icon: Check,
    accent: "purple",
    title: "Attendance Tracking",
    description: "Record each week of the term and keep every leader aligned.",
    Preview: AttendancePreview,
  },
  {
    id: "events",
    icon: CalendarDays,
    accent: "pink",
    title: "Events",
    description: "Plan what's coming up and keep your team in the loop.",
    Preview: EventsPreview,
  },
  {
    id: "catchups",
    icon: PhoneCall,
    accent: "emerald",
    title: "Catchups & Follow-ups",
    description:
      "Track calls and catchups so no new person slips through the cracks.",
    Preview: CatchupsPreview,
    className: "md:col-span-2",
  },
];

function FeatureCard({
  icon: Icon,
  accent,
  title,
  description,
  Preview,
  className = "",
}) {
  const styles = ACCENTS[accent];

  return (
    <motion.article
      variants={item}
      className={`group flex flex-col rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl shadow-transparent backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${styles.hover} ${className}`}
    >
      <div className="mb-5 flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>

      <p className="mb-6 text-sm leading-6 text-slate-400">{description}</p>

      <div className="mt-auto">
        <Preview />
      </div>
    </motion.article>
  );
}

export default function FeatureCards() {
  return (
    <section className="pb-20 pt-6">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything your team needs
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-400">
          A glimpse of what you'll use every week.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={container}
        className="grid gap-5 md:grid-cols-3"
      >
        {features.map(({ id, ...feature }) => (
          <FeatureCard key={id} {...feature} />
        ))}
      </motion.div>
    </section>
  );
}
