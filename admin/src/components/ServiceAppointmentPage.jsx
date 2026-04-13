import React, { useState, useEffect, useMemo } from "react";
// import { ServiceAppointmentsPage as serviceStyles } from "../assets/frontend/dummyStyles";
import { serviceAppointmentsStyles } from "../assets/frontend/dummyStyles";
import {
  Search as SearchIcon,
  X as XIcon,
  Loader2,
  User,
  Phone,
  BadgeIndianRupee,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const API_BASE = "http://localhost:4000";

// Helpers
function formatTwo(n) {
  return String(n).padStart(2, "0");
}

function formatDateNice(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function parseTimeToParts(timeStr) {
  if (!timeStr) return { hour: 12, minute: 0, ampm: "AM" };
  const m = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (m) {
    let hh = Number(m[1]);
    const mm = Number(m[2]);
    const ampm = m[3] ? m[3].toUpperCase() : null;
    if (!ampm) {
      const hour12 = hh % 12 === 0 ? 12 : hh % 12;
      return { hour: hour12, minute: mm, ampm: hh >= 12 ? "PM" : "AM" };
    }
    return { hour: hh, minute: mm, ampm };
  }
  return { hour: 12, minute: 0, ampm: "AM" };
}

function formatTimeDisplay(a) {
  return `${formatTwo(a.hour)}:${formatTwo(a.minute)} ${a.ampm}`;
}

// Components
function StatusBadge({ status }) {
  const classes = serviceAppointmentsStyles.statusBadge(status);
  return (
    <span className={classes}>
      {status === "Confirmed" && <CheckCircle className="h-4 w-4" />}
      {status === "Canceled" && <XCircle className="h-4 w-4" />}
      {status}
    </span>
  );
}

function Toast({ toasts, removeToast }) {
  return (
    <div className={serviceAppointmentsStyles.toastContainer}>
      {toasts.map((t) => (
        <div key={t.id} className={serviceAppointmentsStyles.toast}>
          <div className={serviceAppointmentsStyles.toastContent}>
            <Loader2 className={serviceAppointmentsStyles.toastSpinner} />
            <div>
              <div className={serviceAppointmentsStyles.toastTitle}>{t.title}</div>
              <div className={serviceAppointmentsStyles.toastMessage}>{t.message}</div>
            </div>
            <button onClick={() => removeToast(t.id)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// MAIN COMPONENT
const ServiceAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 220);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  function pushToast(title, message) {
    const id = Date.now();
    setToasts((t) => [...t, { id, title, message }]);
  }

  function removeToast(id) {
    setToasts((t) => t.filter((x) => x.id !== id));
  }

  async function fetchAppointments() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/service-appointments`);
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return appointments.filter(
      (a) =>
        (a.patientName || "").toLowerCase().includes(q) &&
        (statusFilter ? a.status === statusFilter : true)
    );
  }, [appointments, debouncedSearch, statusFilter]);

  return (
    <div className={serviceAppointmentsStyles.container}>
      
      {/* SEARCH */}
      <div className={serviceAppointmentsStyles.searchContainer}>
        <div className="relative w-full flex items-center gap-2">
          
          <SearchIcon className={serviceAppointmentsStyles.searchIcon} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className={serviceAppointmentsStyles.searchInput}
          />

          {search && (
            <button onClick={() => setSearch("")}>
              <XIcon />
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div>
          <Loader2 className="animate-spin" /> Loading...
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        filtered.map((a) => {
          const isLocked =
            a.status === "Completed" || a.status === "Canceled";

          return (
            <div key={a.id}>
              <User /> {a.patientName}
              <div>{formatDateNice(a.date)}</div>
              <div>{formatTimeDisplay(a)}</div>

              <StatusBadge status={a.status} />

              <button disabled={isLocked}>Cancel</button>
            </div>
          );
        })
      )}

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ServiceAppointmentsPage;