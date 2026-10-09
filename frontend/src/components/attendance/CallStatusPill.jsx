import { createElement } from "react";
import { motion as Motion } from "framer-motion";
import { Check, PhoneOff, X } from "lucide-react";

const CALL_STATUSES = [
  { value: "called", label: "Called", Icon: Check },
  { value: "no_call", label: "No Call", Icon: X },
  { value: "npu", label: "NPU", Icon: PhoneOff },
];

const STATUS_STYLES = {
  called: {
    active: "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/50",
    icon: "text-emerald-300",
  },
  no_call: {
    active: "bg-red-500/20 text-red-200 ring-1 ring-red-400/50",
    icon: "text-red-300",
  },
  npu: {
    active: "bg-slate-500/30 text-slate-100 ring-1 ring-slate-400/50",
    icon: "text-slate-300",
  },
};

export default function CallStatusPill({
  value,
  onChange,
  disabled = false,
  animationId,
}) {
  const status = CALL_STATUSES.some((option) => option.value === value)
    ? value
    : "no_call";

  return (
    <div
      role="group"
      aria-label="Call status"
      className="grid grid-cols-3 rounded-xl border border-white/10 bg-black/20 p-1"
    >
      {CALL_STATUSES.map(({ value: option, label, Icon }) => {
        const isActive = status === option;
        const styles = STATUS_STYLES[option];

        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            disabled={disabled}
            onClick={() => onChange(option)}
            className={`relative flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-2 text-[10px] font-bold transition-colors sm:text-xs ${
              isActive ? styles.active : "text-slate-400 hover:text-slate-200"
            } disabled:cursor-wait disabled:opacity-50`}
          >
            {isActive && (
              <Motion.span
                layoutId={
                  animationId ? `call-status-active-${animationId}` : undefined
                }
                className="absolute inset-0 -z-0 rounded-lg"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            {createElement(Icon, {
              "aria-hidden": true,
              className: `relative z-10 h-3.5 w-3.5 shrink-0 ${isActive ? styles.icon : ""}`,
            })}
            <span className="relative z-10 whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
