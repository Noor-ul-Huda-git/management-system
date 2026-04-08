import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Doctorspage  from '../components/Doctorspage';

const Doctors = () => {

  return (
    <div>
      <Navbar />
      {/* <Doctors />   yahan actual component use karo */}
      {/* <h1>hello and welcome to doctor page and its running</h1> */}
      <Doctorspage/>
      <Footer />
    </div>
  );
};

export default Doctors;