import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MousePointer2Off, Medal, ChevronRight } from "lucide-react";

const HomeDoctors = ({ previewCount = 4 }) => {

  // ✅ DUMMY DATA (WORKING)
  const [doctors] = useState([
    {
      id: "1",
      name: "Hamza Rajab",
      specialization: "Heart",
      image: "data:image/jpeg;base64,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",
      experience: 5,
      available: true,
    },
    {
      id: "2",
      name: "Bader Khalid",
      specialization: "Cardio",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUhdtXj357I_EuqvKVFTJS30lXlEIKZl1_xw&s",
      experience: 5,
      available: true,
    },
     {
      id: "3",
      name: "Mohsin Ali",
      specialization: "Cardio",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiR2FwBNmJtZRcauqkBW0HE4D9sIeKs-xaCg&s",
      experience: 5,
      available: true,
    },
   
  ]);

  // ❌ NO LOADING / NO API
  const loading = false;
  const error = "";

  const preview = doctors.slice(0, previewCount);

  return (
    <section className="py-20 bg-[#eaf5f3]">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-800">
            Our{" "}
            <span className="text-teal-600 italic">
              Medical Team
            </span>
          </h1>
          <p className="text-gray-500 mt-3">
            Book appointments quickly with our verified specialists.
          </p>
        </div>

        {/* DOCTORS GRID */}
        <div className="flex justify-center gap-8 flex-wrap">
          {preview.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 w-[280px] overflow-hidden"
            >
              {/* IMAGE */}
              <div className="w-full h-[200px] overflow-hidden rounded-t-3xl relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              

              {/* CONTENT */}
              <div className="p-5 text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  {doctor.name}
                </h3>

                <p className="text-teal-600 text-sm mt-1">
                  {doctor.specialization}
                </p>

                {/* EXPERIENCE */}
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                    <Medal className="w-3 h-3" />
                    {doctor.experience}+ years Experience
                  </span>
                </div>

                {/* BUTTON */}
                <div className="mt-5">
                  <Link
                    to={`/doctors/${doctor.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-400 to-teal-500 text-white py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HomeDoctors;