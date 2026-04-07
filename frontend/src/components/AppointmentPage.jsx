import React, { useState, useEffect, useCallback, useMemo } from "react";
import {

  CalendarDays,
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

/* ✅ API Setup */
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const API = axios.create({ baseURL: API_BASE });



/* ---------------- Helper Functions ---------------- */

function parseDateTime(dateStr, timeStr) {
  const dt = new Date(`${dateStr} ${timeStr}`);
  return isNaN(dt) ? new Date() : dt;
}

function computeStatus(item) {
  try {
    const now = new Date();

    if (!item) return "Pending";
    if (item.status === "Canceled") return "Canceled";
    if (item.status === "Completed") return "Completed";

    const dt = parseDateTime(item.date, item.time);

    if (now >= dt) return "Completed";

    return item.status || "Pending";
  } catch (err) {
    console.error("Status error:", err);
    return "Pending";
  }
}

/* ---------------- Small Components ---------------- */

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
      <CalendarDays className={iconSize.small} /> {itemStatus}
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
    if (!isLoaded || !user) return;

    setLoadingDoctors(true);

    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const resp = await API.get("/api/appointments/me", { headers });

      const arr = resp?.data?.appointments || [];
      setDoctorAppts(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error("Doctor API Error:", err);
      setDoctorAppts([]);
    } finally {
      setLoadingDoctors(false);
    }
  }, [isLoaded, user, getToken]);

  const loadServiceAppointments = useCallback(async () => {
    if (!isLoaded || !user) return;

    setLoadingServices(true);

    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const resp = await API.get("/api/service-appointments/me", {
        headers,
      });

      const arr = resp?.data?.appointments || [];
      setServiceAppts(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error("Service API Error:", err);
      setServiceAppts([]);
    } finally {
      setLoadingServices(false);
    }
  }, [isLoaded, user, getToken]);

  useEffect(() => {
    loadDoctorAppointments();
    loadServiceAppointments();
  }, [loadDoctorAppointments, loadServiceAppointments]);

  /* -------- Data Mapping -------- */

  const appointmentData = useMemo(() => {
    return (doctorAppts || []).map((a) => ({
      id: a?._id || Math.random(),
      doctor: a?.doctorName || "Doctor",
      date: a?.date || "N/A",
      time: a?.time || "N/A",
      payment: a?.payment?.method || "Cash",
      status: computeStatus(a),
    }));
  }, [doctorAppts]);

  const serviceData = useMemo(() => {
    return (serviceAppts || []).map((s) => ({
      id: s?._id || Math.random(),
      name: s?.serviceName || "Service",
      price: s?.price || 0,
      date: s?.date || "N/A",
      time: s?.time || "N/A",
      payment: s?.payment?.method || "Cash",
      status: computeStatus(s),
    }));
  }, [serviceAppts]);

  /* -------- UI -------- */

  return (
    <div className={appointmentPageStyles.pageContainer}>
      <Toaster position="top-right" />

      {/* Doctor Section */}
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

          <p className="flex items-center gap-2">
            <CalendarDays className={iconSize.small} /> {item.date}
          </p>

          <p className="flex items-center gap-2">
            <Clock className={iconSize.small} /> {item.time}
          </p>

          <PaymentBadge payment={item.payment} />
          <StatusBadge itemStatus={item.status} />
        </div>
      ))}

      {/* Services Section */}
      <h2>Your Services</h2>

      {loadingServices && <p>Loading Services...</p>}

      {!loadingServices && serviceData.length === 0 && (
        <p>No Services Found</p>
      )}

      {serviceData.map((srv) => (
        <div key={srv.id} className={cardStyles.serviceCard}>
          <h3>{srv.name}</h3>

          <p>PKR {srv.price}</p>

          <p className="flex items-center gap-2">
            <CalendarDays className={iconSize.small} /> {srv.date}
          </p>

          <p className="flex items-center gap-2">
            <Clock className={iconSize.small} /> {srv.time}
          </p>

          <PaymentBadge payment={srv.payment} />
          <StatusBadge itemStatus={srv.status} />
        </div>
      ))}
    </div>
  );
};

export default AppointmentPage;