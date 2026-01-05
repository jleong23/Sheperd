import { KID_STATUS } from "../../utils/kidStatus";

export default function KidStatusBadge({ status }) {
  const config = KID_STATUS[status] || KID_STATUS.NP;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
