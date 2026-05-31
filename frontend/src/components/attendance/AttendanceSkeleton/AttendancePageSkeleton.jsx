import { motion } from "framer-motion";

function SkeletonBlock({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-xl bg-slate-800 ${className}`} />
  );
}

export default function AttendancePageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header skeleton */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur"
        >
          <SkeletonBlock className="mb-4 h-8 w-48" />
          <SkeletonBlock className="h-4 w-72" />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <SkeletonBlock className="h-12 w-full" />
            <SkeletonBlock className="h-12 w-full" />
          </div>
        </motion.section>

        {/* Toolbar skeleton */}
        <section className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <SkeletonBlock className="mb-3 h-5 w-40" />
              <SkeletonBlock className="h-4 w-56" />
            </div>

            <div className="flex gap-3">
              <SkeletonBlock className="h-10 w-28 rounded-full" />
              <SkeletonBlock className="h-10 w-28 rounded-full" />
            </div>
          </div>
        </section>

        {/* Week panel skeleton */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <SkeletonBlock className="h-6 w-32" />
            <SkeletonBlock className="h-8 w-24 rounded-full" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5"
              >
                <div className="mb-5 flex items-center gap-3">
                  <SkeletonBlock className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <SkeletonBlock className="mb-2 h-4 w-32" />
                    <SkeletonBlock className="h-3 w-20" />
                  </div>
                </div>

                <div className="mb-5 flex gap-2">
                  <SkeletonBlock className="h-8 w-20 rounded-full" />
                  <SkeletonBlock className="h-8 w-20 rounded-full" />
                  <SkeletonBlock className="h-8 w-24 rounded-full" />
                </div>

                <SkeletonBlock className="h-20 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
