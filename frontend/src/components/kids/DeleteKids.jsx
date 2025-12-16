export default function DeleteKids({
  bulkMode,
  selected,
  enterBulkMode,
  cancelSelection,
  handleDelete,
}) {
  return (
    <div className="flex gap-3 mb-6 justify-center">
      <button
        onClick={handleDelete}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-7 py-3 rounded-xl shadow-lg transition duration-200 transform hover:-translate-y-0.5"
      >
        {bulkMode
          ? selected.length > 0
            ? `Delete Selected (${selected.length})`
            : "Delete Users"
          : "Delete Users"}
      </button>
      {/* Cancel button shows only in bulk mode */}
      {bulkMode && (
        <button
          onClick={cancelSelection}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg shadow-sm transition duration-200 transform hover:-translate-y-0.5"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
