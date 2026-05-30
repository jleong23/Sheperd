// frontend/src/pages/Signup.jsx
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthForm } from "../../hooks/useAuthForm";
import { signup as supabaseSignup } from "../../api/auth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import AuthForm from "./AuthForm.jsx";

export default function SignupPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSignup = async ({ userName, email, password }) => {
    try {
      const data = await supabaseSignup({ userName, email, password });

      if (data.user && !data.session) {
        toast.success(
          "Account created! Please check your email to verify your account.",
        );
        navigate("/login");
      } else if (data.session) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create account");
    }
  };

  const { values, error, handleChange, handleSubmit } =
    useAuthForm(handleSignup);

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
          to="/login"
          className="text-sm font-medium text-slate-300 hover:text-white"
        >
          Login
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
            ✨ Start managing your youth ministry
          </div>

          <h1 className="max-w-xl text-5xl font-extrabold tracking-tight">
            Create your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sheperd
            </span>{" "}
            account.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
            Track kids, attendance, events, catchups, and new people in one
            simple dashboard built for leaders.
          </p>

          <div className="mt-10 grid max-w-lg gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="font-semibold text-white">👥 Kids Management</h3>
              <p className="mt-2 text-sm text-slate-400">
                Keep important youth information organised and easy to access.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="font-semibold text-white">
                ✅ Attendance Tracking
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Record weekly attendance and help your team stay aligned.
              </p>
            </div>
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
              <h2 className="text-3xl font-bold">Create your account</h2>
              <p className="mt-2 text-sm text-slate-400">
                Join Sheperd and start managing your ministry.
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
              buttonText="Sign up"
              fields={[
                {
                  name: "userName",
                  label: "User Name",
                  required: true,
                  onChange: handleChange,
                  placeholder: "Enter your name",
                },
                {
                  name: "email",
                  type: "email",
                  label: "Email address",
                  required: true,
                  onChange: handleChange,
                  placeholder: "you@example.com",
                },
                {
                  name: "password",
                  type: "password",
                  label: "Password",
                  required: true,
                  onChange: handleChange,
                  placeholder: "Create a password",
                },
              ]}
            />

            <p className="mt-8 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-indigo-400">
                Log in
              </Link>
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
