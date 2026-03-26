import React, { useState, useEffect } from "react";
import { homeDoctorStyles } from "../assets/frontend/dummyStyles";
import { Link } from "react-router-dom";
import { MousePointer2Off, Medal, ChevronRight } from "lucide-react";

const HomeDoctors = ({ previewCount = 8 }) => {
  const API_BASE = "http://localhost:4000";
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadDoctors = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/doctors`);
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          const msg =
            (json && json.message) || `Failed to load doctors (${res.status})`;
          if (!mounted) return;
          setError(msg);
          setDoctors([]);
          setLoading(false);
          return;
        }

        const items = (json && (json.data || json)) || [];
        const normalized = (Array.isArray(items) ? items : []).map((d) => ({
          id: d._id || d.id,
          name: d.name || "Unknown",
          specialization: d.specialization || "",
          image: d.imageUrl || d.image || "/placeholder-doctor.jpg",
          experience: d.experience || 0,
          fee: d.fee ?? d.price ?? 0,
          available:
            (typeof d.availability === "string"
              ? d.availability.toLowerCase() === "available"
              : typeof d.available === "boolean"
              ? d.available
              : d.availability === true) || d.availability === "Available",
          raw: d,
        }));

        if (!mounted) return;
        setDoctors(normalized);
      } catch (err) {
        if (!mounted) return;
        console.error(err);
        setError("Network error while loading doctors.");
        setDoctors([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDoctors();
    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  const preview = doctors.slice(0, previewCount);

  return (
    <section className={homeDoctorStyles.section}>
      <div className={homeDoctorStyles.container}>
        <div className={homeDoctorStyles.header}>
          <h1 className={homeDoctorStyles.title}>
            Our{" "}
            <span className={homeDoctorStyles.titleSpan}>Medical Team</span>
          </h1>
          <p className={homeDoctorStyles.subtitle}>
            Book appointments quickly with our verified specialists.
          </p>
        </div>

        {error && (
          <div className={homeDoctorStyles.errorContainer}>
            <div className={homeDoctorStyles.errorText}>{error}</div>
            <button
              onClick={() => window.location.reload()}
              className={homeDoctorStyles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className={homeDoctorStyles.skeletonGrid}>
            {Array.from({ length: previewCount }).map((_, i) => (
              <div key={i} className={homeDoctorStyles.skeletonCard}></div>
            ))}
          </div>
        ) : (
          <div className={homeDoctorStyles.doctorsGrid}>
            {preview.map((doctor) => (
              <article key={doctor.id} className={homeDoctorStyles.article}>
                {doctor.available ? (
                  <Link
                    to={`/doctors/${doctor.id}`}
                    state={{ doctor: doctor.raw }}
                  >
                    <div className={homeDoctorStyles.imageContainerAvailable}>
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className={homeDoctorStyles.image}
                      />
                    </div>
                  </Link>
                ) : (
                  <div className={homeDoctorStyles.imageContainerUnavailable}>
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className={homeDoctorStyles.image}
                    />
                    <div className={homeDoctorStyles.unavailableBadge}>
                      Not Available
                    </div>
                  </div>
                )}

                <div className={homeDoctorStyles.cardBody}>
                  <h3 className={homeDoctorStyles.doctorName}>
                    {doctor.name}
                  </h3>
                  <p className={homeDoctorStyles.specialization}>
                    {doctor.specialization}
                  </p>
                  <div className={homeDoctorStyles.experienceContainer}>
                    <div className={homeDoctorStyles.experienceBadge}>
                      <Medal className="w-4 h-4" />
                      <span>{doctor.experience} years Experience</span>
                    </div>
                  </div>

                  <div className={homeDoctorStyles.buttonContainer}>
                    {doctor.available ? (
                      <Link
                        to={`/doctors/${doctor.id}`}
                        state={{ doctor: doctor.raw }}
                        className={homeDoctorStyles.buttonAvailable}
                      >
                        <ChevronRight className="w-5 h-5" />
                        Book Now
                      </Link>
                    ) : (
                      <button
                        disabled
                        className={homeDoctorStyles.buttonUnavailable}
                      >
                        <MousePointer2Off className="w-5 h-5" />
                        Not Available
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <style>{homeDoctorStyles.customCss}</style>
    </section>
  );
};

export default HomeDoctors;