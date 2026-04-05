import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  CalendarDays,
  Bell,
  CheckCircle,
  Clock,
  CreditCard,
  Wallet,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";

import {
  appointmentPageStyles,
  cardStyles,
  badgeStyles,
  iconSize,
} from "../assets/frontend/dummyStyles";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";
const API = axios.create({ baseURL: API_BASE });

/* ---------------- Helper Functions ---------------- */

function pad(n) {
  return String(n ?? 0).padStart(2, "0");
}

function parseDateTime(dateStr, timeStr) {
  const fast = new Date(`${dateStr} ${timeStr}`);
  if (!isNaN(fast)) return fast;

  const parts = (dateStr || "").split(" ");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const month = months[m];

    let [t, ampm] = (timeStr || "").split(" ");
    let [hh, mm] = (t || "0:00").split(":");

    hh = Number(hh || 0);
    mm = Number(mm || 0);

    if (ampm === "PM" && hh !== 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;

    return new Date(Number(y), month, Number(d), hh, mm);
  }

  const iso = new Date(dateStr);
  if (!isNaN(iso)) return iso;

  return new Date();
}

function computeStatus(item) {
  const now = new Date();
  if (!item) return "Pending";

  if (item.status === "Canceled") return "Canceled";

  if (item.status === "Rescheduled") {
    if (item.rescheduledTo?.date && item.rescheduledTo?.time) {
      const dt = parseDateTime(
        item.rescheduledTo.date,
        item.rescheduledTo.time
      );
      if (now >= dt) return "Completed";
    }
    return "Rescheduled";
  }

  if (item.status === "Completed") return "Completed";

  const dt = parseDateTime(item.date, item.time);
  if (now >= dt) return "Completed";

  return item.status || "Pending";
}

/* ---------------- UI Components ---------------- */

const PaymentBadge = ({ payment }) => {
  return payment === "Online" ? (
    <span className={badgeStyles.paymentBadge.online}>
      <CreditCard className={iconSize.small} /> Online
    </span>
  ) : (
    <span className={badgeStyles.paymentBadge.cash}>
      <Wallet className={iconSize.small} /> Cash
    </span>
  );
};

const StatusBadge = ({ itemStatus }) => {
  if (itemStatus === "Completed")
    return (
      <span className={badgeStyles.statusBadge.completed}>
        <CheckCircle className={iconSize.small} /> Completed
      </span>
    );

  if (itemStatus === "Confirmed")
    return (
      <span className={badgeStyles.statusBadge.confirmed}>
        <Bell className={iconSize.small} /> Confirmed
      </span>
    );

  if (itemStatus === "Pending")
    return (
      <span className={badgeStyles.statusBadge.pending}>
        <Clock className={iconSize.small} /> Pending
      </span>
    );

  if (itemStatus === "Canceled")
    return (
      <span className={badgeStyles.statusBadge.canceled}>
        <XCircle className={iconSize.small} /> Canceled
      </span>
    );

  return (
    <span className={badgeStyles.statusBadge.default}>
      <CalendarDays className={iconSize.small} /> Rescheduled
    </span>
  );
};

/* ---------------- Main Component ---------------- */

const AppointmentPage = () => {
  const { isLoaded, getToken } = useAuth();
  const { user } = useUser();

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const [doctorAppts, setDoctorAppts] = useState([]);
  const [serviceAppts, setServiceAppts] = useState([]);

  /* -------- API Calls -------- */

  const loadDoctorAppointments = useCallback(async () => {
    if (!isLoaded) return;
    setLoadingDoctors(true);

    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const resp = await API.get("/api/appointments/me", { headers });
      const arr = resp?.data?.appointments || [];

      setDoctorAppts(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error(err);
      setDoctorAppts([]);
    } finally {
      setLoadingDoctors(false);
    }
  }, [isLoaded, getToken]);

  const loadServiceAppointments = useCallback(async () => {
    if (!isLoaded) return;
    setLoadingServices(true);

    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const resp = await API.get("/api/service-appointments/me", { headers });
      const arr = resp?.data?.appointments || [];

      setServiceAppts(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error(err);
      setServiceAppts([]);
    } finally {
      setLoadingServices(false);
    }
  }, [isLoaded, getToken]);

  useEffect(() => {
    loadDoctorAppointments();
    loadServiceAppointments();
  }, [loadDoctorAppointments, loadServiceAppointments]);

  /* -------- Data Mapping -------- */

  const appointmentData = useMemo(() => {
    return doctorAppts.map((a) => ({
      id: a._id || a.id || Math.random(),
      doctor: a.doctorName || "Doctor",
      date: a.date || "",
      time: a.time || "",
      payment: a?.payment?.method || "Cash",
      status: computeStatus(a),
    }));
  }, [doctorAppts]);

  const serviceData = useMemo(() => {
    return serviceAppts.map((s) => ({
      id: s._id || s.id || Math.random(),
      name: s.serviceName || "Service",
      price: s.price || 0,
      date: s.date || "",
      time: s.time || "",
      payment: s?.payment?.method || "Cash",
      status: computeStatus(s),
    }));
  }, [serviceAppts]);

  /* -------- UI -------- */

  return (
    <div className={appointmentPageStyles.pageContainer}>
      <Toaster position="top-right" />

      <h1 className={appointmentPageStyles.doctorTitle}>
        Your Doctor Appointments
      </h1>

      {loadingDoctors && <p>Loading Doctors...</p>}
      {!loadingDoctors && appointmentData.length === 0 && (
        <p>No Doctor Appointments</p>
      )}

      {appointmentData.map((item) => (
        <div key={item.id} className={cardStyles.doctorCard}>
          <h2>{item.doctor}</h2>
          <p><CalendarDays /> {item.date}</p>
          <p><Clock /> {item.time}</p>
          <PaymentBadge payment={item.payment} />
          <StatusBadge itemStatus={item.status} />
        </div>
      ))}

      <h2>Your Services</h2>

      {loadingServices && <p>Loading Services...</p>}
      {!loadingServices && serviceData.length === 0 && (
        <p>No Services Found</p>
      )}

      {serviceData.map((srv) => (
        <div key={srv.id} className={cardStyles.serviceCard}>
          <h3>{srv.name}</h3>
          <p>PKR {srv.price}</p>
          <p><CalendarDays /> {srv.date}</p>
          <p><Clock /> {srv.time}</p>
          <PaymentBadge payment={srv.payment} />
          <StatusBadge itemStatus={srv.status} />
        </div>
      ))}
    </div>
  );
};

export default AppointmentPage;