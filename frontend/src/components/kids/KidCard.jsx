import { FaTrash, FaCheck, FaEdit, FaExchangeAlt } from "react-icons/fa";
import KidDetails from "./KidsProfileCard/KidDetails";
import KidPhones from "./KidsProfileCard/KidPhones";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function KidCard({
  kid,
  onDelete,
  onEdit,
  onTransfer,
  showCheckbox = false,
  isSelected = false,
  onSelect,
  actions = { edit: true, delete: true, transfer: false },
  linkToProfile = true,
  onCardClick,
}) {
  const handleCardClick = (e) => {
    if (showCheckbox) {
      e.preventDefault();
      e.stopPropagation();
      onSelect?.(kid.id);
      return;
    }

    if (onCardClick) {
      e.preventDefault();
      e.stopPropagation();
      onCardClick(kid);
      return;
    }

    if (linkToProfile) {
      navigate(`/kids/${kid.id}`, {
        state: { kid },
      });
    }
  };

  const navigate = useNavigate();

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
        showCheckbox || onEdit ? "cursor-pointer" : ""
      } ${
        isSelected
          ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/25"
          : "border-slate-800"
      }`}
    >
      {/* Selection Checkbox */}
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

      {/* Action Buttons */}
      {!showCheckbox && (
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          {actions.delete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(kid);
              }}
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20 hover:text-red-200"
              title="Delete"
            >
              <FaTrash size={14} />
            </button>
          )}
          {actions.edit && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit?.(kid);
              }}
              className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-2 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200"
              title="Edit"
            >
              <FaEdit size={14} />
            </button>
          )}
          {actions.transfer && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTransfer?.(kid);
              }}
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200"
              title="Transfer"
            >
              <FaExchangeAlt size={14} />
            </button>
          )}
        </div>
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

  if (showCheckbox || !linkToProfile) {
    return cardContent;
  }
  return cardContent;
}
