import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { navigation } from "../../../config/navigation.js";

export default function PastorDropdown() {
  return (
    <div className="group relative">
      {/* Dropdown Trigger */}
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="
          flex items-center gap-2
          rounded-full
          px-4 py-2
          text-sm font-semibold
          text-slate-300
          transition
          hover:bg-white/10
          hover:text-white
        "
      >
        Pastor Tools
        <ChevronDown
          size={16}
          className="
            transition-transform
            duration-200
            group-hover:rotate-180
          "
        />
      </motion.button>

      {/* Dropdown */}
      <div
        className="
    invisible
    absolute
    left-0
    top-12
    w-56
    translate-y-2
    rounded-2xl
    border
    border-white/10
    bg-[#111827]/95
    p-2
    opacity-0
    shadow-xl
    backdrop-blur-xl
    transition-all
    duration-200

    group-hover:visible
    group-hover:translate-y-0
    group-hover:opacity-100
  "
      >
        {navigation.pastor.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className="
              block
              rounded-xl
              px-4
              py-3
              text-sm
              font-semibold
              text-slate-300
              transition
              hover:bg-white/10
              hover:text-white
            "
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
