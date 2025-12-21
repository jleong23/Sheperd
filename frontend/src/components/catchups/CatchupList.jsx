import { mockCatchups } from "./mockCatchups";
import { useState } from "react";
import { CatchupCard } from "./CatchupCard";
import { CatchupModal } from "./CatchupModal";

export default function CatchupList() {
  const [selectedCatchup, setSelectedCatchup] = useState(null);

  const sortedCatchups = [...mockCatchups].sort(
    (a, b) =>
      new Date(b.catchupDate).getTime() - new Date(a.catchupDate).getTime()
  );

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Catchup History</h1>

      <div className="grid gap-4">
        {sortedCatchups.map((catchup) => (
          <CatchupCard
            key={catchup.catchupId}
            catchup={catchup}
            onClick={() => setSelectedCatchup(catchup)}
          />
        ))}
      </div>

      <CatchupModal
        catchup={selectedCatchup}
        onClose={() => setSelectedCatchup(null)}
      />
    </div>
  );
}
