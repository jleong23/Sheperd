export default function WeeklySummary({ summary, loading }) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white/5 border border-white/10 p-6 animate-pulse h-24" />
    );
  }

  if (!summary?.active) {
    return (
      <div className="rounded-xl bg-white/5 border border-white/10 p-6">
        <p className="text-slate-400 text-sm">No active term right now.</p>
      </div>
    );
  }

  const { coming, maybe, notComing, total, week, totalWeeks } = summary;
  const comingPct = total > 0 ? (coming / total) * 100 : 0;
  const maybePct = total > 0 ? (maybe / total) * 100 : 0;
  const notComingPct = total > 0 ? (notComing / total) * 100 : 0;

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-6">
      <p className="text-slate-400 text-sm mb-1">
        Week {week} of {totalWeeks}
      </p>
      <p className="text-2xl font-semibold text-white">
        {coming}/{total}{" "}
        <span className="text-lg text-slate-400">coming this week</span>
      </p>

      {/* Stacked bar: coming / maybe / not coming */}
      <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden flex">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${comingPct}%` }}
        />
        <div
          className="h-full bg-amber-500"
          style={{ width: `${maybePct}%` }}
        />
        <div
          className="h-full bg-red-700"
          style={{ width: `${notComingPct}%` }}
        />
      </div>

      {/* Breakdown labels */}
      <div className="mt-3 flex gap-4 text-md text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> {coming} coming
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> {maybe} maybe
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-500" /> {notComing} not
          coming
        </span>
      </div>
    </div>
  );
}
