export function CatchupCard({ catchup, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border p-4 shadow-sm transition hover:shadow-md hover:bg-gray-50"
    >
      <h2 className="font-bold">{catchup.kidname}</h2>
      <p>Status: {catchup.kidstatus}</p>
      <h5 className="text-sm">Kid ID: {catchup.kidid}</h5>
      <p className="font-medium text-gray-800">
        Purpose: {catchup.catchuppurpose}
      </p>

      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
        Comments: {catchup.catchupcomments}
      </p>
      <div className="flex justify-between mb-1">
        <span className="font-semibold">
          {new Date(catchup.catchupdate).toLocaleDateString()}
        </span>
        <span className="text-sm text-gray-500">
          {catchup.catchupstarttime} – {catchup.catchupendtime}
        </span>
      </div>
    </div>
  );
}
