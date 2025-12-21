import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { X, Menu } from "lucide-react";
import logo from "../../assets/logo.jpg";

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
    `block text-gray-800 font-semibold text-lg transition-colors duration-200 hover:text-blue-500 ${
      isActive ? "text-blue-600" : ""
    }`;

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-4">
            <img
              src={logo}
              alt="Dreamers Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
            />
            <span className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-wide">
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
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white shadow-md overflow-hidden transition-all duration-300 ${
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
