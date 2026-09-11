function StatusBar({ coming, maybe, notComing, total }) {
  const comingPct = total > 0 ? (coming / total) * 100 : 0;
  const maybePct = total > 0 ? (maybe / total) * 100 : 0;
  const notComingPct = total > 0 ? (notComing / total) * 100 : 0;

  return (
    <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden flex">
      <div className="h-full bg-blue-500" style={{ width: `${comingPct}%` }} />
      <div className="h-full bg-amber-500" style={{ width: `${maybePct}%` }} />
      <div
        className="h-full bg-slate-500"
        style={{ width: `${notComingPct}%` }}
      />
    </div>
  );
}

function StatusLegend({ coming, maybe, notComing }) {
  return (
    <div className="mt-2 flex gap-4 text-sm text-slate-400">
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
  );
}

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

  const { coming, maybe, notComing, total, week, totalWeeks, breakdown } =
    summary;

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-6">
      <p className="text-slate-400 text-sm mb-1">
        Week {week} of {totalWeeks}
      </p>
      <p className="text-3xl font-semibold text-white">
        {coming}/{total}{" "}
        <span className="text-lg text-slate-400">coming this week</span>
      </p>
      <StatusBar
        coming={coming}
        maybe={maybe}
        notComing={notComing}
        total={total}
      />
      <StatusLegend coming={coming} maybe={maybe} notComing={notComing} />

      {/* Pastor-only: breakdown by year level */}
      {breakdown && (
        <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
          <p className="text-slate-400 text-sm font-medium">By year level</p>
          {breakdown.map((g) => (
            <div key={g.yearLevel}>
              <div className="flex justify-between text-sm text-white">
                <span>
                  {g.yearLevel === "Unassigned"
                    ? "Unassigned"
                    : `Year ${g.yearLevel}`}
                </span>
                <span className="text-slate-400">
                  {g.coming}/{g.total} coming
                </span>
              </div>
              <StatusBar
                coming={g.coming}
                maybe={g.maybe}
                notComing={g.notComing}
                total={g.total}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
