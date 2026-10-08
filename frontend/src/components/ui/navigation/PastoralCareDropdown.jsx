import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { navigation } from "../../../config/navigation.js";

export default function PastoralCareDropdown() {
  return (
    <div className="group relative">
      {/* Dropdown Trigger */}
      <button
        className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold
                   text-slate-300 transition-all duration-300
                   hover:bg-white/10 hover:text-white"
      >
        Pastoral Care
        <ChevronDown
          size={16}
          className="transition-transform duration-200 group-hover:rotate-180"
        />
      </button>

      {/* Dropdown */}
      <div
        className="invisible absolute left-0 top-[calc(100%+8px)] z-50 w-48
                   translate-y-2 rounded-2xl border border-white/10
                   bg-[#111827]/95 p-2 opacity-0
                   shadow-[0_0_30px_rgba(59,130,246,0.2)]
                   backdrop-blur-xl
                   transition-all duration-200
                   group-hover:visible group-hover:translate-y-0
                   group-hover:opacity-100"
      >
        {navigation.pastoralCare.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-blue-500/15 text-blue-300"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
