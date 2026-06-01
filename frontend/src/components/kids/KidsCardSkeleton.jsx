// components/kids/KidsCardSkeleton.jsx
export default function KidsCardSkeleton() {
  return (
    <div className="relative flex h-full animate-pulse flex-col gap-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur">
      {/* delete icon placeholder */}
      <div className="absolute right-4 top-4 h-9 w-9 rounded-xl bg-slate-800/80" />

      {/* kid details section */}
      <div className="flex flex-col gap-3 pr-12">
        {/* name row */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/20" />
          <div className="h-5 w-36 rounded-full bg-slate-700" />
        </div>

        {/* birthday row */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded bg-pink-500/20" />
          <div className="h-4 w-44 rounded-full bg-slate-800" />
        </div>

        {/* school row */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded bg-emerald-500/20" />
          <div className="h-4 w-32 rounded-full bg-slate-800" />
        </div>

        {/* badges */}
        <div className="mt-1 flex flex-wrap gap-2">
          <div className="h-6 w-16 rounded-full bg-indigo-500/20" />
          <div className="h-6 w-24 rounded-full bg-slate-800" />
        </div>
      </div>

      {/* phone section */}
      <div className="mt-auto border-t border-slate-800 pt-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
            <div className="h-9 w-9 rounded-xl bg-purple-500/20" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-12 rounded-full bg-slate-800" />
              <div className="h-4 w-28 rounded-full bg-slate-700" />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/20" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-16 rounded-full bg-slate-800" />
              <div className="h-4 w-32 rounded-full bg-slate-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
