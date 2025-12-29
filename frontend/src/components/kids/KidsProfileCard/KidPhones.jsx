import { FaPhoneAlt } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";
export default function KidPhones({ phone, parentPhone }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between border-t pt-3 mt-3 text-gray-700 gap-2 sm:gap-0">
      <div className="flex items-center gap-2">
        <FaPhoneAlt className="text-purple-500" />
        <span
          onClick={() => (window.location.href = `tel:${phone}`)}
          className="hover:underline cursor-pointer"
        >
          {phone}
        </span>
      </div>
      <div className="flex items-center gap-2 sm:justify-end">
        <MdContactPhone className="text-indigo-500" />
        <span
          onClick={() => (window.location.href = `tel:${parentPhone}`)}
          className="hover:underline cursor-pointer"
        >
          Parents No: {parentPhone || "N/A"}
        </span>
      </div>
    </div>
  );
}
