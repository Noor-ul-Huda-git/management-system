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
  const now = new Date();

  if (!item) return "Pending";
  if (item.status === "Canceled") return "Canceled";
  if (item.status === "Completed") return "Completed";

  const dt = parseDateTime(item.date, item.time);
  if (now >= dt) return "Completed";

  return item.status || "Pending";
}

/* ---------------- UI Components ---------------- */

const PaymentBadge = ({ payment }) => (
  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
    payment === "Online"
      ? "bg-green-100 text-green-600"
      : "bg-yellow-100 text-yellow-600"
  }`}>
    {payment === "Online" ? <CreditCard size={14} /> : <Wallet size={14} />}
    {payment}
  </span>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-green-100 text-green-600",
    Pending: "bg-blue-100 text-blue-600",
    Canceled: "bg-red-100 text-red-600",
  };

  const icons = {
    Completed: <CheckCircle size={14} />,
    Pending: <Clock size={14} />,
    Canceled: <XCircle size={14} />,
  };

  return (
    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {icons[status] || <CalendarDays size={14} />}
      {status}
    </span>
  );
};

/* ---------------- Main Component ---------------- */

const AppointmentPage = () => {
  const { isLoaded, getToken } = useAuth();
  const { user } = useUser();

  const [doctorAppts, setDoctorAppts] = useState([]);
  const [serviceAppts, setServiceAppts] = useState([]);

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  /* -------- API Calls -------- */

  const loadDoctorAppointments = useCallback(async () => {
    if (!isLoaded || !user) return;

    setLoadingDoctors(true);
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const resp = await API.get("/api/appointments/me", { headers });
      setDoctorAppts(resp?.data?.appointments || []);
    } catch (err) {
      console.error(err);
      setDoctorAppts([]);
    } finally {
      setLoadingDoctors(false);
    }
  }, [isLoaded, user]);

  const loadServiceAppointments = useCallback(async () => {
    if (!isLoaded || !user) return;

    setLoadingServices(true);
    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const resp = await API.get("/api/service-appointments/me", { headers });
      setServiceAppts(resp?.data?.appointments || []);
    } catch (err) {
      console.error(err);
      setServiceAppts([]);
    } finally {
      setLoadingServices(false);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    loadDoctorAppointments();
    loadServiceAppointments();
  }, []);

  /* -------- Mapping -------- */

  const doctorData = useMemo(() => {
    return doctorAppts.map((a) => ({
      id: a._id,
      doctor: a.doctorName,
      date: a.date,
      time: a.time,
      payment: a?.payment?.method || "Cash",
      status: computeStatus(a),
    }));
  }, [doctorAppts]);

  const serviceData = useMemo(() => {
    return serviceAppts.map((s) => ({
      id: s._id,
      name: s.serviceName,
      price: s.price,
      date: s.date,
      time: s.time,
      payment: s?.payment?.method || "Cash",
      status: computeStatus(s),
    }));
  }, [serviceAppts]);

  /* -------- UI -------- */

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-10 px-4">

      <Toaster />

      {/* Doctor Section */}
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        Your Doctor Appointments
      </h1>

      {loadingDoctors ? (
        <p>Loading...</p>
      ) : doctorData.length === 0 ? (
        <p className="text-gray-600 mb-10">
          No doctor appointments found.
        </p>
      ) : (
        <div className="grid gap-4 w-full max-w-3xl">
          {doctorData.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center">

              <div>
                <h2 className="font-semibold text-lg">{item.doctor}</h2>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays size={14} /> {item.date}
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} /> {item.time}
                </p>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <PaymentBadge payment={item.payment} />
                <StatusBadge status={item.status} />
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Services Section */}
      <h1 className="text-3xl font-bold text-blue-700 mt-16 mb-4">
        Your Booked Services
      </h1>

      {loadingServices ? (
        <p>Loading...</p>
      ) : serviceData.length === 0 ? (
        <p className="text-blue-600">
          No service bookings found.
        </p>
      ) : (
        <div className="grid gap-4 w-full max-w-3xl">
          {serviceData.map((srv) => (
            <div key={srv.id} className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center">

              <div>
                <h2 className="font-semibold text-lg">{srv.name}</h2>
                <p className="text-sm text-gray-600">PKR {srv.price}</p>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays size={14} /> {srv.date}
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} /> {srv.time}
                </p>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <PaymentBadge payment={srv.payment} />
                <StatusBadge status={srv.status} />
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;