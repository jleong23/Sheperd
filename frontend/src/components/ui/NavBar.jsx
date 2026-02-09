import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { X, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function ProfileAvatar({ email }) {
  const initial = email?.charAt(0).toUpperCase() || "?";

  return (
    <div
      className="flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold
                    w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
    >
      {initial}
    </div>
  );
}

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/attendance", label: "Attendance" },
    { to: "/kid-list", label: "Kid List" },
    { to: "/events", label: "Events" },
    { to: "/catchups", label: "Catchups" },
    { to: "/new-people", label: "New People" },
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
    <nav className="bg-black fixed w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <img
              src="/dreamersLogo.png"
              alt="Dreamers Logo"
              className="w-14 h-14 rounded-full"
            />
            <span className="text-3xl font-bold text-white">
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

          {/* Desktop Profile */}
          {user && (
            <div
              ref={profileRef}
              className="hidden lg:relative lg:flex items-center gap-3"
            >
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-3 text-white hover:text-blue-400"
              >
                <ProfileAvatar email={user.email} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-48 rounded-md bg-gray-800 shadow-lg">
                  <p className="px-4 py-2 text-sm text-gray-400">
                    {user.email}
                  </p>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMenuOpen((m) => !m)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu — ONE ITEM PER ROW */}
      {menuOpen && (
        <div className="lg:hidden bg-black px-6 py-6">
          <ul className="flex flex-col gap-4">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block w-full py-2 active:scale-95 ${linkClass({
                      isActive,
                    })}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {user && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400 mb-3">{user.email}</div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
