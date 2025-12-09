// Icons import
import { CgProfile } from "react-icons/cg";
import { FaBirthdayCake, FaSchool, FaPhoneAlt } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";

import { useEffect, useState } from "react";
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

  // TODO find meaning
  const onModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        key={kid.id}
        className="border rounded shadow hover:shadow-lg transition-shadow bg-white p-4 flex flex-col items-center"
      >
        {/*Kids image */}
        <img
          src={profileIcon}
          alt={`${kid.name}'s photo`}
          className="w-full h-30 object-cover rounded mb-5"
        />
        {/*Kids name */}
        <div className="font-semibold flex items-center gap-1 text-xl">
          <CgProfile />
          {kid.name}
        </div>
        <div className="flex items-center m-2" onClick={openModal}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
            View Details
          </button>
        </div>
      </div>
      {/* TODO find meaning */}

      <KidDetailModal open={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-bold mb-4">{kid.name}</h2>
        <img
          src="profileIcon.png"
          alt={`${kid.name}'s photo`}
          className="w-full h-45 object-cover rounded mb-4"
        />
        {/*Kids birthday */}
        <div className="flex items-center gap-1 font-bold ">
          <FaBirthdayCake />
          {kid.birthday}
        </div>
        {/*Kids School */}
        <div className="text-gray-500 flex items-center gap-1">
          <FaSchool />
          {kid.school}
        </div>
        {/*Kids phone number */}
        <div className="flex items-center gap-1 font-semibold text-lg">
          <FaPhoneAlt />
          {kid.phone}
        </div>
        {/*Kids parent phone number */}
        <div className="flex items-center gap-1 font-semibold text-lg">
          <MdContactPhone />
          Parents No: {kid.parent_phone}
        </div>{" "}
      </KidDetailModal>
    </>
  );
}
