import { Link } from "react-router-dom";

export default function SplashHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
      <div className="flex items-center gap-3">
        <img
          src="/dreamersLogo.png"
          alt="Dreamers"
          className="h-12 w-15 rounded-full"
        />
        <span className="text-3xl font-bold text-indigo-400">Sheperd</span>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm text-slate-300 hover:text-white">
          Login
        </Link>

        <Link
          to="/signup"
          className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold hover:bg-indigo-500"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
