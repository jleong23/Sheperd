export default function FormActions({ onCancel, onSubmit, loading }) {
  return (
    <div className="mt-8 flex justify-end gap-4">
      <button
        onClick={onCancel}
        disabled={loading}
        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
      >
        Cancel
      </button>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="px-6 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-60 relative"
      >
        {loading && (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin absolute left-3"></div>
        )}
        Add Kid
      </button>
    </div>
  );
}
