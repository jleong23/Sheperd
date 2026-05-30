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

import { useState, useEffect, useMemo } from "react";
import AttendanceResult from "../../components/attendance/AttendanceResult.jsx";
import AttendanceSort from "../../components/attendance/AttendanceSort.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import {
  addBulkAttendance,
  getAttendance,
  updateAttendance,
} from "../../api/attendance.js";
import { fetchKids } from "../../api/kids.js";
import toast from "react-hot-toast";

export default function AttendanceList() {
  // ---------------------------------------------------
  // State Management
  // ---------------------------------------------------
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [allAttendance, setAllAttendance] = useState([]);
  const [currentAttendance, setCurrentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [kids, setKids] = useState([]);

  // -----------------------------
  // Fetch ALL attendance records and kids
  // -----------------------------
  const fetchAllAttendance = async () => {
    try {
      const data = await getAttendance();
      if (!Array.isArray(data)) return;

      const normalized = data.map((r) => ({
        ...r,
        kidId: r.kidid ?? r.kidId,
      }));

      setAllAttendance(normalized);
    } catch (err) {
      console.error(err);
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
    const previous = currentAttendance.find((r) => r.id === recordId);

    // optimistic update
    updateAttendanceRecord({
      ...previous,
      status: newStatus,
    });

    try {
      await updateAttendance(recordId, { status: newStatus });
    } catch (err) {
      console.error(err);

      // rollback if needed
      updateAttendanceRecord(previous);
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
    setImporting(true);

    const transformed = transformData(rows, kids);

    try {
      await addBulkAttendance(transformed);

      // ALWAYS refetch clean state
      await fetchAllAttendance();

      toast.success("Attendance imported successfully!");
    } finally {
      setImporting(false);
    }
  };

  // ---------------------------------------------------
  // Dropdown options
  // ---------------------------------------------------
  const availableYears = useMemo(() => {
    return [...new Set(allAttendance.map((a) => a.year))].sort((a, b) => b - a);
  }, [allAttendance]);

  const availableTerms = useMemo(() => {
    if (!selectedYear) return [];

    return [
      ...new Set(
        allAttendance.filter((a) => a.year === selectedYear).map((a) => a.term),
      ),
    ].sort((a, b) => a - b);
  }, [allAttendance, selectedYear]);

  // ---------------------------------------------------
  // Selection Safety Guard
  // ---------------------------------------------------
  useEffect(() => {
    if (availableYears.length === 0) return;

    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0] ?? null);
      setSelectedTerm(null);
    }
  }, [availableYears]);

  // -----------------------------
  // Render ( loading screen )
  // -----------------------------
  if (loading) return <LoadingSpinner fullPage={true} />;

  // ---------------------------------------------------
  // Main UI
  // ---------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 blur-[120px]" />
      <div className="absolute right-10 top-80 w-96 h-96 bg-purple-500/20 blur-[120px]" />

      <div className="relative max-w-6xl mx-auto">
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
              importing={importing}
            />
          ) : (
            <p className="text-center mt-8 text-slate-400">
              No attendance found for selected Year and Term.
            </p>
          )
        ) : (
          <p className="text-center mt-8 text-slate-400">
            Please select Year and Term.
          </p>
        )}
      </div>
    </div>
  );
}
