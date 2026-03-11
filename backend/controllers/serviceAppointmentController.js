import ServiceAppointment from "../models/serviceAppointment.js";
import Service from "../models/Service.js";
import Stripe from "stripe";
import { getAuth } from "@clerk/express";

const stripeKey = process.env.STRIPE_SECRET_KEY || null;
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2022-11-15" }) : null;

// Helper functions
const safeNumber = (val) => {
  if (val === undefined || val === null || val === "") return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
};

function parseTimeString(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return null;
  const t = timeStr.trim();
  const m = t.match(/([0-9]{1,2}):?([0-9]{0,2})\s*(AM|PM|am|pm)?/);
  if (!m) return null;

  let hh = parseInt(m[1], 10);
  let mm = m[2] ? parseInt(m[2], 10) : 0;
  const ampm = (m[3] || "").toUpperCase();

  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;

  if (ampm) {
    if (hh < 1 || hh > 12 || mm < 0 || mm > 59) return null;
    return { hour: hh, minute: mm, ampm };
  }

  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  if (hh === 0) return { hour: 12, minute: mm, ampm: "AM" };
  if (hh === 12) return { hour: 12, minute: mm, ampm: "PM" };
  if (hh > 12) return { hour: hh - 12, minute: mm, ampm: "PM" };

  return { hour: hh, minute: mm, ampm: "AM" };
}

const buildFrontendBase = (req) => {
  const env = process.env.FRONTEND_URL;
  if (env) return env.replace(/\/$/, "");
  const origin = req.get("origin") || req.get("referer") || null;
  return origin ? origin.replace(/\/$/, "") : null;
};

function resolveClerkUserId(req) {
  try {
    const auth = req.auth || {};
    const candidate =
      auth?.userId ||
      auth?.user_id ||
      auth?.user?.id ||
      req.user?.id ||
      null;

    if (candidate) return candidate;

    try {
      const serverAuth = getAuth ? getAuth(req) : null;
      return serverAuth?.userId || null;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

// CREATE APPOINTMENT
export const createServiceAppointment = async (req, res) => {
  try {
    const body = req.body || {};
    const clerkUserId = resolveClerkUserId(req);

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required to create a service appointment",
      });
    }

    const {
      serviceId,
      serviceName: serviceNameFromBody,
      patientName,
      mobile,
      age,
      gender,
      date,
      time,
      hour,
      minute,
      ampm,
      paymentMethod = "Online",
      amount: amountFromBody,
      fees: feesFromBody,
      email,
      meta = {},
      notes = "",
      serviceImageUrl: serviceImageUrlFromBody,
      serviceImagePublicId: serviceImagePublicIdFromBody,
    } = body;

    if (!serviceId)
      return res.status(400).json({ success: false, message: "serviceId is required" });

    if (!patientName || !String(patientName).trim())
      return res.status(400).json({ success: false, message: "patientName is required" });

    if (!mobile || !String(mobile).trim())
      return res.status(400).json({ success: false, message: "mobile is required" });

    if (!date || !String(date).trim())
      return res.status(400).json({
        success: false,
        message: "date is required (YYYY-MM-DD)",
      });

    const numericAmount = safeNumber(amountFromBody ?? feesFromBody ?? 0);

    if (numericAmount === null || numericAmount < 0)
      return res
        .status(400)
        .json({ success: false, message: "amount/fees must be a valid number" });

    let finalHour = hour !== undefined ? safeNumber(hour) : null;
    let finalMinute = minute !== undefined ? safeNumber(minute) : null;
    let finalAmpm = ampm || null;

    if (time && finalHour === null) {
      const parsed = parseTimeString(time);
      if (!parsed)
        return res
          .status(400)
          .json({ success: false, message: "time string couldn't be parsed" });

      finalHour = parsed.hour;
      finalMinute = parsed.minute;
      finalAmpm = parsed.ampm;
    }

    if (
      finalHour === null ||
      finalMinute === null ||
      (finalAmpm !== "AM" && finalAmpm !== "PM")
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Time missing or invalid — provide time string or hour, minute and ampm.",
      });
    }

    const base = {
      serviceId,
      serviceName: serviceNameFromBody || "Service",
      patientName: String(patientName).trim(),
      mobile: String(mobile).trim(),
      age: age ? Number(age) : undefined,
      gender: gender || "",
      date: String(date),
      hour: Number(finalHour),
      minute: Number(finalMinute),
      ampm: finalAmpm,
      fees: numericAmount,
      createdBy: clerkUserId,
      notes: notes || "",
    };

    const created = await ServiceAppointment.create({
      ...base,
      status: "Pending",
      payment: { method: paymentMethod, status: "Pending", amount: numericAmount },
    });

    return res.status(201).json({ success: true, appointment: created });
  } catch (err) {
    console.error("createServiceAppointment unexpected:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// CONFIRM PAYMENT
export const confirmservicepayment = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id)
      return res
        .status(400)
        .json({ success: false, message: "Session Id is req" });

    if (!stripe)
      return res
        .status(500)
        .json({ success: false, message: "Stripe is not configured" });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Invalid session" });

    const appt = await ServiceAppointment.findOneAndUpdate(
      { "payment.sessionId": session_id },
      {
        $set: {
          "payment.status": "Confirmed",
          "payment.providerId": session.payment_intent || "",
          "payment.paidAt": new Date(),
          status: "Confirmed",
        },
      },
      { new: true }
    );

    return res.json({ success: true, appointment: appt });
  } catch (err) {
    console.error("confirmService Payment:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET APPOINTMENTS
export const getServiceAppoitments = async (req, res) => {
  try {
    const appointments = await ServiceAppointment.find().sort({ createdAt: -1 });
    return res.json({ success: true, appointments });
  } catch (err) {
    console.error("getServiceAppointment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET APPOINTMENT BY ID
export const getServiceAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appt = await ServiceAppointment.findById(id);

    if (!appt)
      return res.status(404).json({ success: false, message: "Not found" });

    return res.json({ success: true, appointment: appt });
  } catch (err) {
    console.error("getServiceAppointmentById error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// CANCEL APPOINTMENT
export const cancelServiceAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appt = await ServiceAppointment.findById(id);

    if (!appt)
      return res.status(404).json({ success: false, message: "Not found" });

    appt.status = "Canceled";
    await appt.save();

    return res.json({ success: true, data: appt });
  } catch (err) {
    console.error("Cancel service Appointment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// STATS
export const getServiceAppointmentStats = async (req, res) => {
  try {
    const total = await ServiceAppointment.countDocuments();
    return res.json({ success: true, total });
  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({ success: false });
  }
};

// PATIENT APPOINTMENTS
export const getServiceAppointmentsByPatient = async (req, res) => {
  try {
    const clerkUserId = resolveClerkUserId(req);
    const list = await ServiceAppointment.find({ createdBy: clerkUserId });
    return res.json({ success: true, data: list });
  } catch (err) {
    console.error("Patient appointments error:", err);
    return res.status(500).json({ success: false });
  }
};

export default {
  createServiceAppointment,
  confirmservicepayment,
  getServiceAppoitments,
  getServiceAppointmentById,
  cancelServiceAppointment,
  getServiceAppointmentStats,
  getServiceAppointmentsByPatient,
};
