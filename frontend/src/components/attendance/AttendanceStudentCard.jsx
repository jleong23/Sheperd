/**
 * StudentCard Component
 * ---------------------------------------------------
 * Displays an individual student's attendance record.
 *
 * Features:
 * - Attendance status dropdown
 * - Attendance comment input
 * - Dynamic styling based on attendance status
 */

import { motion as Motion } from "framer-motion";
import { CgProfile } from "react-icons/cg";
import CallStatusPill from "./CallStatusPill.jsx";

const STATUS_CYCLE = ["tbc", "maybe", "not coming", "coming"];

const STATUS_LABELS = {
  tbc: "TBC",
  maybe: "Maybe",
  coming: "Coming",
  "not coming": "Not coming",
};

const STATUS_STYLES = {
  tbc: {
    container:
      "border-blue-400/35 bg-white/5 hover:border-blue-400/60 hover:shadow-[0_0_18px_rgba(59,130,246,0.18)]",
    badge:
      "bg-blue-500/10 text-blue-300 border border-blue-400/30 hover:bg-blue-500/15",
  },
  coming: {
    container:
      "border-green-400/35 bg-white/5 hover:border-green-400/60 hover:shadow-[0_0_18px_rgba(34,197,94,0.18)]",
    badge:
      "bg-green-500/10 text-green-300 border border-green-400/30 hover:bg-green-500/15",
  },
  "not coming": {
    container:
      "border-red-400/35 bg-white/5 hover:border-red-400/60 hover:shadow-[0_0_18px_rgba(239,68,68,0.18)]",
    badge:
      "bg-red-500/10 text-red-300 border border-red-400/30 hover:bg-red-500/15",
  },
  maybe: {
    container:
      "border-yellow-400/35 bg-white/5 hover:border-yellow-400/60 hover:shadow-[0_0_18px_rgba(234,179,8,0.18)]",
    badge:
      "bg-yellow-500/10 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-500/15",
  },
  default: {
    container:
      "border-white/10 bg-white/5 hover:border-blue-400/40 hover:shadow-[0_0_18px_rgba(59,130,246,0.16)]",
    badge:
      "bg-white/10 text-slate-300 border border-white/10 hover:bg-white/15",
  },
};

export default function AttendanceStudentCard({
  record,
  onStatusChange,
  onCallStatusChange,
  onReasonChange,
  onReasonSubmit,
}) {
  const status = record.status || "tbc";
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.default;

  const handleStatusTap = () => {
    const currentIndex = STATUS_CYCLE.indexOf(status);
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];

    onStatusChange(record.id, nextStatus);
  };

  return (
    <Motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative border bg-white/5 backdrop-blur-md shadow-sm rounded-2xl p-4 flex flex-col gap-4 transition-all ${styles.container}`}
    >
      <div className="flex items-center gap-2 text-md font-bold text-white">
        <CgProfile className="text-indigo-400 w-5 h-5 shrink-0" />
        <span className="line-clamp-1">{record.name}</span>
      </div>

      <div className="grid gap-3">
        <div className="grid gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Attendance
          </span>
          <button
            type="button"
            onClick={handleStatusTap}
            aria-label={`Attendance status ${STATUS_LABELS[status] || status}. Click to cycle.`}
            className={`px-3 py-2 min-h-[44px] rounded-lg font-bold text-[10px] sm:text-xs uppercase tracking-wider w-full text-left flex justify-between items-center transition-all shadow-sm active:scale-95 ${styles.badge}`}
          >
            <span className="truncate">{STATUS_LABELS[status] || status}</span>
            <span className="text-xs opacity-70">Tap</span>
          </button>
        </div>

        <div className="grid gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Call
          </span>
          <CallStatusPill
            value={record.call_status}
            animationId={record.id}
            onChange={(callStatus) => onCallStatusChange(record.id, callStatus)}
          />
        </div>
      </div>

      <div className="mt-1 pt-4 border-t border-white/10 flex flex-col gap-2.5">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
          Comment
        </label>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={record.reason || ""}
            onChange={(e) => onReasonChange(record.id, e.target.value)}
            className="flex-1 min-h-[44px] border border-white/10 bg-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all placeholder:text-slate-500"
          />

          <button
            type="button"
            className="bg-green-500/15 border border-green-400/30 text-green-200 hover:bg-green-500/25 min-h-[44px] sm:px-6 px-4 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-sm active:scale-95"
            onClick={() => onReasonSubmit(record.id)}
          >
            Save
          </button>
        </div>
      </div>
    </Motion.div>
  );
}
