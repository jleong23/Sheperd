import { useState } from "react";

export default function AddKids() {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [school, setSchool] = useState("");
  const [number, setNumber] = useState("");
  const [parentNumber, setParentNumber] = useState("");

  const handleAddKids = async () => {
    if (!name) return alert("Enter a name");
    const res = await fetch("http://localhost:4000/kids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        birthday,
        school,
        number,
        parentNumber,
      }),
    });

    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) {
      refreshAttendance();
    }
  };

  const handleDeleteKids = async () => {
    if (!name) return alert("Enter a name");

    if (
      !confirm(`Are you sure you want to delete Year ${year} , Term ${term}? `)
    )
      return;

    const res = await fetch("http://localhost:4000/kids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        birthday,
        school,
        number,
        parentNumber,
      }),
    });

    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) {
      refreshAttendance();
    }
  };
}
