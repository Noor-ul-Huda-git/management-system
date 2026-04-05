import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardPage from '../doctor/DashboardPage';
const DoctorsPage = () => {
  return (
    <div>
      <Navbar />
      {/* <Doctors />   yahan actual component use karo */}
      {/* <h1>hello and welcome to doctor page and its running</h1> */}
      <DashboardPage/>
      <Footer />
    </div>
  );
};

export default DoctorsPage;