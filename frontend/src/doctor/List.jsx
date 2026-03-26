import React, { useEffect, useMemo, useState } from "react";
import { listPageStyles } from "../assets/frontend/dummyStyles";
import { Search, X, Calendar, Phone } from "lucide-react";
import { useParams } from "react-router-dom";

const API_BASE = "http://localhost:4000";

// ---------------- HELPER FUNCTIONS ----------------
function parseDateTime(date, time) {
  return new Date(`${date}T${time}:00`);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTimeAMPM(time24) {
  if (!time24) return "";
  const [hh, mm] = time24.split(":");
  let h = parseInt(hh, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${mm} ${ampm}`;
}

// ---------------- STATUS BADGE ----------------
function StatusBadge({ status }) {
  const base = listPageStyles.statusBadgeBase;

  if (status === "complete")
    return <span className={`${base} ${listPageStyles.statusBadgeComplete}`}>Completed</span>;

  if (status === "cancelled")
    return <span className={`${base} ${listPageStyles.statusBadgeCancelled}`}>Cancelled</span>;

  if (status === "confirmed")
    return <span className={`${base} ${listPageStyles.statusBadgeConfirmed}`}>Confirmed</span>;

  if (status === "rescheduled")
    return <span className={`${base} ${listPageStyles.statusBadgeRescheduled}`}>Rescheduled</span>;

  return <span className={`${base} ${listPageStyles.statusBadgePending}`}>Pending</span>;
}

// ---------------- STATUS SELECT ----------------
function StatusSelect({ appointment, onChange }) {
  const terminal =
    appointment.status === "complete" || appointment.status === "cancelled";

  return (
    <select
      value={appointment.status}
      onChange={(e) => onChange(e.target.value)}
      disabled={terminal}
      className={`${listPageStyles.statusSelect} ${
        terminal
          ? listPageStyles.statusSelectDisabled
          : listPageStyles.statusSelectEnabled
      }`}
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="complete">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}

// ---------------- MAIN COMPONENT ----------------
const ListPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id: doctorId } = useParams();

  // -------- FETCH DATA --------
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch(
          `${API_BASE}/api/appointments/doctor/${doctorId}`
        );

        const data = await res.json();

        setAppointments(data.appointments || []);
      } catch (err) {
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [doctorId]);

  // -------- FILTER --------
  const filtered = useMemo(() => {
    return appointments
      .filter((a) =>
        search
          ? a.patient?.toLowerCase().includes(search.toLowerCase())
          : true
      )
      .filter((a) => (statusFilter ? a.status === statusFilter : true))
      .sort(
        (a, b) =>
          parseDateTime(b.date, b.time) -
          parseDateTime(a.date, a.time)
      );
  }, [appointments, search, statusFilter]);

  // -------- UPDATE STATUS --------
  function updateStatus(id, newStatus) {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: newStatus } : a
      )
    );
  }

  // ---------------- UI ----------------
  return (
    <div className={listPageStyles.pageContainer}>
      <div className={listPageStyles.contentWrapper}>
        
        {/* HEADER */}
        <div className={listPageStyles.headerContainer}>
          <div>
            <h1 className={listPageStyles.headerTitle}>
              All Appointments
            </h1>
            <p className={listPageStyles.headerSubtitle}>
              Latest at Top - search by patient name
            </p>
          </div>

          {/* SEARCH */}
          <div className={listPageStyles.searchFilterContainer}>
            <div className={listPageStyles.searchContainer}>
              <div className={listPageStyles.searchIconContainer}>
                <Search className={listPageStyles.searchIcon} />
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={listPageStyles.searchInput}
                placeholder="Search patient name"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className={listPageStyles.clearSearchButton}
                >
                  <X className={listPageStyles.clearSearchIcon} />
                </button>
              )}
            </div>

            {/* FILTER */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={listPageStyles.statusFilter}
            >
              <option value="">All</option>
              <option value="complete">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          </div>
        </div>

        {/* STATES */}
        {loading ? (
          <div className={listPageStyles.loadingContainer}>
            Loading...
          </div>
        ) : error ? (
          <div className={listPageStyles.errorContainer}>
            {error}
          </div>
        ) : (
          <div className={listPageStyles.appointmentsGrid}>
            
            {filtered.map((a) => (
              <article
                key={a.id}
                className={listPageStyles.appointmentCard}
              >
                {/* HEADER */}
                <header className={listPageStyles.cardHeader}>
                  <div className={listPageStyles.cardContent}>
                    <div className={listPageStyles.cardPatientName}>
                      {a.patient}
                    </div>

                    <div className={listPageStyles.cardPatientInfo}>
                      {a.age} yrs • {a.gender}
                    </div>

                    <div className={listPageStyles.cardDoctorName}>
                      {a.doctorName}
                    </div>
                  </div>
                </header>

                {/* DATE */}
                <div className={listPageStyles.dateTimeContainer}>
                  <Calendar className={listPageStyles.calendarIcon} />
                  {formatDate(a.date)} : {formatTimeAMPM(a.time)}
                </div>

                {/* CONTACT */}
                <div className={listPageStyles.phoneContainer}>
                  <Phone className={listPageStyles.phoneIcon} />
                  {a.mobile}
                </div>

                {/* STATUS */}
                <div className={listPageStyles.statusContainer}>
                  <StatusBadge status={a.status} />
                  <StatusSelect
                    appointment={a}
                    onChange={(s) => updateStatus(a.id, s)}
                  />
                </div>
              </article>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default ListPage;