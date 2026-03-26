import React from "react";
import { bannerStyles } from "../assets/frontend/dummyStyles";
import {
  Clock,
  Ribbon,
  ShieldUser,
  Star,
  Stethoscope,
  Users,
  Calendar,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ✅ FIX: correct image import (change path if needed)
import bannerImg from "../assets/frontend/banner.png";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className={bannerStyles.bannerContainer}>
      <div className={bannerStyles.mainContainer}>
        
        <div className={bannerStyles.contentContainer}>
          <div className={bannerStyles.flexContainer}>
            
            {/* LEFT SIDE */}
            <div className={bannerStyles.leftContent}>
              
              {/* TITLE */}
              <div className={bannerStyles.headerBadgeContainer}>
                <div className={bannerStyles.stethoscopeContainer}>
                  <Stethoscope className={bannerStyles.stethoscopeIcon} />
                </div>

                <div className={bannerStyles.titleContainer}>
                  <h1 className={bannerStyles.title}>
                    Medi
                    <span className={bannerStyles.titleGradient}>
                      Care++
                    </span>
                  </h1>

                  {/* STARS */}
                  <div className={bannerStyles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={bannerStyles.starIcon}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* TAGLINE */}
              <p className={bannerStyles.tagline}>
                Premium Healthcare
                <span className={`block ${bannerStyles.taglineHighlight}`}>
                  At your Fingertips
                </span>
              </p>

              {/* FEATURES */}
              <div className={bannerStyles.featuresGrid}>
                <div className={bannerStyles.featureItem}>
                  <Ribbon className={bannerStyles.featureIcon} />
                  <span>Certified Specialists</span>
                </div>

                <div className={bannerStyles.featureItem}>
                  <Clock className={bannerStyles.featureIcon} />
                  <span>24/7 Availability</span>
                </div>

                <div className={bannerStyles.featureItem}>
                  <ShieldUser className={bannerStyles.featureIcon} />
                  <span>Safe & Secure</span>
                </div>

                <div className={bannerStyles.featureItem}>
                  <Users className={bannerStyles.featureIcon} />
                  <span>500+ Doctors</span>
                </div>
              </div>

              {/* BUTTONS */}
              <div className={bannerStyles.ctaButtonContainer}>
                
                <button
                  onClick={() => navigate("/doctors")}
                  className={bannerStyles.bookButton}
                >
                  <Calendar className={bannerStyles.bookButtonIcon} />
                  Book Appointment Now
                </button>

                <button
                  onClick={() =>
                    (window.location.href = "tel:123456789")
                  }
                  className={bannerStyles.emergencyNumber}
                >
                  <Phone className={bannerStyles.emergencyButtonIcon} />
                  Emergency Call
                </button>

              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className={bannerStyles.rightImageSection}>
              <img
                src={bannerImg}
                alt="banner"
                className={bannerStyles.image}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;