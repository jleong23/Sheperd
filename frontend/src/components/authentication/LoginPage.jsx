import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthForm } from "../../hooks/useAuthForm";
import { login as supabaseLogin } from "../../api/auth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import AuthForm from "./AuthForm.jsx";

export default function LoginPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleLogin = async ({ email, password }) => {
    try {
      const { data } = await supabaseLogin({ email, password });

      if (data.session) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password");
    }
  };

  const { values, error, handleChange, handleSubmit } =
    useAuthForm(handleLogin);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link to="/welcome" className="flex items-center gap-3">
          <img
            src="/dreamersLogo.png"
            alt="Dreamers"
            className="h-10 w-10 rounded-full"
          />
          <span className="text-xl font-bold text-indigo-400">Sheperd</span>
        </Link>

        <Link
          to="/signup"
          className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold hover:bg-indigo-500"
        >
          Sign up
        </Link>
      </header>

      <main className="mx-auto grid min-h-[75vh] max-w-6xl items-center gap-12 px-6 py-10 lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <div className="mb-6 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            👋 Welcome back
          </div>

          <h1 className="max-w-xl text-5xl font-extrabold tracking-tight">
            Sign in to{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sheperd
            </span>
            .
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
            Continue managing kids, attendance, events, catchups, and follow-ups
            from your ministry dashboard.
          </p>

          <div className="mt-10 grid max-w-lg gap-4">
            <motion.div
              whileHover={{
                y: -6,
                scale: 1.02,
                boxShadow: "0px 0px 30px rgba(59,130,246,0.25)",
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
            >
              <h3 className="font-semibold text-white">📊 Ministry Overview</h3>
              <p className="mt-2 text-sm text-slate-400">
                Quickly access the information your team needs each week.
              </p>
            </motion.div>

            <motion.div
              whileHover={{
                y: -6,
                scale: 1.02,
                boxShadow: "0px 0px 30px rgba(168,85,247,0.25)",
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
            >
              <h3 className="font-semibold text-white">✅ Stay Organised</h3>
              <p className="mt-2 text-sm text-slate-400">
                Keep attendance, people, and events in one clear system.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto w-full max-w-md"
        >
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold">Sign in</h2>
              <p className="mt-2 text-sm text-slate-400">
                Welcome back. Please enter your details.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <AuthForm
              values={values}
              error={error}
              onSubmit={handleSubmit}
              buttonText="Sign in"
              fields={[
                {
                  name: "email",
                  type: "email",
                  label: "Email address",
                  required: true,
                  autoComplete: "email",
                  onChange: handleChange,
                  placeholder: "you@example.com",
                },
                {
                  name: "password",
                  type: "password",
                  label: "Password",
                  required: true,
                  autoComplete: "current-password",
                  onChange: handleChange,
                  placeholder: "Enter your password",
                },
              ]}
            />

            <p className="mt-8 text-center text-sm text-slate-400">
              Don’t have an account?{" "}
              <Link to="/signup" className="font-semibold text-indigo-400">
                Sign up
              </Link>
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
