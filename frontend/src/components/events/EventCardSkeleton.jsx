export default function EventCardSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur">
      <div className="mb-5 h-44 w-full rounded-2xl bg-slate-800" />

      <div className="flex flex-1 flex-col">
        <div className="mb-5">
          <div className="mb-3 h-6 w-3/4 rounded-full bg-slate-700" />
          <div className="h-3 w-1/2 rounded-full bg-slate-800" />
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
            <div className="mb-2 h-3 w-16 rounded-full bg-slate-800" />
            <div className="h-4 w-40 rounded-full bg-slate-700" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
              <div className="mb-2 h-3 w-12 rounded-full bg-slate-800" />
              <div className="h-4 w-16 rounded-full bg-slate-700" />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
              <div className="mb-2 h-3 w-12 rounded-full bg-slate-800" />
              <div className="h-4 w-16 rounded-full bg-slate-700" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
            <div className="mb-2 h-3 w-28 rounded-full bg-slate-800" />
            <div className="h-4 w-full rounded-full bg-slate-700" />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
          <div className="h-10 w-full rounded-xl bg-slate-800 sm:w-20" />
          <div className="h-10 w-full rounded-xl bg-slate-800 sm:w-24" />
        </div>
      </div>
    </div>
  );
}
