import { motion } from "framer-motion";

function SkeletonBlock({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-xl bg-slate-800 ${className}`} />
  );
}

export default function CatchupPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-8"
        >
          <SkeletonBlock className="mb-4 h-8 w-48" />
          <SkeletonBlock className="h-10 w-64 sm:w-96" />
          <SkeletonBlock className="mt-4 h-4 w-full max-w-xl" />

          <div className="mt-6 flex justify-end">
            <SkeletonBlock className="h-12 w-full rounded-full sm:w-36" />
          </div>
        </motion.section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-6">
          <SkeletonBlock className="mb-3 h-6 w-40" />
          <SkeletonBlock className="mb-5 h-4 w-72" />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <SkeletonBlock className="h-12 lg:col-span-2" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12 lg:col-span-2" />
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex h-full animate-pulse flex-col rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur"
            >
              <div className="mb-5">
                <SkeletonBlock className="mb-3 h-4 w-16" />
                <SkeletonBlock className="h-6 w-40" />
              </div>

              <div className="mb-5 flex gap-2">
                <SkeletonBlock className="h-6 w-16 rounded-full" />
                <SkeletonBlock className="h-6 w-24 rounded-full" />
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
                  <SkeletonBlock className="mb-2 h-3 w-20" />
                  <SkeletonBlock className="h-4 w-full" />
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
                  <SkeletonBlock className="mb-2 h-3 w-24" />
                  <SkeletonBlock className="mb-2 h-4 w-full" />
                  <SkeletonBlock className="h-4 w-3/4" />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
                    <SkeletonBlock className="mb-2 h-3 w-12" />
                    <SkeletonBlock className="h-4 w-20" />
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
                    <SkeletonBlock className="mb-2 h-3 w-12" />
                    <SkeletonBlock className="h-4 w-24" />
                  </div>
                </div>
              </div>

              <SkeletonBlock className="mt-5 h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
