// Icons import
import { CgProfile } from "react-icons/cg";
import { FaBirthdayCake, FaSchool, FaPhoneAlt } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";

import { useState } from "react";
import KidDetailModal from "../ui/Modals/KidDetailModal";
import profileIcon from "../../assets/profileIcon.png";

export default function KidsCard({ kid }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        key={kid.id}
        className="border rounded shadow hover:shadow-lg transition-shadow bg-white p-4 flex gap-4 items-center"
      >
        {/* Kids Image */}
        <div className="flex-shrink-0 w-32 h-32">
          <img
            src={profileIcon} //! Remember to update this to show dynamic photos [profileIcon is static]
            alt={`${kid.name}'s photo`}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Kids Details */}
        <div className="flex flex-col gap-2">
          <div className="font-semibold flex items-center gap-1 text-xl">
            <CgProfile />
            {kid.name}
          </div>

          <div className="flex items-center gap-1 font-bold">
            <FaBirthdayCake />
            {kid.birthday}
          </div>

          <div className="text-gray-500 flex items-center gap-1">
            <FaSchool />
            {kid.school}
          </div>

          <div>
            <div className="flex items-center gap-1 font-semibold text-lg">
              <FaPhoneAlt />
              <a href={`tel:${kid.phone}`}>{kid.phone}</a>
            </div>

            <div className="flex items-center gap-1 font-semibold text-lg">
              <MdContactPhone />

              <a href={`tel:${kid.parent_phone}`}>
                Parents No: {kid.parent_phone || "N/A"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
