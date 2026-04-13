import React from 'react'
import {dashboardStyles as s} from '../assets/frontend/summyStyles';

import {
Users,
UserRoundCheck,
CalendarRange,
BadgeIndianRupee,
CheckCircle,
XCircle,
Search
} from "lucide-react";
const API_BASE='http://localhost:4000';
const PATIENT_COUNT_API=`${API_BASE}/api/appointments/patients/count`;


// Helper FUnction
// It will return finite number
const safeNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
// for normalize doctor document
function normalizeDoctor(doc) {
  const id = doc._id || doc.id || String(Math.random()).slice(2);
  const name =
    doc.name ||
    doc.fullName ||
    `${doc.firstName || ""} ${doc.lastName || ""}`.trim() ||
    "Unknown";
  const specialization =
    doc.specialization ||
    doc.speciality ||
    (Array.isArray(doc.specializations)
      ? doc.specializations.join(", ")
      : "") ||
    "General";
  const fee = safeNumber(
    doc.fee ?? doc.fees ?? doc.consultationFee ?? doc.consultation_fee ?? 0,
    0
  );
  const image =
    doc.imageUrl ||
    doc.image ||
    doc.avatar ||
    `https://i.pravatar.cc/150?u=${id}`;

  const appointments = {
    total:
      doc.appointments?.total ??
      doc.totalAppointments ??
      doc.appointmentsTotal ??
      0,
    completed:
      doc.appointments?.completed ??
      doc.completedAppointments ??
      doc.appointmentsCompleted ??
      0,
    canceled:
      doc.appointments?.canceled ??
      doc.canceledAppointments ??
      doc.appointmentsCanceled ??
      0,
  };

  let earnings = null;
  if (doc.earnings !== undefined && doc.earnings !== null)
    earnings = safeNumber(doc.earnings, 0);
  else if (doc.revenue !== undefined && doc.revenue !== null)
    earnings = safeNumber(doc.revenue, 0);
  else if (appointments.completed && fee)
    earnings = fee * safeNumber(appointments.completed, 0);
  else earnings = 0;

  return {
    id,
    name,
    specialization,
    fee,
    image,
    appointments,
    earnings,
    raw: doc,
  };
}


 

const DashboardPage =()=>{
  return (
    <div className={s.container}>
      <div className={s.maxWidthContainer}>
        <div className={s.headerContainer}>
          <div>
            <h1 className={s.headerTitle}>Dashboard</h1>
            <p className={s.headerSubtitle}>
              Welcome back! Here's an overview of your hospital's performance.</p>
          
          </div>
          </div>
          
          
          
          </div>

    </div>

  )
    
export default DashBoardPage;

function StatCard ({icon,label,value}){
    return(
        <div className={s.statCard}>
            <div className={s.statCardContainer}>
                <div className={s.statIconContainer}>
                    {icon}
                </div>
                <div className="flex-1">
                    <div className={s.statLabel}>{label}</div>
                    <div className={s.statValue}>{value}</div>

                </div>

            </div>

        </div>
    );
}
function MobileDoctorCard({d}) {
  return(
   <div className={s.mobileDoctorcard}>
  
  <div className={s.mobileDoctorHeader}>
    <div className="flex items-center gap-3">

      <img
        src={d.image}
        alt={d.name}
        className={s.mobileDoctorImage}
      />

      <div>
        <div className={s.mobileDoctorName}>{d.name}</div>

        <div className={s.mobileDoctorSpecialization}>
          {d.specialization}
        </div>
      </div>

    </div>

    <div className={s.mobileDoctorFee}>
      {d.fee}
    </div>
  </div>

  <div className={s.mobileStatsGrid}>

    <div>
      <div className={s.mobileStatLabel}>Appts</div>
      <div className={s.mobileStatValue}>
        {d.appointments.total}
      </div>
    </div>

    <div>
      <div className={s.mobileStatLabel}>Done</div>
      <div className={s.mobileStatValue + " " + s.textEmerald600}>
        {d.appointments.completed}
      </div>
    </div>

    <div>
      <div className={s.mobileStatLabel}>Canceled</div>
      <div className={s.mobileStatValue + " " + s.textRose500}>
        {d.appointments.canceled}
      </div>
    </div>

  </div>

  <div className={s.mobileEarningContainer}>
    <div>Earned</div>
    <div className="font-semibold">
      {d.earnings.toLocaleString()}
    </div>
  </div>

</div>
  );
}