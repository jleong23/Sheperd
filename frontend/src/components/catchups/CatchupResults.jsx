import { CatchupCard } from "./CatchupCard";

export default function CatchupResults({ catchups, onSelect, onDelete }) {
  if (catchups.length === 0) {
    return <p className="text-gray-500">No matching catchups found.</p>;
  }

  return (
    <div className="grid gap-4">
      {catchups.map((catchup) => (
        <CatchupCard
          key={catchup.catchupid}
          catchup={catchup}
          onClick={() => onSelect(catchup)}
          onDeleted={() => onDelete(catchup.catchupid)}
        />
      ))}
    </div>
  );
}
