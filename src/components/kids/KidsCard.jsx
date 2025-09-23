import { CgProfile } from "react-icons/cg";
import { FaBirthdayCake, FaSchool, FaPhoneAlt } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";
export default function KidsCard({ kid }) {
  return (
    <>
      <div
        key={kid.id}
        className="border rounded shadow hover:shadow-lg transition-shadow bg-white p-4 flex flex-col items-center"
      >
        {/*Kids image */}
        <img
          src={kid.photo}
          alt="Ashton Koh's photo"
          className="w-full h-45 object-cover rounded mb-4"
        />
        {/*Kids name */}
        <div className="font-semibold flex items-center gap-1">
          <CgProfile />
          {kid.name}
        </div>
        {/*Kids birthday */}
        <div className="flex items-center gap-1">
          <FaBirthdayCake />
          {kid.birthday}
        </div>
        {/*Kids School */}
        <div className="text-gray-500 flex items-center gap-1">
          <FaSchool />
          {kid.school}
        </div>{" "}
        <div className="flex items-center gap-1">
          <FaPhoneAlt />
          {kid.phone}
        </div>
        {/*Kids phone number */}
        <div className="flex items-center gap-1">
          <MdContactPhone />
          Parents: {kid.parentPhone}
        </div>{" "}
        {/*Kids parent phone number */}
      </div>
    </>
  );
}
