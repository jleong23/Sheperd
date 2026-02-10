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
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {fields.map(({ label, ...input }) => (
          <div key={input.name}>
            <label className="block text-sm font-medium text-gray-900">
              {label}
            </label>
            <div className="mt-2">
              <input
                {...input}
                value={values[input.name] || ""}
                className="block w-full rounded-md bg-white px-3 py-2.5 text-gray-900 outline outline-1 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {buttonText}
        </button>
      </form>
    </>
  );
}
