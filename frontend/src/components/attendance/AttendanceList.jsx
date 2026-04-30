/**
 * AttendanceList Page
 * ---------------------------------------------------
 * Main attendance management page.
 *
 * Responsibilities:
 * - Fetch attendance + kids data from backend
 * - Manage selected year and term filters
 * - Merge kid info into attendance records
 * - Handle attendance status updates
 * - Handle attendance reason updates
 * - Handle Excel import functionality
 * - Pass processed data into child UI components
 *
 * This acts as the State manager + business logic layer for the Attendance feature.
 */

import { useState, useEffect } from "react";
import AttendanceResult from "../../components/attendance/AttendanceResult.jsx";
import AttendanceSort from "../../components/attendance/AttendanceSort.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import {
  addBulkAttendance,
  getAttendance,
  updateAttendance,
} from "../../api/attendance.js";
import { fetchKids } from "../../api/kids.js";

export default function AttendanceList() {
  // ---------------------------------------------------
  // State Management
  // ---------------------------------------------------
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [allAttendance, setAllAttendance] = useState([]);
  const [currentAttendance, setCurrentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kids, setKids] = useState([]);

  // -----------------------------
  // Fetch ALL attendance records and kids
  // -----------------------------
  const fetchAllAttendance = async (newRecords) => {
    if (newRecords) {
      /**
       * Normalise inconsistent naming:
       * backend = kidid
       * frontend = kidId
       */
      const normalizedNewRecords = newRecords.map((r) => ({
        ...r,
        kidId: r.kidid ?? r.kidId,
      }));

      setAllAttendance((prev) => {
        // Merge old + new records
        const merged = [...prev, ...normalizedNewRecords];
        // Remove duplicates based on ID
        const unique = merged.filter(
          (v, i, a) => a.findIndex((x) => x.id === v.id) === i,
        );
        return unique;
      });
      return;
    }

    // API Request: GET /attendance?year=...&term...
    try {
      const data = await getAttendance(selectedYear, selectedTerm);
      if (!Array.isArray(data)) {
        console.error("Attendance is not an array:", data);
        return;
      }
      // Normalise naming consistency
      const normalized = data.map((r) => ({
        ...r,
        kidId: r.kidid ?? r.kidId,
      }));
      setAllAttendance(normalized);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    }
  };

  // ---------------------------------------------------
  // Initial page load
  // Fetch attendance + kids once
  // ---------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllAttendance(); // Fetch Attendance records
      try {
        const data = await fetchKids();
        setKids(data);
      } catch (err) {
        console.error("Failed to fetch kids:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // empty dependency array = runs ONCE when page loads

  // -----------------------------
  // Auto-select latest available year
  // -----------------------------
  useEffect(() => {
    /**
     * Only auto-select if:
     * - attendance exists
     * - user hasn't selected year yet
     */
    if (allAttendance.length > 0 && !selectedYear) {
      const latestYear = Math.max(...allAttendance.map((a) => a.year)); // find highest year value (latest year)
      setSelectedYear(latestYear);
    }
  }, [allAttendance, selectedYear]);

  // -----------------------------
  // Auto-select latest term for selected year
  // -----------------------------
  useEffect(() => {
    if (selectedYear) {
      // Get all terms inside selected year
      const terms = allAttendance
        .filter((a) => a.year === selectedYear)
        .map((a) => a.term);
      if (terms.length > 0) {
        // Select highest/latest term
        setSelectedTerm(Math.max(...terms));
      }
    }
  }, [selectedYear]);

  // -----------------------------
  // Filter attendance by year + term
  // -----------------------------
  useEffect(() => {
    // wait until required data exists
    if (!selectedYear || !selectedTerm || kids.length === 0) return;

    // Keep ONLY selected year + term
    const filtered = allAttendance
      .filter(
        (a) =>
          a.year === Number(selectedYear) && a.term === Number(selectedTerm),
      )
      // Merge kid info into attendance records
      .map((record) => {
        // Find matching kid profile
        const kid = kids.find(
          (k) => Number(k.id) === Number(record.kidId ?? record.kidid),
        );
        return {
          ...record,
          // Use kid name if found
          name: kid
            ? kid.name
            : `Unknown (ID: ${record.kidId ?? record.kidid})`,
          // Attach kid profile photo
          photo: kid?.photo ?? null,
        };
      })
      // Sort newest week first
      .sort((a, b) => b.week - a.week);

    setCurrentAttendance(filtered);
  }, [selectedYear, selectedTerm, allAttendance, kids]);

  // -----------------------------
  // Change Attendance Status
  // -----------------------------
  const handleStatusChange = async (recordId, newStatus) => {
    // Find record being updated
    const record = currentAttendance.find((r) => r.id === recordId);
    if (!record) return;

    try {
      // PATCH /attendance/:id
      const updated = await updateAttendance(recordId, { status: newStatus });
      // Sync updated record into local state
      updateAttendanceRecord(updated);
    } catch (err) {
      console.error("Failed to update attendance:", err);
    }
  };

  // -----------------------------
  // Reason Handlers (frontend only until submits)
  // -----------------------------
  const handleReasonChange = (recordId, reason) => {
    setCurrentAttendance((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, reason } : r)),
    );
  };

  // ---------------------------------------------------
  // Save & submit attendance reason to backend
  // ---------------------------------------------------
  const handleReasonSubmit = async (recordId) => {
    const record = currentAttendance.find((r) => r.id === recordId);
    if (!record) return;

    try {
      const updated = await updateAttendance(recordId, {
        reason: record.reason,
      });
      updateAttendanceRecord(updated);
      alert(`Reason for ${record.name} updated!`);
    } catch (err) {
      console.error("Failed to update reason:", err);
      alert("Failed to update reason.");
    }
  };

  // -----------------------------
  // Update attendance record everywhere
  // -----------------------------
  const updateAttendanceRecord = (updatedRecord) => {
    const kidId = updatedRecord.kidid ?? updatedRecord.kidId;
    // Find kid profile for extra info
    const kid = kids.find((k) => Number(k.id) === Number(kidId));

    // Rebuild full frontend-friendly record
    const fullRecord = {
      ...updatedRecord,
      kidId,
      name: kid ? kid.name : `Unknown (ID: ${kidId})`,
      photo: kid?.photo ?? null,
    };

    // Reusable state update helper
    const updateState = (setter) =>
      setter((prev) =>
        prev.map((r) => (r.id === fullRecord.id ? fullRecord : r)),
      );

    updateState(setAllAttendance);
    updateState(setCurrentAttendance);
  };

  // ---------------------------------------------------
  // Transform imported Excel rows into backend-compatible format
  // ---------------------------------------------------
  const transformData = (rows, kids) => {
    return (
      rows
        .map((row) => {
          if (!row.name) return null;

          // Match Excel row name with kid database
          const kid = kids.find(
            (k) =>
              k.name?.trim().toLowerCase() === row.name.trim().toLowerCase(),
          );

          if (!kid) {
            console.warn("Kid not found:", row.name);
            return null;
          }

          // Convert imported row into backend structure
          return {
            kidid: kid.id,
            week: row.week,
            term: row.term,
            year: row.year,
            status: row.status?.toLowerCase() || "maybe",
            reason: row.reason || "",
          };
        })
        // Remove invalid/null rows
        .filter(Boolean)
    );
  };

  // -----------------------------
  // Handle Import Excel
  // -----------------------------
  const handleImport = async (rows) => {
    // Convert Excel rows -> attendance records
    const transformed = transformData(rows, kids);

    console.log("Transformed:", transformed);

    if (transformed.length === 0) {
      alert("No valid rows to import");
      return;
    }

    try {
      // POST /attendance/bulk
      const result = await addBulkAttendance(transformed);
      console.log("Imported result: ", result);

      await fetchAllAttendance(); // Refresh attendance after import
      alert("Attendance imported successfully!");
    } catch (err) {
      console.error("Import failed:", err);
      alert(
        "Failed to import attendance. Please check the console for details.",
      );
    }
  };

  // ---------------------------------------------------
  // Dropdown options
  // ---------------------------------------------------
  const availableYears = [...new Set(allAttendance.map((a) => a.year))].sort(
    (a, b) => b - a, // Sort newest years first
  );

  const availableTerms = selectedYear
    ? [
        ...new Set(
          allAttendance
            .filter((a) => a.year === selectedYear)
            .map((a) => a.term),
        ),
      ].sort((a, b) => a - b)
    : [];

  // -----------------------------
  // Render ( loading screen )
  // -----------------------------
  if (loading) return <LoadingSpinner fullPage={true} />;

  // ---------------------------------------------------
  // Main UI
  // ---------------------------------------------------
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/*Filter Controls*/}
      <AttendanceSort
        selectedYear={selectedYear}
        selectedTerm={selectedTerm}
        availableYears={availableYears}
        availableTerms={availableTerms}
        onYearChange={setSelectedYear}
        onTermChange={setSelectedTerm}
        hideWeek={true}
        refreshAttendance={fetchAllAttendance}
      />

      {/*Only render attendance if year + term selected*/}
      {selectedYear && selectedTerm ? (
        currentAttendance.length > 0 ? (
          <AttendanceResult
            currentAttendance={currentAttendance}
            onStatusChange={handleStatusChange}
            onAttendanceUpdate={updateAttendanceRecord}
            onReasonChange={handleReasonChange}
            onReasonSubmit={handleReasonSubmit}
            onImport={handleImport}
            selectedTerm={selectedTerm}
            selectedYear={selectedYear}
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
