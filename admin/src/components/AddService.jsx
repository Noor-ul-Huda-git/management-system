import React, { useState, useEffect, useRef } from "react";
import { addServiceStyles } from "../assets/frontend/dummyStyles";

import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Image,
  Plus,
  Trash2,
  Calendar
} from "lucide-react";

const AddService = ({ serviceId }) => {

  const API_BASE = "http://localhost:4000";

  const fileRef = useRef(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [hasExistingImage, setHasExistingImage] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  const [serviceName, setServiceName] = useState("");
  const [about, setAbout] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("available");

  const [instructions, setInstructions] = useState([""]);
  const [slots, setSlots] = useState([]);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  const years = Array.from({ length: 5 }).map((_, i) => currentYear + i);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const hours = Array.from({ length: 12 }).map((_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const minutes = Array.from({ length: 12 }).map((_, i) =>
    String(i * 5).padStart(2, "0")
  );

  const ampm = ["AM", "PM"];

  const [slotDay, setSlotDay] = useState(String(currentDate));
  const [slotMonth, setSlotMonth] = useState(String(currentMonth));
  const [slotYear, setSlotYear] = useState(String(currentYear));
  const [slotHour, setSlotHour] = useState("11");
  const [slotMinute, setSlotMinute] = useState("00");
  const [slotAmPm, setSlotAmPm] = useState("AM");

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const selectedYearNum = Number(slotYear);
  const selectedMonthNum = Number(slotMonth);

  const daysInSelectedMonth = new Date(
    selectedYearNum,
    selectedMonthNum + 1,
    0
  ).getDate();

  const days = Array.from({ length: daysInSelectedMonth }).map((_, i) =>
    String(i + 1)
  );

  useEffect(() => {
    if (Number(slotDay) > daysInSelectedMonth) {
      setSlotDay(String(daysInSelectedMonth));
    }
  }, [slotMonth, slotYear, daysInSelectedMonth]);

  useEffect(() => {

    let mounted = true;

    async function loadService() {

      if (!serviceId) return;

      try {

        const res = await fetch(`${API_BASE}/api/services/${serviceId}`);

        if (!res.ok) return;

        const payload = await res.json().catch(() => null);

        const data = payload?.data || payload;

        if (!data) return;
        if (!mounted) return;

        setServiceName(data.name || "");
        setAbout(data.about || data.description || "");
        setPrice(data.price != null ? String(data.price) : "");

        setAvailability(data.available ? "available" : "unavailable");

        setInstructions(
          Array.isArray(data.instructions) && data.instructions.length
            ? data.instructions
            : [""]
        );

        setSlots(Array.isArray(data.slots) ? data.slots : []);

        if (data.imageUrl) {
          setImagePreview(data.imageUrl);
          setHasExistingImage(true);
          setRemoveImage(false);
        }

      } catch (err) {
        console.error(err);
      }

    }

    loadService();

    return () => {
      mounted = false;
    };

  }, [serviceId, API_BASE]);

  function handleImageChange(e) {

    const f = e.target.files?.[0];
    if (!f) return;

    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));

    setRemoveImage(false);
    setHasExistingImage(false);
  }

  function addInstruction() {
    setInstructions((s) => [...s, ""]);
  }

  function updateInstruction(i, v) {
    setInstructions((s) => s.map((x, idx) => (idx === i ? v : x)));
  }

  function removeInstruction(i) {
    setInstructions((s) => s.filter((_, idx) => idx !== i));
  }

  function resetForm() {

    setImagePreview(null);
    setImageFile(null);
    setHasExistingImage(false);
    setRemoveImage(false);

    setServiceName("");
    setAbout("");
    setPrice("");
    setAvailability("available");

    setInstructions([""]);
    setSlots([]);

    setErrors({});
  }

  function showToast(type, title, message) {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 3500);
  }

  function selectedDateTime() {

    const d = Number(slotDay);
    const m = Number(slotMonth);
    const y = Number(slotYear);

    let h = Number(slotHour);
    const mm = Number(slotMinute);

    const ap = slotAmPm;

    if (ap === "AM") {
      if (h === 12) h = 0;
    } else {
      if (h !== 12) h = h + 12;
    }

    return new Date(y, m, d, h, mm, 0, 0);
  }

  function isSelectedDateTimeInPast() {
    const sel = selectedDateTime();
    return sel.getTime() <= Date.now();
  }

  function addSlot() {

    const m = months[Number(slotMonth)];
    const d = String(slotDay).padStart(2, "0");
    const y = slotYear;

    const h = String(slotHour).padStart(2, "0");
    const mm = slotMinute;

    const ap = slotAmPm;

    const formatted = `${d} ${m} ${y} • ${h}:${mm} ${ap}`;

    if (slots.includes(formatted)) {
      showToast("error","Duplicate Slot","This slot already exists");
      return;
    }

    if (isSelectedDateTimeInPast()) {
      showToast("error","Past Time","Cannot add past time");
      return;
    }

    setSlots((s) => [...s, formatted]);

    showToast("success","Slot Added",formatted);
  }

  function removeSlot(i) {

    const removedSlot = slots[i];

    setSlots((s) => s.filter((_, idx) => idx !== i));

    showToast("info","Slot Removed",removedSlot);
  }

  async function handleSubmit(e) {

    e.preventDefault();

    setSubmitting(true);

    try {

      const fd = new FormData();

      fd.append("name", serviceName);
      fd.append("about", about);
      fd.append("price", price);
      fd.append("availability", availability);

      fd.append("instructions", JSON.stringify(instructions));
      fd.append("slots", JSON.stringify(slots));

      if (imageFile) {
        fd.append("image", imageFile);
      }

      const url = serviceId
        ? `${API_BASE}/api/services/${serviceId}`
        : `${API_BASE}/api/services`;

      const method = serviceId ? "PUT" : "POST";

      await fetch(url, { method, body: fd });

      showToast("success","Saved","Service saved successfully");

      if (!serviceId) resetForm();

    } catch (err) {
      console.error(err);
    }

    setSubmitting(false);
  }

  return (

    <div className={addServiceStyles.container.main}>

      <form
        onSubmit={handleSubmit}
        className={addServiceStyles.container.form}
      >

        <h1 className={addServiceStyles.header.title}>
          {serviceId ? "Edit Service" : "Add Service"}
        </h1>

        <input
          value={serviceName}
          onChange={(e)=>setServiceName(e.target.value)}
          placeholder="Service Name"
          className={addServiceStyles.formFields.input()}
        />

        <textarea
          value={about}
          onChange={(e)=>setAbout(e.target.value)}
          placeholder="About Service"
          className={addServiceStyles.formFields.textarea()}
        />

        <input
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
          placeholder="Price"
          className={addServiceStyles.formFields.input()}
        />

        <button
          type="submit"
          disabled={submitting}
          className={addServiceStyles.buttons.submit}
        >

          {submitting ? "Saving..." : "Save Service"}

        </button>

      </form>

      <style>
        {addServiceStyles.customCss}
      </style>

    </div>

  );
};

export default AddService;
