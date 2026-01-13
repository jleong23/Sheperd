import { FaPhoneAlt } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";

export default function KidPhones({ phone, parentPhone }) {
  return (
    <div className="flex flex-col gap-3 border-t pt-4 mt-auto w-full">
      {/* Student Phone */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-50 text-purple-600 rounded-lg">
          <FaPhoneAlt size={12} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Kid
          </span>
          <a
            href={`tel:${phone}`}
            className="text-sm font-semibold text-gray-700 hover:text-purple-600 truncate block transition-colors"
          >
            {phone || "N/A"}
          </a>
        </div>
      </div>

      {/* Parent Phone */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg">
          <MdContactPhone size={14} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Parent
          </span>
          <a
            href={`tel:${parentPhone}`}
            className="text-sm font-semibold text-gray-700 hover:text-indigo-600 truncate block transition-colors"
          >
            {parentPhone || "N/A"}
          </a>
        </div>
      </div>
    </div>
  );
}
