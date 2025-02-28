import React, { useState } from "react";
import Select from "react-select";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { State, City } from "country-state-city";
import logo from "../images/logo.png";

const Feeds = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Fetch all US states
  const states = State.getStatesOfCountry("US").map((s) => ({
    value: s.isoCode,
    label: s.name,
  }));

  // Fetch cities based on selected state
  const cities =
    selectedState
      ? City.getCitiesOfState("US", selectedState.value).map((c) => ({
          value: c.name,
          label: c.name,
        }))
      : [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-5 bg-[#38496a] shadow-md h-16 fixed top-0 w-full z-50">
        <img src={logo} alt="Roamio Logo" className="h-12 w-auto" />
        <div className="flex space-x-6">
          <a href="#" className="text-white hover:text-[#89A8B2] transition">My Profile</a>
          <a href="#" className="text-white hover:text-[#89A8B2] transition">Logout</a>
        </div>
      </nav>
      
      {/* Content Wrapper with No Extra Padding for Navbar */}
      <div className="flex flex-grow mt-16">
        {/* Sidebar */}
        <div className="w-1/4 p-10 bg-[#F1F0E8] border-r-2 border-gray-400">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <label className="block mb-2">State</label>
          <Select
            options={states}
            value={selectedState}
            onChange={setSelectedState}
            placeholder="Select a State"
          />

          <label className="block mt-4 mb-2">City</label>
          <Select
            options={cities}
            value={selectedCity}
            onChange={setSelectedCity}
            placeholder="Select a City"
            isDisabled={!selectedState}
          />
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-6 bg-[#F1F0E8]">
          <h1 className="text-2xl font-bold mb-4">
            {selectedCity && selectedState
              ? `${selectedCity.label}, ${selectedState.label}`
              : "Select a State & City"}
          </h1>
          <button className="mt-6 px-6 py-3 bg-[#E5E1DA] text-[#2E5A6B] font-semibold rounded-lg shadow-md hover:bg-[#4A7C88] transition">
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feeds;
