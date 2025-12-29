export default function AddCatchup({ onClick }) {
  return (
    <div className="mb-4">
      <button
        onClick={onClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Add Catchup
      </button>
    </div>
  );
}
