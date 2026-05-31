import { FaTrash, FaCheck } from "react-icons/fa";
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

  const handleCardClick = (e) => {
    if (!showCheckbox) return;

    e.preventDefault();
    e.stopPropagation();
    onSelect(kid.id);
  };

  const cardContent = (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
        boxShadow: isSelected
          ? "0px 0px 34px rgba(99,102,241,0.38)"
          : "0px 0px 30px rgba(99,102,241,0.25)",
        borderColor: "rgba(99,102,241,0.65)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={handleCardClick}
      className={`group relative h-full overflow-hidden rounded-3xl border bg-slate-900/80 p-5 backdrop-blur transition ${
        showCheckbox ? "cursor-pointer select-none" : "cursor-pointer"
      } ${
        isSelected
          ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/25"
          : "border-slate-800"
      }`}
    >
      {showCheckbox && (
        <div
          className={`absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border transition ${
            isSelected
              ? "border-indigo-400 bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
              : "border-slate-600 bg-slate-950/80 text-transparent group-hover:border-indigo-400 group-hover:bg-indigo-500/10"
          }`}
        >
          {isSelected && <FaCheck size={14} />}
        </div>
      )}

      {!showCheckbox && (
        <button
          onClick={handleDelete}
          className="absolute right-4 top-4 z-20 rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-300 opacity-100 transition hover:bg-red-500/20 hover:text-red-200 sm:opacity-0 sm:group-hover:opacity-100"
          title="Delete"
        >
          <FaTrash size={14} />
        </button>
      )}

      {showCheckbox && (
        <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition group-hover:border-indigo-400/40" />
      )}

      <div className="flex h-full flex-col gap-5 pr-10">
        <KidDetails
          name={kid.name}
          birthday={kid.birthday}
          school={kid.school}
          status_code={kid.status_code}
          baptised={kid.baptised}
          sunday_regulars={kid.sunday_regulars}
        />

        <KidPhones phone={kid.phone} parentPhone={kid.parent_phone} />
      </div>
    </motion.div>
  );

  if (showCheckbox) {
    return cardContent;
  }

  return (
    <Link to={`/kids/${kid.id}`} className="block h-full">
      {cardContent}
    </Link>
  );
}
