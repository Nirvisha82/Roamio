/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { motion } from "framer-motion";
import parallaximage from "../images/Parallax_Image.jpg";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { State } from "country-state-city";

const PostForm = () => {

  const navigate = useNavigate();

  const handleFeeds = () => {
    navigate("/feeds");
  };

  const handleMyProfile = () => {
    navigate("/myprofile");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSubmit = () => {
    navigate("/feeds");
  };

  const [days, setDays] = useState("");
  const [nights, setNights] = useState("");
  const [selectedState, setSelectedState] = useState(null);

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

  const states = State.getStatesOfCountry("US").map((s) => ({ value: s.isoCode, label: `${s.name} (${s.isoCode})` }));

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
          <button
            className="text-white hover:text-[#89A8B2] transition"
            onClick={handleFeeds}
          >
            Feed
          </button>
          <button
            className="text-white hover:text-[#89A8B2] transition"
            onClick={handleMyProfile}
          >
            My Profile
          </button>
          <button
            className="text-white hover:text-[#89A8B2] transition"
            onClick={handleLogout}
          >
            Logout
          </button>
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="relative">
              <input
                type="text"
                name="title"
                id="title"
                placeholder=" "
                className="w-full p-3 border rounded-lg shadow-sm peer focus:outline-none focus:ring-2 focus:ring-[#38496a]"
                required
              />
              <label
                htmlFor="title"
                className="absolute left-3 top-3 bg-white px-2 rounded-md text-gray-500 text-sm transition-all duration-200
                  peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-500
                  peer-[&:not(:placeholder-shown)]:top-[-10px] peer-[&:not(:placeholder-shown)]:text-sm"
              >
                Itinerary Title
              </label>
            </div>

            {/* Description */}
            <div className="relative">
              <textarea
                name="description"
                id="description"
                placeholder=" "
                className="w-full p-3 border rounded-lg shadow-sm peer focus:outline-none focus:ring-2 focus:ring-[#38496a]"
                required
              />
              <label
                htmlFor="description"
                className="absolute left-3 top-3 bg-white px-2 rounded-md text-gray-500 text-sm transition-all duration-200
                  peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-500
                  peer-[&:not(:placeholder-shown)]:top-[-10px] peer-[&:not(:placeholder-shown)]:text-sm"
              >
                Description
              </label>
            </div>

            <div className="relative">
              <Select
                options={states}
                value={selectedState}
                onChange={setSelectedState}
                placeholder="Select a State"
              />
            </div>

            {/* Number of Days */}
            <div className="flex space-x-4">
              <div className="relative w-1/2">
                <input
                  type="number"
                  name="numdays"
                  id="numdays"
                  placeholder=" "
                  min="1"
                  className="w-full p-3 border rounded-lg shadow-sm peer focus:outline-none focus:ring-2 focus:ring-[#38496a]"
                  required
                />
                <label
                  htmlFor="numdays"
                  className="absolute left-3 top-3 bg-white px-2 rounded-md text-gray-500 text-sm transition-all duration-200
                    peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-500
                    peer-[&:not(:placeholder-shown)]:top-[-10px] peer-[&:not(:placeholder-shown)]:text-sm"
                >
                  Number of Days
                </label>
              </div>

              {/* Number of Nights */}
              <div className="relative w-1/2">
                <input
                  type="number"
                  name="numnights"
                  id="numnights"
                  placeholder=" "
                  min="0"
                  className="w-full p-3 border rounded-lg shadow-sm peer focus:outline-none focus:ring-2 focus:ring-[#38496a]"
                  required
                />
                <label
                  htmlFor="numnights"
                  className="absolute left-3 top-3 bg-white px-2 rounded-md text-gray-500 text-sm transition-all duration-200
                    peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-500
                    peer-[&:not(:placeholder-shown)]:top-[-10px] peer-[&:not(:placeholder-shown)]:text-sm"
                >
                  Number of Nights
                </label>
              </div>
            </div>

            {/* Group Size */}
            <div className="relative">
              <input
                type="number"
                name="size"
                id="size"
                placeholder=" "
                min="1"
                className="w-full p-3 border rounded-lg shadow-sm peer focus:outline-none focus:ring-2 focus:ring-[#38496a]"
                required
              />
              <label
                htmlFor="size"
                className="absolute left-3 top-3 bg-white px-2 rounded-md text-gray-500 text-sm transition-all duration-200
                  peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-500
                  peer-[&:not(:placeholder-shown)]:top-[-10px] peer-[&:not(:placeholder-shown)]:text-sm"
              >
                Group Size
              </label>
            </div>

            {/* Estimated Budget */}
            <div className="relative">
              <input
                type="number"
                name="budget"
                id="budget"
                placeholder=" "
                className="w-full p-3 border rounded-lg shadow-sm peer focus:outline-none focus:ring-2 focus:ring-[#38496a]"
                required
              />
              <label
                htmlFor="budget"
                className="absolute left-3 top-3 bg-white px-2 rounded-md text-gray-500 text-sm transition-all duration-200
                  peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-500
                  peer-[&:not(:placeholder-shown)]:top-[-10px] peer-[&:not(:placeholder-shown)]:text-sm"
              >
                Estimated Budget ($)
              </label>
            </div>

            {/* Trip Highlights */}
            <div className="relative">
              <textarea
                name="highlights"
                id="highlights"
                placeholder=" "
                className="w-full p-3 border rounded-lg shadow-sm peer focus:outline-none focus:ring-2 focus:ring-[#38496a]"
              />
              <label
                htmlFor="highlights"
                className="absolute left-3 top-3 bg-white px-2 rounded-md text-gray-500 text-sm transition-all duration-200
                  peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-500
                  peer-[&:not(:placeholder-shown)]:top-[-10px] peer-[&:not(:placeholder-shown)]:text-sm"
              >
                Trip Highlights
              </label>
            </div>

            {/* Stay Suggestions */}
            <div className="relative">
              <textarea
                name="suggestions"
                id="suggestions"
                placeholder=" "
                className="w-full p-3 border rounded-lg shadow-sm peer focus:outline-none focus:ring-2 focus:ring-[#38496a]"
              />
              <label
                htmlFor="suggestions"
                className="absolute left-3 top-3 bg-white px-2 rounded-md text-gray-500 text-sm transition-all duration-200
                  peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-500
                  peer-[&:not(:placeholder-shown)]:top-[-10px] peer-[&:not(:placeholder-shown)]:text-sm"
              >
                Stay Suggestions
              </label>
            </div>

            {/* Image Upload */}
            <input
              type="file"
              multiple
              className="w-full p-3 border rounded-lg shadow-sm bg-white"
            />

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-[#38496a] text-white font-semibold rounded-lg shadow-md hover:bg-[#4A7C88] transition"
            >
              Submit
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default PostForm;
