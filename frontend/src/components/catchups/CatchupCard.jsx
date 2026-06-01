import { motion } from "framer-motion";
import KidStatusBadge from "../ui/KidStatusBadge";
import KidFlagBadge from "../ui/KidFlagBadge";

export function CatchupCard({ catchup, onClick }) {
  const formattedDate = catchup.catchupdate
    ? new Date(catchup.catchupdate).toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <motion.article
      onClick={onClick}
      whileHover={{
        y: -6,
        scale: 1.02,
        boxShadow: "0px 0px 30px rgba(99,102,241,0.25)",
        borderColor: "rgba(99,102,241,0.65)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex h-full cursor-pointer flex-col rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur"
    >
      <div className="mb-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kid
            </p>

            <h2 className="mt-1 line-clamp-1 text-xl font-bold text-white">
              {catchup.kidName || "Unknown Kid"}
            </h2>
          </div>

          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300">
            💬
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <KidStatusBadge status={catchup.kidStatus} />
          {!!catchup.kidBaptised && <KidFlagBadge flag="BAPTISED" />}
          {!!catchup.kidSundayRegulars && (
            <KidFlagBadge flag="SUNDAY_REGULAR" />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Purpose
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-200">
            {catchup.catchuppurpose || "No purpose added"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Comments
          </p>
          <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-200">
            {catchup.catchupcomments || "No comments added"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Date
            </p>
            <p className="mt-1 text-sm font-semibold text-indigo-300">
              {formattedDate}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Time
            </p>
            <p className="mt-1 text-sm font-semibold text-purple-300">
              {catchup.catchupstarttime || "N/A"} –{" "}
              {catchup.catchupendtime || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 border-t border-slate-800 pt-4 text-xs font-semibold text-slate-500 transition group-hover:text-indigo-300">
        Click to view or edit details →
      </p>
    </motion.article>
  );
}
