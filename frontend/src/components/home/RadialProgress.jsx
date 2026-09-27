export default function RadialProgress({
  percentage,
  label,
  value,
  size = 120,
  strokeWidth = 10,
  color = "#3b82f6",
}) {
  const hasValue = percentage !== null && percentage !== undefined;
  const safePercentage = Math.max(0, Math.min(100, percentage ?? 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            {hasValue ? `${safePercentage}%` : "N/A"}
          </span>
        </div>
      </div>
      {value && (
        <p className="text-slate-400 text-xs mt-2 text-center">{value}</p>
      )}
      <p className="text-slate-300 mt-1 text-sm font-medium text-center">
        {label}
      </p>
    </div>
  );
}
