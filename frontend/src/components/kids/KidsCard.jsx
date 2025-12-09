// Icons import
import { CgProfile } from "react-icons/cg";
import { FaBirthdayCake, FaSchool, FaPhoneAlt } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";

import { useEffect, useState } from "react";
import KidDetailModal from "../ui/Modals/KidDetailModal";

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
          src={kid.photo}
          alt={`${kid.name}'s photo`}
          className="w-full h-45 object-cover rounded mb-4"
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
          src={kid.photo}
          alt={`${kid.name}'s photo`}
          className="w-full h-45 object-cover rounded mb-4"
        />
      </KidDetailModal>
    </>
  );
}
