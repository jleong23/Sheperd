import { useState } from "react";

export default function AddKids({ onKidAdded }) {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [school, setSchool] = useState("");
  const [phone, setPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [photo, setPhoto] = useState("");

  const handleAddKid = async () => {
    if (!name) return alert("Enter a name");

    try {
      const res = await fetch("http://localhost:4000/kids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          birthday: birthday || null,
          school: school || "",
          phone: phone || "",
          parent_phone: parentPhone || "",
          photo: photo || "https://pngtree.com/so/profile-icon", // default stock photo
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Added kid: ${data.name}`);
        onKidAdded?.(); // refresh kids list
        setName("");
        setBirthday("");
        setSchool("");
        setPhone("");
        setParentPhone("");
        setPhoto("");
        // refreshKids(); // optional callback to reload kids list
      } else {
        alert(data.error || "Failed to add kid");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding kid");
    }
  };

  return (
    <div className="space-y-2 p-4 border rounded shadow-md bg-white">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2 py-1 w-full"
      />
      <input
        type="date"
        placeholder="Birthday"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        className="border px-2 py-1 w-full"
      />
      <input
        type="text"
        placeholder="School"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
        className="border px-2 py-1 w-full"
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border px-2 py-1 w-full"
      />
      <input
        type="text"
        placeholder="Parent Phone"
        value={parentPhone}
        onChange={(e) => setParentPhone(e.target.value)}
        className="border px-2 py-1 w-full"
      />
      <input
        type="text"
        placeholder="Photo URL (optional)"
        value={photo}
        onChange={(e) => setPhoto(e.target.value)}
        className="border px-2 py-1 w-full"
      />
      <button
        onClick={handleAddKid}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Kid
      </button>
    </div>
  );
}
