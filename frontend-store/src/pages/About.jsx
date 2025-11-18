import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <div className="min-h-screen items-center justify-center bg-gray-100">
    <Navbar/>
      <h2 className="text-3xl font-semibold">About Us!!</h2>
    <Footer/>
    </div>
  );
}

export default About;
