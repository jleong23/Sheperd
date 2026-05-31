import { CgProfile } from "react-icons/cg";
import { FaBirthdayCake, FaSchool } from "react-icons/fa";
import KidStatusBadge from "../../ui/KidStatusBadge";
import KidFlagBadge from "../../ui/KidFlagBadge";

export default function KidDetails({
  name,
  birthday,
  school,
  status_code,
  baptised,
  sunday_regulars,
}) {
  const formattedBirthday = birthday
    ? new Date(birthday).toLocaleDateString("en-AU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No birthday added";

  return (
    <div className="flex w-full flex-col justify-center gap-3">
      <div className="flex items-center gap-2 text-xl font-bold text-white">
        <CgProfile className="text-indigo-400" />
        <span className="line-clamp-1">{name}</span>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-slate-400 sm:justify-start">
        <FaBirthdayCake className="shrink-0 text-pink-400" />
        <span className="line-clamp-1">{formattedBirthday}</span>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-slate-400 sm:justify-start">
        <FaSchool className="shrink-0 text-emerald-400" />
        <span className="line-clamp-1">{school || "No school added"}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
        <KidStatusBadge status={status_code} />

        {sunday_regulars && <KidFlagBadge flag="SUNDAY_REGULAR" />}

        {baptised && <KidFlagBadge flag="BAPTISED" />}
      </div>
    </div>
  );
}
