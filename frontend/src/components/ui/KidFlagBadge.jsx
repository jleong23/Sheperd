import { KID_FLAGS } from "../../utils/kidStatus";

export default function KidFlagBadge({ flag }) {
  const config = KID_FLAGS[flag];

  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
