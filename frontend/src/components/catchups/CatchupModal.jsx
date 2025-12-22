export function CatchupModal({ catchup, onClose }) {
  if (!catchup) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-4 flex justify-between">
          <h2 className="text-xl font-semibold">Catchup Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </header>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Catchup ID:</strong> {catchup.catchupId}
          </p>
          <p>
            <strong>Kid:</strong> {catchup.kidName} (ID: {catchup.kidId})
          </p>
          <p>
            <strong>Date:</strong> {catchup.catchupDate}
          </p>
          <p>
            <strong>Time:</strong> {catchup.startTime} – {catchup.endTime}
          </p>
          <p>
            <strong>Purpose:</strong> {catchup.purpose}
          </p>

          <div>
            <strong>Comments:</strong>
            <p className="mt-1 whitespace-pre-wrap text-gray-700">
              {catchup.comments}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
