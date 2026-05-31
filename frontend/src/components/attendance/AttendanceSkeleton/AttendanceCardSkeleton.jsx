export default function AttendanceCardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <div className="h-5 w-32 rounded bg-slate-700" />

      <div className="mt-4 h-4 w-24 rounded bg-slate-800" />

      <div className="mt-6 flex gap-2">
        <div className="h-8 w-20 rounded-full bg-slate-800" />
        <div className="h-8 w-20 rounded-full bg-slate-800" />
        <div className="h-8 w-20 rounded-full bg-slate-800" />
      </div>
    </div>
  );
}
