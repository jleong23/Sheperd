import { FaTrash } from "react-icons/fa";
import KidDetails from "./KidDetails";
import KidPhones from "./KidPhones";
import { KidProfileImage } from "./KidProfileImage";

// KidsCard component

// Props:
// kid: object containing kid data
// onKidDeleted: callback when kid is deleted
// showCheckbox: whether to show checkbox (bulk delete mode)
// isSelected: whether this kid is selected
// onSelect: callback to toggle selection
export default function KidsCard({
  kid,
  onKidDeleted,
  showCheckbox = false,
  isSelected,
  onSelect,
}) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${kid.name}?`
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
      alert("Error deleting kid");
    }
  };

  return (
    <div className="relative border rounded-xl shadow hover:shadow-2xl transition-shadow bg-white p-4 flex flex-col gap-4 group">
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(kid.id)}
          className="absolute top-3 left-3 w-5 h-5 accent-blue-600"
        />
      )}

      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
        title="Delete"
      >
        <FaTrash size={20} />
      </button>

      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        <KidProfileImage photo={kid.photo} name={kid.name} />
        <KidDetails
          name={kid.name}
          birthday={kid.birthday}
          school={kid.school}
        />
      </div>

      <KidPhones phone={kid.phone} parentPhone={kid.parent_phone} />
    </div>
  );
}
