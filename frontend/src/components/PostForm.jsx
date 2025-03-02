/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { motion } from "framer-motion";
import parallaximage from "../images/Parallax_Image.jpg";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";

const PostForm = () => {

  const navigate = useNavigate();

  const handleFeeds = () => {
    navigate("/feeds"); 
  };
  
  const handleMyProfile = () => {
    navigate("/myprofile"); 
  };

  const [days, setDays] = useState("");
  const [nights, setNights] = useState("");

  const handleDaysChange = (e) => {
    const value = e.target.value;
    if (value === "" || Number(value) >= 0) {
      setDays(value);
    }
  };

  const handleNightsChange = (e) => {
    const value = e.target.value;
    if (value === "" || Number(value) >= 0) {
      setNights(value);
    }
    
  };

  return (
    <>
      {/* Navbar with Motion Animation */}
      <motion.nav
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 50 }}
        className="flex justify-between items-center p-5 bg-[#38496a] shadow-md h-16 fixed top-0 w-full z-50"
      >
        <img src={logo} alt="Roamio Logo" className="h-12 w-auto" />
        <div className="flex space-x-6">
        <a href="#" className="text-white hover:text-[#89A8B2] transition" onClick={handleFeeds}>Home</a>
          <a href="#" className="text-white hover:text-[#89A8B2] transition" onClick={handleMyProfile}>My Profile</a>
          <a href="#" className="text-white hover:text-[#89A8B2] transition">Logout</a>
        </div>
      </motion.nav>


      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 50 }}
        className="fixed top-16 left-0 w-full h-full bg-[#F1F0E8] bg-fixed bg-cover bg-center z-50 p-10 overflow-auto shadow-xl"
        style={{ backgroundImage: `url(${parallaximage})` }}
      >
        <div className="max-w-4xl mx-auto bg-[rgba(241,240,232,0.95)] mb-16 p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-[#2E5A6B]">
            Create Your Travel Itinerary
          </h1>
          <form className="space-y-6">
            <input type="text" placeholder="Itinerary Title" className="w-full p-3 border rounded-lg shadow-sm" />
            <textarea placeholder="Description" className="w-full p-3 border rounded-lg shadow-sm" />

            <div className="flex space-x-4">
              <input type="number" value={days} onChange={handleDaysChange} placeholder="Number of Days" className="w-1/2 p-3 border rounded-lg shadow-sm" />
              <input type="number" value={nights} onChange={handleNightsChange} placeholder="Number of Nights" className="w-1/2 p-3 border rounded-lg shadow-sm" />
            </div>

            <input type="number" placeholder="Group Size" className="w-full p-3 border rounded-lg shadow-sm" />
            <input type="text" placeholder="Estimated Budget" className="w-full p-3 border rounded-lg shadow-sm" />
            <textarea placeholder="Trip Highlights (e.g., must-see spots, experiences)" className="w-full p-3 border rounded-lg shadow-sm" />
            <textarea placeholder="Stay Suggestions (e.g., hotels, hostels, Airbnbs)" className="w-full p-3 border rounded-lg shadow-sm" />
            <input type="file" multiple className="w-full p-3 border rounded-lg shadow-sm bg-white" />

            <button type="submit" className="w-full py-3 bg-[#38496a] text-white font-semibold rounded-lg shadow-md hover:bg-[#4A7C88] transition" onClick={handleFeeds}>
              Submit
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default PostForm;
