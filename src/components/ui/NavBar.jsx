// NavBar.jsx
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { X, Menu } from "lucide-react";
import logo from "../../assets/logo.jpg";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // NavBar Links
  const links = [
    { to: "/", label: "Home" },
    { to: "/attendance", label: "Attendance" },
    { to: "/kid-list", label: "Kid List" },
    { to: "/events", label: "Events" },
    { to: "/new-people", label: "New People" },
  ];

  const linkClass = ({ isActive }) =>
    `inline-block transition-transform duration-300 text-xl ${
      isActive ? "text-blue-500" : ""
    } hover:-translate-y-1 hover:scale-80`;

  return (
    <nav className=" text-black md:p-6 relative z-50 font-semibold bg-slate-200 rounded-lg ">
      <div className="flex justify-between items-center">
        {/* Hamburger Button (shown below lg) */}
        <button
          className="lg:hidden p-2 rounded hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo (center on small screens) */}
        <Link
          to="/"
          className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none flex-shrink-0"
        >
          <span className="flex items-center gap-3">
            <img
              src={logo}
              alt="Dreamers logo"
              className="w-24 h-20 rounded-full "
            />
            <div className="font-dm text-3xl font-bold tracking-wider md:text-4xl">
              Dreamers Youth
            </div>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex gap-8 ml-auto mr-6">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} className={linkClass}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`absolute top-full left-0 w-full bg-slate-200 lg:hidden shadow-lg z-50 overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-4 p-4">
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
