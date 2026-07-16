import { Baby } from "lucide-react";
import KidManagement from "../../../components/kids/KidManagement.jsx";

export default function LeaderKidsPanel({
  kids,
  onKidUpdated,
  onTransferKid,
  onKidDeleted,
}) {
  if (kids.length === 0) {
    return (
      <section className="mt-8 rounded-2xl bg-white p-6 text-center shadow-sm">
        <Baby className="mx-auto mb-3 text-slate-300" size={36} />
        <p className="font-semibold text-slate-700">No kids found</p>
        <p className="text-sm text-slate-400">
          This leader does not have any assigned kids yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">Leader Kids</h2>
        <p className="text-sm text-slate-500">
          Kids currently assigned to this leader.
        </p>
      </div>

      <KidManagement
        kids={kids}
        onKidUpdated={onKidUpdated}
        onTransferKid={onTransferKid}
        onKidDeleted={onKidDeleted}
      />
    </section>
  );
}
