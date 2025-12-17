export default function DeleteEvent({ eventId, onDeleted }) {
  const handleClick = () => {
    if (window.confirm("Delete this Event?")) {
      onDeleted(eventId);
    }
  };
  return (
    <button
      onClick={handleClick}
      className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded text-sm"
    >
      Delete
    </button>
  );
}
