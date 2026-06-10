const SKELETON_PANEL_CLASS =
  "rounded-2xl border border-slate-800 bg-slate-950/50 p-3";

const SKELETON_CALL_PANEL_CLASS =
  "rounded-2xl border border-slate-800 bg-slate-950/50 p-4";

export default function KidCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 h-3 w-24 rounded-full bg-slate-800" />
          <div className="h-7 w-40 rounded-full bg-slate-700" />
          <div className="mt-3 h-6 w-20 rounded-full bg-indigo-500/20" />
        </div>

        <div className="h-10 w-10 rounded-xl bg-red-500/10" />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className={SKELETON_PANEL_CLASS}>
          <div className="mb-2 h-3 w-12 rounded-full bg-slate-800" />
          <div className="h-4 w-28 rounded-full bg-slate-700" />
        </div>

        <div className={SKELETON_PANEL_CLASS}>
          <div className="mb-2 h-3 w-16 rounded-full bg-slate-800" />
          <div className="h-4 w-32 rounded-full bg-slate-700" />
          <div className="mt-2 h-3 w-24 rounded-full bg-slate-800" />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3 sm:col-span-2">
          <div className="mb-2 h-3 w-14 rounded-full bg-slate-800" />
          <div className="h-4 w-36 rounded-full bg-slate-700" />
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="mb-2 h-4 w-24 rounded-full bg-slate-700" />
                <div className="h-3 w-28 rounded-full bg-slate-800" />
              </div>

              <div className="h-10 w-10 rounded-xl bg-slate-800" />
            </div>

            <div className="h-24 w-full rounded-xl bg-slate-800" />
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-end border-t border-slate-800 pt-5">
        <div className="h-11 w-full rounded-xl bg-indigo-500/20 sm:w-32" />
      </div>
    </div>
  );
}
