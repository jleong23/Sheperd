import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { navigation } from "../../../config/navigation.js";

export default function PastorDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
        flex items-center gap-2
        rounded-full
        px-4 py-2
        text-sm font-semibold
        text-slate-300
        hover:bg-white/10
       "
      >
        Pastor Tools
        <ChevronDown
          size={16}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="
        absolute top-12 left-0
        w-56
        rounded-2xl
        bg-[#111827]/95
        border border-white/10
        p-2
        shadow-xl
        backdrop-blur-xl
        "
          >
            {navigation.pastor.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="
           block rounded-xl px-4 py-3
           text-sm font-semibold
           text-slate-300
           hover:bg-white/10
           "
              >
                {label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
