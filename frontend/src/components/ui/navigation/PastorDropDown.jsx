import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { navigation } from "../../../config/navigation.js";
import { useClickOutside } from "../../../hooks/useClickOutside.js";

export default function PastorDropdown() {
  const [open, setOpen] = useState(false);
  const pastorRef = useRef(null);

  // Close dropdown when clicking outside
  useClickOutside(pastorRef, () => setOpen(false));

  return (
    <div ref={pastorRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
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
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.95,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              absolute
              left-0
              top-12
              w-56
              rounded-2xl
              border
              border-white/10
              bg-[#111827]/95
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
