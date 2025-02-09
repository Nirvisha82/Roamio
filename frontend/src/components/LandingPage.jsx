import React, { useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import landingimage from "../images/Landing_Image.jpg";
import parallaximage from "../images/Parallax_Image.jpg";
import logo from "../images/logo.png";
import feature1 from "../images/feature1.jpg";
import feature2 from "../images/feature2.jpg";
import feature3 from "../images/feature3.jpg";
import feature4 from "../images/feature4.jpg";
import { State, City } from "country-state-city";
import Select from "react-select";

const features = [
  { title: "Personalized Itineraries", description: "Create detailed travel plans tailored to your style.", image: feature1 },
  { title: "Interactive Maps", description: "Navigate your journey with ease using our maps.", image: feature2 },
  { title: "Local Insights", description: "Get authentic tips from locals and fellow travelers.", image: feature3 },
  { title: "Budget Planning", description: "Plan your trips within your budget effortlessly.", image: feature4 },
];

const LandingPage = () => {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);
  const [isSignUp, setIsSignUp] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch all U.S. states
  const states = State.getStatesOfCountry("US");

  // Combine states and cities into one dropdown list
  const locationOptions = states.flatMap((state) => [
    { value: state.isoCode, label: `🗺️ ${state.name} (${state.isoCode})`, isState: true },
    ...City.getCitiesOfState("US", state.isoCode).map((city) => ({
      value: city.name,
      label: `🏙️ ${city.name}, ${state.isoCode}`,
      isState: false,
    })),
  ]);

  return (
    <div className="bg-[#F1F0E8] min-h-screen text-[#4A7C88]">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-5 bg-[#38496a] shadow-md h-16 fixed top-0 w-full z-50">
        <img src={logo} alt="Roamio Logo" className="h-12 w-auto" />
        <div className="flex space-x-6">
          <a href="#register" className="text-white hover:text-[#89A8B2] transition">Register</a>
          <a href="#features" className="text-white hover:text-[#89A8B2] transition">Our Features</a>
          <a href="#aboutus" className="text-white hover:text-[#89A8B2] transition">About Us</a>
          <a href="#team" className="text-white hover:text-[#89A8B2] transition">Our Team</a>
        </div>
      </nav>

      {/* Hero Section */}
{/* Hero Section */}
<div className="flex flex-col md:flex-row justify-between items-center min-h-screen pt-30 px-6 md:px-20">
        <motion.div 
          className="max-w-xl"
          initial={{ x: -100, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-bold text-[#4A7C88]">
            Explore the world with <span className="text-6xl text-[#38496a] font-bold">Roamio</span>
          </h2>
          <p className="text-lg mt-4 text-[#000000]">
            Your one-stop solution for travel needs – discover budget itineraries, local tips, and tourist spot reviews!
          </p>
          <button className="mt-6 px-6 py-3 bg-[#E5E1DA] text-[#2E5A6B] font-semibold rounded-lg shadow-md hover:bg-[#4A7C88] transition">
            Get Started
          </button>
        </motion.div>

        <motion.div 
          className="w-full md:w-1/2 mt-8 md:mt-0"
          initial={{ x: 100, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img src={landingimage} alt="Travel" className="w-full h-full min-h-screen object-cover shadow-md" />
        </motion.div>
      </div>

      {/* Our Features Section */}
      <section id="features" className="h-screen bg-[#38496a] text-white flex items-center p-10">
        <div className="flex w-full max-w-7xl mx-auto">
          <div className="w-1/2 flex justify-center items-center">
            <motion.img 
              key={selectedFeature.image} 
              src={selectedFeature.image} 
              alt={selectedFeature.title} 
              className="w-3/4 h-auto rounded-lg shadow-lg" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="w-1/2 flex flex-col space-y-6 overflow-y-auto">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className={`p-6 bg-white text-black rounded-lg shadow-lg cursor-pointer ${selectedFeature.title === feature.title ? 'border-2 border-[#E5E1DA]' : ''}`}
                onClick={() => setSelectedFeature(feature)}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="text-lg mt-3">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Login/Signup Section */}
      <section  id="register" className="relative h-screen flex items-center justify-center bg-[#F1F0E8] overflow-hidden">
        <div className="absolute inset-0 bg-fixed bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${parallaximage})` }}></div>
        <div className="relative z-10 max-w-6xl w-full flex items-center">
          <div className="w-1/2 text-center p-10">
            <h2 className="text-4xl font-bold text-[#38496a] mb-6">Join Us!</h2>
            <p className="text-lg text-[#4A7C88]">Experience seamless travel planning with Roamio.</p>
          </div>
          <motion.div 
            className="w-1/2 bg-white shadow-lg rounded-lg p-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
          <div className="flex justify-center mb-6">
            <button onClick={() => setIsSignUp(true)} className={`px-4 py-2 ${isSignUp ? 'bg-[#38496a] text-white' : 'bg-gray-200'} rounded-l-md`}>Sign Up</button>
            <button onClick={() => setIsSignUp(false)} className={`px-4 py-2 ${!isSignUp ? 'bg-[#38496a] text-white' : 'bg-gray-200'} rounded-r-md`}>Login</button>
          </div>
          {/*<h2 className="text-3xl font-bold text-center text-[#38496a] mb-8">Join Us!</h2>*/}
          {isSignUp ? (
            <div>
              <h3 className="text-xl font-semibold text-center mb-4">Sign Up</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="w-full p-2 mb-3 border rounded" />
                <input type="text" placeholder="User Name" className="w-full p-2 mb-3 border rounded" />
                <input type="email" placeholder="Email" className="w-full p-2 mb-3 border rounded" />             
                <input type="password" placeholder="Password" className="w-full p-2 mb-3 border rounded" />
                <input type="date" placeholder="Birthdate" className="w-full p-2 mb-3 border rounded" />
                <Select
                  options={locationOptions}
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  placeholder="Select State or City"
                  className="w-full p-2 mb-3 border rounded"
                  isSearchable
                />
              </div>
              <button className="w-full bg-[#38496a] text-white py-2 rounded">Register</button>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold text-center mb-4">Login</h3>
              <input type="email" placeholder="Email" className="w-full p-2 mb-3 border rounded" />
              <input type="password" placeholder="Password" className="w-full p-2 mb-3 border rounded" />
              <button className="w-full bg-[#38496a] text-white py-2 rounded">Login</button>
            </div>
          )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
