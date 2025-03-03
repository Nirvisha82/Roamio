import React, { useState } from "react";
import { motion } from "framer-motion";
//import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import landingimage from "../images/Landing_Image.jpg";
import parallaximage from "../images/Parallax_Image.jpg";
import logo from "../images/logo.png";
import feature1 from "../images/feature1.jpg";
import feature2 from "../images/feature2.jpg";
import feature3 from "../images/feature3.jpg";
import feature4 from "../images/feature4.jpg";
import team1 from "../images/team1.jpg";
import team2 from "../images/team2.jpg";
import team3 from "../images/team3.jpg";
import team4 from "../images/team4.jpg";
import { State, City } from "country-state-city";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const features = [
  { title: "Personalized Itineraries", description: "Create detailed travel plans tailored to your style.", image: feature1 },
  { title: "Interactive Maps", description: "Navigate your journey with ease using our maps.", image: feature2 },
  { title: "Local Insights", description: "Get authentic tips from locals and fellow travelers.", image: feature3 },
  { title: "Budget Planning", description: "Plan your trips within your budget effortlessly.", image: feature4 },
];

const teamMembers = [
  { name: "Nirvisha Soni", role: "Frontend Developer", image: team1 },
  { name: "Riddhi Mehta", role: "Frontend Developer", image: team2 },
  { name: "Harsh Khanna", role: "Backend Developer", image: team3 },
  { name: "Neel Malwatkar", role: "Backend Developer", image: team4 },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(features[0]);
  const [isSignUp, setIsSignUp] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginError, setLoginError] = useState('');

  // Fetch all U.S. states
  const states = State.getStatesOfCountry("US");

  // Combine states and cities into one dropdown list
  const locationOptions = states.flatMap((state) => [
    { value: state.isoCode, label: `${state.name} (${state.isoCode})`, isState: true },
    ...City.getCitiesOfState("US", state.isoCode).map((city) => ({
      value: city.name,
      label: `${city.name}, ${state.isoCode}`,
      isState: false,
    })),
  ]);

  const handleSignUpSubmit = () => {
    if (
      !document.querySelector('input[type="text"][placeholder="Full Name"]').value ||
      !document.querySelector('input[type="text"][placeholder="User Name"]').value ||
      !document.querySelector('input[type="email"][placeholder="Email"]').value ||
      !document.querySelector('input[type="password"][placeholder="Password"]').value ||
      !document.querySelector('input[type="date"][placeholder="Birthdate"]').value ||
      !selectedLocation
    ) {
      setErrorMessage("All fields are required.");
    } else {
      setErrorMessage(''); // Clear the error message if all fields are filled
      // Proceed with form submission logic (e.g., API call)
    }
  };

  const handleLoginSubmit = () => {
    if (
      !document.querySelector('input[type="email"][placeholder="Email"]').value ||
      !document.querySelector('input[type="password"][placeholder="Password"]').value
    ) {
      setLoginError("All Fields are required.");
    } else {
      navigate('/feeds');
    }
  };

  return (
    <div className="bg-[#F1F0E8] min-h-screen text-[#4A7C88]">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-5 bg-[#38496a] shadow-md h-16 fixed top-0 w-full z-50">
        <img src={logo} alt="Roamio Logo" className="h-12 w-auto" />
        <div className="flex space-x-6">
          <a href="#register" data-testid="navbar-join" className="text-white hover:text-[#89A8B2] transition">Join Us</a>
          <a href="#features" data-testid="navbar-features" className="text-white hover:text-[#89A8B2] transition">Our Features</a>
          <a href="#team" data-testid="navbar-team" className="text-white hover:text-[#89A8B2] transition">Our Team</a>
        </div>
      </nav>

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
      <section id="features" className="h-screen bg-[#38496a] text-white flex flex-col justify-center items-center p-10">
        <h2 className="text-4xl font-bold text-white mb-8"> Our Features </h2>
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
          <div className="w-1/2 flex flex-col space-y-6 overflow-hidden">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-4 h-25 bg-opacity-90 bg-white text-black rounded-lg shadow-lg cursor-pointer ${selectedFeature.title === feature.title ? '' : ''}`}
                onClick={() => setSelectedFeature(feature)}
                whileHover={{ backgroundColor: "#d5d2cb" }}
              >
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="text-lg mt-2">{feature.description}</p>
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
              <button data-testid="signup-nav-button" onClick={() => setIsSignUp(true)} className={`px-4 py-2 ${isSignUp ? 'bg-[#38496a] text-white' : 'bg-gray-200'} rounded-l-md`}>Sign Up</button>
              <button data-testid="login-nav-button" onClick={() => setIsSignUp(false)} className={`px-4 py-2 ${!isSignUp ? 'bg-[#38496a] text-white' : 'bg-gray-200'} rounded-r-md`}>Login</button>
            </div>
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
                {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}
                <button data-testid="signup-button"
                  className="w-full bg-[#38496a] text-white py-2 rounded"
                  onClick={handleSignUpSubmit}
                >
                  Register
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-center mb-4">Login</h3>
                <input type="email" placeholder="Email" className="w-full p-2 mb-3 border rounded" />
                <input type="password" placeholder="Password" className="w-full p-2 mb-3 border rounded" />
                {loginError && <p className="text-red-600 text-center">{loginError}</p>}
                <button data-testid="login-button" id="login-button" className="w-full bg-[#38496a] text-white py-2 rounded" onClick={handleLoginSubmit}>Login</button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="h-full bg-[#38496a] text-white flex flex-col items-center justify-center p-10">
        <h2 className="text-4xl font-bold mb-20">Meet Our Team</h2>
        <div className="flex space-x-20">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full shadow-lg" />
              <h3 className="text-xl font-semibold mt-3">{member.name}</h3>
              <p className="text-md text-[#4A7C88] mb-20">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer id="footer" className="bg-[#F1F0E8] text-black text-center py-2">
        <p className="text-sm">&copy; 2025 Roamio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
