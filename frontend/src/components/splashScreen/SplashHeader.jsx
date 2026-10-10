import { Link } from "react-router-dom";

export default function SplashHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link to="/welcome" className="flex min-w-0 items-center gap-3">
          <img
            src="/dreamersLogo.png"
            alt="Dreamers"
            className="h-10 w-10 shrink-0 rounded-full ring-1 ring-white/10"
          />
          <span className="truncate text-lg font-bold tracking-tight text-white sm:text-xl">
            Sheperd
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
