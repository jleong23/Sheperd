import { CgProfile } from "react-icons/cg";
import { FaBirthdayCake, FaSchool, FaPhoneAlt, FaTrash } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";
import profileIcon from "../../assets/profileIcon.png";

export default function KidsCard({ kid, onKidDeleted, isSelected, onSelect }) {
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
    <div className="relative border rounded-lg shadow hover:shadow-xl transition-shadow bg-white p-4 flex flex-col gap-4">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(kid.id)}
        className="mr-2"
      />
      {/* Delete Icon */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
        title="Delete"
      >
        <FaTrash size={20} />
      </button>

      {/* Top: Image + Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="flex-shrink-0 w-20 h-20">
          <img
            src={profileIcon}
            alt={`${kid.name}'s photo`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center gap-2">
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
      <div className="flex justify-between border-t pt-2 mt-2 text-gray-700">
        <div className="flex items-center gap-1">
          <FaPhoneAlt className="text-purple-500" />
          <a href={`tel:${kid.phone}`} className="hover:underline">
            {kid.phone}
          </a>
        </div>

        <div className="flex items-center gap-1">
          <MdContactPhone className="text-indigo-500" />
          <a href={`tel:${kid.parent_phone}`} className="hover:underline">
            Parents No: {kid.parent_phone || "N/A"}
          </a>
        </div>
      </div>
    </div>
  );
}
