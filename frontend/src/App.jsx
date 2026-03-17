import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
           <Route path="/doctors" element={<Doctors />} />
           <Route path="/doctors/:id" element={<Doctordetail />} />
           <Route path="/services" element={<Service />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/doctor-admin/login" element={<Login />} />
               <Route path="/doctor-admin/:id" element={<DHome />} />
                <Route path="/doctor-admin/:id/appointments" element={<List/>} />

      </Routes>
    </>
  );
};

export default App;
