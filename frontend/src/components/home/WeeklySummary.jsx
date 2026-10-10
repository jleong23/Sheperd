import { motion } from "framer-motion";

const STATUSES = [
  {
    key: "coming",
    label: "Coming",
    stroke: "stroke-blue-500",
    dot: "bg-blue-500",
  },
  {
    key: "maybe",
    label: "Maybe",
    stroke: "stroke-amber-500",
    dot: "bg-amber-500",
  },
  {
    key: "notComing",
    label: "Not coming",
    stroke: "stroke-slate-500",
    dot: "bg-slate-500",
  },
  {
    key: "tbc",
    label: "TBC",
    stroke: "stroke-indigo-400",
    dot: "bg-indigo-400",
  },
];

const percent = (value, total) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

/**
 * Segmented ring. `data` holds the four status counts; `children` is
 * rendered in the centre of the ring.
 */
function Donut({ data, total, size = 168, strokeWidth = 14, children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const visible = STATUSES.filter((s) => data[s.key] > 0);
  const gap = visible.length > 1 ? 3 : 0;

  let offset = 0;
  const segments = visible.map((s) => {
    const raw = (data[s.key] / total) * circumference;
    const length = Math.max(raw - gap, 0);
    const segment = { ...s, length, offset };
    offset += raw;
    return segment;
  });

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-white/10"
        />

        {/* Status segments */}
        {total > 0 &&
          segments.map((s) => (
            <motion.circle
              key={s.key}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={strokeWidth}
              strokeDashoffset={-s.offset}
              className={s.stroke}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{
                strokeDasharray: `${s.length} ${circumference - s.length}`,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

function Legend({ data, total }) {
  return (
    <ul className="grid flex-1 grid-cols-2 gap-3">
      {STATUSES.map((s) => (
        <li
          key={s.key}
          className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
            {s.label}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-semibold text-white">
              {data[s.key]}
            </span>
            <span className="text-xs text-slate-500">
              {percent(data[s.key], total)}%
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function YearLevelCard({ group }) {
  const label =
    group.yearLevel === "Unassigned" ? "Unassigned" : `Year ${group.yearLevel}`;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
      <Donut data={group} total={group.total} size={64} strokeWidth={8}>
        <span className="text-xs font-semibold text-white">
          {percent(group.coming, group.total)}%
        </span>
      </Donut>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-slate-400">
          {group.coming}/{group.total} coming
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          {group.maybe} maybe · {group.notComing} out · {group.tbc} TBC
        </p>
      </div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="h-4 w-28 rounded-md bg-white/10" />
      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
        <div className="h-[168px] w-[168px] shrink-0 rounded-full border-[14px] border-white/10" />
        <div className="grid w-full flex-1 grid-cols-2 gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-[72px] rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WeeklySummary({ summary, loading }) {
  if (loading) return <SummarySkeleton />;

  if (!summary?.active) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-slate-400">No active term right now.</p>
      </div>
    );
  }

  const { coming, maybe, notComing, tbc, total, week, totalWeeks, breakdown } =
    summary;
  const data = { coming, maybe, notComing, tbc };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">This week</h3>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/10">
          Week {week} of {totalWeeks}
        </span>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <Donut data={data} total={total}>
          <span className="text-3xl font-bold text-white">
            {coming}
            <span className="text-lg font-medium text-slate-500">/{total}</span>
          </span>
          <span className="mt-0.5 text-xs text-slate-400">coming</span>
        </Donut>

        <Legend data={data} total={total} />
      </div>

      {/* Pastor-only: breakdown by year level */}
      {breakdown?.length > 0 && (
        <div className="mt-6 border-t border-white/10 pt-6">
          <p className="mb-4 text-sm font-semibold text-white">By year level</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {breakdown.map((group) => (
              <YearLevelCard key={group.yearLevel} group={group} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
