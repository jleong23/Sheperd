import { CgProfile } from "react-icons/cg";
import { FaBirthdayCake, FaSchool, FaPhoneAlt, FaTrash } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";
import profileIcon from "../../assets/profileIcon.png";

export default function KidsCard({
  kid,
  onKidDeleted,
  isSelected,
  onSelect,
  showCheckbox = false,
}) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${kid.name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:4000/kids/${kid.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete kid");
        return;
      }

      onKidDeleted?.();
    } catch (err) {
      console.error(err);
      alert("Error Deleting Kid!");
    }
  };

  return (
    <div className="relative border rounded-xl shadow hover:shadow-2xl transition-shadow bg-white p-4 flex flex-col gap-4 group">
      {/* Checkbox only shows in bulk delete mode */}
      {showCheckbox && (
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(kid.id)}
            className="w-5 h-5 accent-blue-600"
          />
        </div>
      )}

      {/* Delete Icon - only visible on hover */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-opacity opacity-0 group-hover:opacity-100"
        title="Delete"
      >
        <FaTrash size={20} />
      </button>

      {/* Top: Image + Info */}
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        {/* Profile Image */}
        <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28">
          <img
            src={profileIcon}
            alt={`${kid.name}'s photo`}
            className="w-full h-full object-cover rounded-lg border"
          />
        </div>

        {/* Name, Birthday, School */}
        <div className="flex flex-col justify-center gap-1 sm:gap-2 w-full">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <CgProfile className="text-blue-600" />
            {kid.name}
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <FaBirthdayCake className="text-yellow-500" />
            {new Date(kid.birthday).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <FaSchool className="text-green-500" />
            {kid.school}
          </div>
        </div>
      </div>

      {/* Bottom: Phone Numbers */}
      <div className="flex flex-col sm:flex-row justify-between border-t pt-3 mt-3 text-gray-700 gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <FaPhoneAlt className="text-purple-500" />
          <a href={`tel:${kid.phone}`} className="hover:underline">
            {kid.phone}
          </a>
        </div>

        <div className="flex items-center gap-2 sm:justify-end">
          <MdContactPhone className="text-indigo-500" />
          <a href={`tel:${kid.parent_phone}`} className="hover:underline">
            Parents No: {kid.parent_phone || "N/A"}
          </a>
        </div>
      </div>
    </div>
  );
}
