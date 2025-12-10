import profileIcon from "../../../assets/profileIcon.png";
export function KidProfileImage({ photo, name }) {
  return (
    <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28">
      <img
        src={profileIcon}
        alt={`${name}'s photo`}
        className="w-full h-full object-cover rounded-lg border"
      />
    </div>
  );
}
