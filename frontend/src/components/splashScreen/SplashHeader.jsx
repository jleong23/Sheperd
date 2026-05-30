import { Link } from "react-router-dom";

export default function SplashHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-6 sm:px-6 sm:py-8">
      <Link to="/welcome" className="flex min-w-0 items-center gap-2 sm:gap-3">
        <img
          src="/dreamersLogo.png"
          alt="Dreamers"
          className="h-10 w-10 shrink-0 rounded-full sm:h-12 sm:w-12"
        />

        <span className="truncate text-2xl font-bold text-indigo-400 sm:text-xl">
          Sheperd
        </span>
      </Link>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <Link
          to="/login"
          className="text-sm text-slate-300 hover:text-white sm:text-base"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500 sm:px-5"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
