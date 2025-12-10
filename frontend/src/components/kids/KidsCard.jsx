// Icons import
import { CgProfile } from "react-icons/cg";
import { FaBirthdayCake, FaSchool, FaPhoneAlt } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";
import profileIcon from "../../assets/profileIcon.png";

export default function KidsCard({ kid, onKidDeleted }) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${kid.name}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:4000/kids/${kid.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete kid");
        return;
      }

      alert(`${kid.name} has been deleted Successfully`);
      onKidDeleted?.(); // Notify parent to refresh the kidsList
    } catch (err) {
      console.error(err);
      alert("Error Deleting Kid!");
    }
  };
  return (
    <>
      <div
        key={kid.id}
        className="border rounded shadow hover:shadow-lg transition-shadow bg-white p-4 flex gap-4 items-center mt-3"
      >
        {/* Kids Image */}
        <div className="flex-shrink-0 w-32 h-32">
          <img
            src={profileIcon} //! Remember to update this to show dynamic photos [profileIcon is static]
            alt={`${kid.name}'s photo`}
            className="w-full h-full object-cover rounded"
          />
          <button
            onClick={handleDelete}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
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
