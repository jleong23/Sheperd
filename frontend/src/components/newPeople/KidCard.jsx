import { FaTrash, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import KidStatusBadge from "../ui/KidStatusBadge";

const INPUT_CLASS =
  "w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30";

function CallBlock({
  title,
  kid,
  field,
  feedbackField,
  glow,
  accentClass,
  onToggleCall,
  onFeedbackChange,
}) {
  const isDone = !!kid[field];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {isDone ? "Follow-up completed" : "Follow-up pending"}
          </p>
        </div>

        <motion.button
          type="button"
          onClick={() => onToggleCall(kid, field)}
          whileHover={{
            y: -2,
            scale: 1.04,
            boxShadow: isDone ? `0px 0px 20px ${glow}` : undefined,
          }}
          whileTap={{ scale: 0.96 }}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
            isDone
              ? `${accentClass} text-white shadow-lg`
              : "border-slate-700 bg-slate-900 text-slate-500 hover:border-indigo-500/50 hover:text-slate-300"
          }`}
          title={isDone ? "Mark as not done" : "Mark as done"}
        >
          {isDone && <FaCheck size={14} />}
        </motion.button>
      </div>

      <textarea
        className={INPUT_CLASS}
        rows="3"
        placeholder={`Add ${title.toLowerCase()} notes...`}
        value={kid[feedbackField] || ""}
        onChange={(e) =>
          onFeedbackChange(kid.id, feedbackField, e.target.value)
        }
      />
    </div>
  );
}

export default function KidCard({
  kid,
  onToggleCall,
  onFeedbackChange,
  onSave,
  onDelete,
}) {
  return (
    <motion.article
      whileHover={{
        y: -6,
        scale: 1.01,
        boxShadow: "0px 0px 30px rgba(99,102,241,0.25)",
        borderColor: "rgba(99,102,241,0.65)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur"
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            New Person
          </p>

          <h2 className="mt-1 text-2xl font-extrabold text-white">
            {kid.name}
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            <KidStatusBadge status={kid.status_code} />
          </div>
        </div>

        <motion.button
          type="button"
          onClick={() => onDelete(kid.id)}
          whileHover={{
            y: -2,
            scale: 1.05,
            boxShadow: "0px 0px 20px rgba(239,68,68,0.3)",
          }}
          whileTap={{ scale: 0.96 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
          title="Delete new person"
        >
          <FaTrash size={14} />
        </motion.button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Phone
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-300">
            {kid.phone || "N/A"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Parent
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-300">
            {kid.parentname || "N/A"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {kid.parent_phone || "No parent phone"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3 sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            School
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-300">
            {kid.school || "N/A"}
          </p>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 xl:grid-cols-2">
        <CallBlock
          title="First Call"
          kid={kid}
          field="first_call"
          feedbackField="first_call_feedback"
          glow="rgba(34,197,94,0.3)"
          accentClass="border-green-400/40 bg-green-600"
          onToggleCall={onToggleCall}
          onFeedbackChange={onFeedbackChange}
        />
        <CallBlock
          title="Second Call"
          kid={kid}
          field="second_call"
          feedbackField="second_call_feedback"
          glow="rgba(99,102,241,0.35)"
          accentClass="border-indigo-400/40 bg-indigo-600"
          onToggleCall={onToggleCall}
          onFeedbackChange={onFeedbackChange}
        />
      </div>

      <div className="mt-5 flex justify-end border-t border-slate-800 pt-5">
        <motion.button
          type="button"
          onClick={() => onSave(kid)}
          whileHover={{
            y: -2,
            scale: 1.02,
            boxShadow: "0px 0px 24px rgba(99,102,241,0.35)",
          }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 sm:w-fit"
        >
          Save Feedback
        </motion.button>
      </div>
    </motion.article>
  );
}
