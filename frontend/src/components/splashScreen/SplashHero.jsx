import { Link } from "react-router-dom";

export default function SplashHero() {
  return (
    <section className="flex min-h-[65vh] flex-col items-center justify-center text-center">
      <div className="mb-6 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
        ✨ Youth Ministry Management Platform
      </div>

      <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl">
        Manage Your{" "}
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Youth Ministry
        </span>{" "}
        With Confidence.
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
        Keep track of kids, attendance, events, catchups, and new people in one
        simple dashboard built for leaders.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          to="/signup"
          className="rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 hover:bg-slate-300"
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="rounded-full bg-slate-800 px-8 py-4 text-sm font-bold text-white hover:bg-slate-700"
        >
          Login
        </Link>
      </div>
    </section>
  );
}
