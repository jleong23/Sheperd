import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { X, Menu } from "lucide-react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { navigation } from "../../../config/navigation.js";
import PastorDropdown from "./PastorDropdown";

function ProfileAvatar({ email }) {
  const initial = email?.charAt(0).toUpperCase() || "?";

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.45)]">
      {initial}
    </div>
  );
}

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const isPastor = profile?.role === "pastor";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const linkClass = ({ isActive }) =>
    `relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "bg-blue-500/15 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.25)]"
        : "text-slate-300 hover:bg-white/10 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
    }`;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#0f172a]/85 shadow-lg backdrop-blur-xl"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/dreamersLogo.png"
              alt="Dreamers Logo"
              className="h-11 w-11 rounded-xl object-cover shadow-[0_0_20px_rgba(59,130,246,0.25)]"
            />

            <span className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              Dreamers{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Youth
              </span>
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden items-center gap-2 lg:flex">
            {navigation.main.map(({ to, label }) => (
              <motion.li
                key={to}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                <NavLink to={to} className={linkClass}>
                  {label}
                </NavLink>
              </motion.li>
            ))}

            {isPastor && <PastorDropdown />}
          </ul>

          {/* Desktop Profile */}
          {user && (
            <div
              ref={profileRef}
              className="relative hidden items-center gap-3 lg:flex"
            >
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                <ProfileAvatar email={user.email} />
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-14 w-56 rounded-2xl border border-white/10 bg-[#111827]/95 p-3 shadow-[0_0_30px_rgba(59,130,246,0.2)] backdrop-blur-xl"
                  >
                    <p className="mb-2 truncate px-3 py-2 text-sm text-slate-400">
                      {user.email}
                    </p>

                    <button
                      onClick={handleLogout}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white shadow-md transition hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] lg:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu — ONE ITEM PER ROW */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-[#0f172a]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="px-4 py-5">
              <ul className="flex flex-col gap-2">
                {navigation.main.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `block rounded-xl px-4 py-3 text-base font-semibold transition ${
                          isActive
                            ? "bg-blue-500/15 text-blue-300"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}

                {isPastor && (
                  <>
                    <div className="my-3 border-t border-white/10" />

                    <p className="px-4 text-xs uppercase text-slate-500">
                      Pastor Tools
                    </p>

                    {navigation.pastor.map(({ to, label }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setMenuOpen(false)}
                        className="
          block rounded-xl px-4 py-3
          text-base font-semibold
          text-indigo-300
          hover:bg-white/10
        "
                      >
                        {label}
                      </NavLink>
                    ))}
                  </>
                )}
              </ul>

              {user && (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="mb-3 truncate text-sm text-slate-400">
                    {user.email}
                  </p>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl bg-red-500/10 py-3 font-semibold text-red-300 transition hover:bg-red-500/20"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
