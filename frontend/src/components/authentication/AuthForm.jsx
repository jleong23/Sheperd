import { motion } from "framer-motion";

export default function AuthForm({
  fields,
  onSubmit,
  error,
  buttonText,
  values,
}) {
  return (
    <>
      {error && (
        <div className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        {fields.map(({ label, ...input }) => (
          <div key={input.name}>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              {label}
            </label>

            <input
              {...input}
              value={values[input.name] || ""}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        ))}

        <motion.button
          whileHover={{
            y: -3,
            scale: 1.02,
            boxShadow: "0px 0px 30px rgba(99,102,241,0.35)",
          }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-500"
        >
          {buttonText}
        </motion.button>
      </form>
    </>
  );
}
