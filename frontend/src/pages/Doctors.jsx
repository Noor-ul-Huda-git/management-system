import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Doctors from './Doctors'; // agar doctors list dikhani hai

const DoctorsPage = () => {
  return (
    <div>
      <Navbar />
      <Doctors />   {/* yahan actual component use karo */}
      <Footer />
    </div>
  );
};

export default DoctorsPage;