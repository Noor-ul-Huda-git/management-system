import React, { useState } from "react";
import { contactPageStyles } from "../assets/frontend/dummyStyles";
import {
  Stethoscope,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  SendHorizontal,
  User,
} from "lucide-react";

const ContactPage = () => {
  const initial = {
    name: "",
    email: "",
    phone: "",
    department: "",
    service: "",
    message: "",
  };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const departments = [
    "General Physician",
    "Cardiology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "Gynecology",
  ];

  const servicesMapping = {
    "General Physician": [
      "General Consultation",
      "Adult Checkup",
      "Vaccination",
      "Health Screening",
    ],
    Cardiology: [
      "ECG",
      "Echocardiography",
      "Stress Test",
      "Heart Consultation",
    ],
    Orthopedics: [
      "Fracture Care",
      "Joint Pain Consultation",
      "Physiotherapy",
    ],
    Dermatology: ["Skin Consultation", "Allergy Test", "Acne Treatment"],
    Pediatrics: ["Child Checkup", "Vaccination (Child)", "Growth Monitoring"],
    Gynecology: ["Antenatal Care", "Pap Smear", "Ultrasound"],
  };

  const genericServices = [
    "General Consultation",
    "ECG",
    "Blood Test",
    "X-Ray",
    "Ultrasound",
    "Physiotherapy",
    "Vaccination",
  ];

  function validate() {
    const e = {};

    if (!form.name.trim()) e.name = "Full name is required";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email";

    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      e.phone = "Phone number must be exactly 10 digits";

    if (!form.department && !form.service) {
      e.department = "Please choose a department or service";
      e.service = "Please choose a department or service";
    }

    if (!form.message.trim()) e.message = "Please write a short message";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "department") {
      setForm((prev) => ({ ...prev, department: value, service: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const text = `*Contact Request*\nName: ${form.name}\nEmail: ${
      form.email
    }\nPhone: ${form.phone}\nDepartment: ${
      form.department || "N/A"
    }\nService: ${form.service || "N/A"}\nMessage: ${form.message}`;

    const url = `https://wa.me/8299431275?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");

    setForm(initial);
    setErrors({});
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  const availableServices = form.department
    ? servicesMapping[form.department] || []
    : genericServices;

  return (
    <div className={contactPageStyles.pageContainer}>
      <div className={contactPageStyles.bgAccent1}></div>
      <div className={contactPageStyles.bgAccent2}></div>

      <div className={contactPageStyles.gridContainer}>
        {/* LEFT FORM */}
        <div className={contactPageStyles.formContainer}>
          <h2 className={contactPageStyles.formTitle}>
            Contact Our Clinic
          </h2>

          <p className={contactPageStyles.formSubtitle}>
            Fill the form and we will open WhatsApp for you.
          </p>

          <form
            onSubmit={handleSubmit}
            className={contactPageStyles.formSpace}
          >
            {/* Name + Email */}
            <div className={contactPageStyles.formgrid}>
              <div>
                <label className={contactPageStyles.label}>
                  <User size={16} /> Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className={contactPageStyles.input}
                />
                {errors.name && (
                  <p className={contactPageStyles.error}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className={contactPageStyles.label}>
                  <Mail size={16} /> Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className={contactPageStyles.input}
                />
                {errors.email && (
                  <p className={contactPageStyles.error}>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Phone + Department */}
            <div className={contactPageStyles.formGrid}>
              <div>
                <label className={contactPageStyles.label}>
                  <Phone size={16} /> Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className={contactPageStyles.input}
                  maxLength="10"
                />
                {errors.phone && (
                  <p className={contactPageStyles.error}>
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className={contactPageStyles.label}>
                  <MapPin size={16} /> Department
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className={contactPageStyles.input}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className={contactPageStyles.error}>
                    {errors.department}
                  </p>
                )}
              </div>
            </div>

            {/* Service */}
            <div>
              <label className={contactPageStyles.label}>
                <Stethoscope size={16} /> Service
              </label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className={contactPageStyles.input}
              >
                <option value="">Select Service</option>
                {availableServices.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className={contactPageStyles.error}>
                  {errors.service}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className={contactPageStyles.label}>
                <MessageSquare size={16} /> Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Describe your concern briefly..."
                rows={4}
                className={contactPageStyles.textarea}
              />
              {errors.message && (
                <p className={contactPageStyles.error}>
                  {errors.message}
                </p>
              )}
            </div>

            {/* Button */}
            <div className={contactPageStyles.buttonContainer}>
              <button
                type="submit"
                className={contactPageStyles.button}
              >
                <SendHorizontal size={18} />
                <span>Send via WhatsApp</span>
              </button>

              {sent && (
                <p className={contactPageStyles.sentMessage}>
                  Opening WhatsApp...
                </p>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className={contactPageStyles.infoContainer}>
          <div className={contactPageStyles.infoCard}>
            <h3 className={contactPageStyles.infoTitle}>
              Visit Our Clinic
            </h3>

            <p className={contactPageStyles.infoText}>
              House of Elaan, Gulberg Greens
            </p>

            <p className={contactPageStyles.infoItem}>
              <Phone size={16} /> 0519988510
            </p>

            <p className={contactPageStyles.infoItem}>
              <Mail size={16} /> info@gmail.com
            </p>
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18..."
            className={contactPageStyles.map}
            title="Map"
            loading="lazy"
          ></iframe>

          <div className={contactPageStyles.hoursContainer}>
            <h4 className={contactPageStyles.hoursTitle}>
              Clinic Hours
            </h4>
            <p className={contactPageStyles.hoursText}>
              Mon-Sat: 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;