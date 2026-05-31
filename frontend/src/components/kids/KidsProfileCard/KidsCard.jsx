import { FaTrash } from "react-icons/fa";
import KidDetails from "./KidDetails";
import KidPhones from "./KidPhones";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../../api/index.js";

export default function KidsCard({
  kid,
  onKidDeleted,
  showCheckbox = false,
  isSelected,
  onSelect,
}) {
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      `Are you sure you want to delete ${kid.name}?`,
    );
    if (!confirmed) return;

    try {
      await api.delete(`/kids/${kid.id}`);
      onKidDeleted?.();
    } catch (err) {
      console.error(err);
      alert("Error deleting kid");
    }
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect(kid.id);
  };

  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
        boxShadow: "0px 0px 30px rgba(99,102,241,0.25)",
        borderColor: "rgba(99,102,241,0.65)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`group relative h-full overflow-hidden rounded-3xl border bg-slate-900/80 p-5 backdrop-blur transition ${
        isSelected
          ? "border-indigo-500 shadow-lg shadow-indigo-500/25"
          : "border-slate-800"
      }`}
    >
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          onClick={(e) => e.stopPropagation()}
          className="absolute left-4 top-4 z-20 h-5 w-5 cursor-pointer accent-indigo-600"
        />
      )}

      <button
        onClick={handleDelete}
        className="absolute right-4 top-4 z-20 rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-300 opacity-100 transition hover:bg-red-500/20 hover:text-red-200 sm:opacity-0 sm:group-hover:opacity-100"
        title="Delete"
      >
        <FaTrash size={14} />
      </button>

      <Link to={`/kids/${kid.id}`} className="block h-full">
        <div className="flex h-full flex-col gap-5">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            <KidDetails
              name={kid.name}
              birthday={kid.birthday}
              school={kid.school}
              status_code={kid.status_code}
              baptised={kid.baptised}
              sunday_regulars={kid.sunday_regulars}
            />
          </div>

          <KidPhones phone={kid.phone} parentPhone={kid.parent_phone} />
        </div>
      </Link>
    </motion.div>
  );
}
