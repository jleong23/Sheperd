import { CgProfile } from "react-icons/cg";
import { FaBirthdayCake, FaSchool } from "react-icons/fa";
import { GrStatusDisabled } from "react-icons/gr";
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
  return (
    <div className="flex flex-col justify-center gap-1 sm:gap-2 w-full">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        <CgProfile className="text-blue-600" /> {name}
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <FaBirthdayCake className="text-yellow-500" />
        {new Date(birthday).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <FaSchool className="text-green-500" /> {school}
      </div>
      <div className="flex items-center gap-2 text-gray-700 flex-wrap">
        <KidStatusBadge status={status_code} />
        {sunday_regulars && <KidFlagBadge flag="SUNDAY_REGULAR" />}
        {baptised && <KidFlagBadge flag="BAPTISED" />}
      </div>
    </div>
  );
}
