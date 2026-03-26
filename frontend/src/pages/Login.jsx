import React from "react";
import Navbar from "../components/Navbar";
import Login from "./Login"; // ✅ make sure file name is correct

const DoctorsPage = () => {
  return (
    <div>
      <Navbar />
      <Login />
    </div>
  );
};

export default DoctorsPage;