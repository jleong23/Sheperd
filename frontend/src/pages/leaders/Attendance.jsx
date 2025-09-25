import { useState, useEffect } from "react";
import axios from "axios";
import kidsData from "../../data/kids.json";
import AttendanceList from "../../components/attendance/AttendanceList.jsx";
import AttendanceSort from "../../components/attendance/AttendanceSort.jsx";

export default function Attendance() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [allAttendance, setAllAttendance] = useState([]);
  const [currentAttendance, setCurrentAttendance] = useState([]);

  // Fetch all attendance once (for dropdowns)
  useEffect(() => {
    axios
      .get("http://localhost:4000/attendance")
      .then((res) => {
        console.log("All Attendance Data:", res.data); // <-- Add this line
        setAllAttendance(res.data);
      })
      .catch((err) => console.error("Failed to fetch attendance:", err));
  }, []);

  // Fetch filtered attendance when year + term selected
  useEffect(() => {
    if (!selectedYear || !selectedTerm) return;

    const filtered = allAttendance
      .filter((a) => {
        const year = new Date(a.created_at).getFullYear();
        return year === Number(selectedYear) && a.term === Number(selectedTerm);
      })
      .map((record) => {
        const kid = kidsData.find((k) => k.id === record.kidid);
        return {
          ...record,
          name: kid ? kid.name : `Unknown (ID: ${record.kidid})`,
          photo: kid ? kid.photo : null,
        };
      })
      .sort((a, b) => b.week - a.week);

    setCurrentAttendance(filtered);
  }, [selectedYear, selectedTerm, allAttendance]);

  // Toggle attendance
  const toggleAttendance = async (kidId, week) => {
    const record = currentAttendance.find(
      (r) => r.kidId === kidId && r.week === week
    );
    if (!record) return;

    try {
      const updated = await axios.patch(
        `http://localhost:4000/attendance/${record.id}`,
        {
          present: !record.present,
          reason: record.reason || "",
        }
      );

      setCurrentAttendance((prev) =>
        prev.map((r) =>
          r.id === updated.data.id ? { ...r, present: updated.data.present } : r
        )
      );
    } catch (err) {
      console.error("Failed to update attendance:", err);
    }
  };

  // Generate dropdown options
  const availableYears = Array.from(
    new Set(allAttendance.map((a) => new Date(a.created_at).getFullYear()))
  ).sort((a, b) => b - a);

  const availableTerms = selectedYear
    ? Array.from(
        new Set(
          allAttendance
            .filter(
              (a) => new Date(a.created_at).getFullYear() === selectedYear
            )
            .map((a) => a.term)
        )
      ).sort((a, b) => a - b)
    : [];

  return (
    <div className="p-8">
      <AttendanceSort
        selectedYear={selectedYear}
        selectedTerm={selectedTerm}
        availableYears={availableYears}
        availableTerms={availableTerms}
        onYearChange={(year) => {
          setSelectedYear(year);
          setSelectedTerm(null); // reset term when year changes
        }}
        onTermChange={setSelectedTerm}
        hideWeek={true}
      />

      {selectedYear && selectedTerm ? (
        currentAttendance.length > 0 ? (
          <AttendanceList
            currentAttendance={currentAttendance}
            onToggleAttendance={toggleAttendance}
          />
        ) : (
          <p className="text-center mt-8 text-gray-500">
            No attendance found for selected Year and Term.
          </p>
        )
      ) : (
        <p className="text-center mt-8 text-gray-500">
          Please select Year and Term.
        </p>
      )}
    </div>
  );
}
