import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { X, Menu } from "lucide-react";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/attendance", label: "Attendance" },
    { to: "/kid-list", label: "Kid List" },
    { to: "/events", label: "Events" },
    { to: "/catchups", label: "Catchups" },
  ];

  const linkClass = ({ isActive }) =>
    `relative inline-block text-white font-semibold text-lg
   transition-all duration-200 ease-out
   hover:-translate-y-1 hover:text-blue-400
   ${
     isActive
       ? "text-blue-500 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-blue-500"
       : ""
   }`;

  return (
    <nav className="bg-black shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-4">
            <img
              src={"/dreamersLogo.png"}
              alt="Dreamers Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
            />
            <span className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
              Dreamers Youth
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex gap-10">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={linkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-black shadow-md overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-4 px-4">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
