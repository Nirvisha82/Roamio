/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import parallaximage from "../images/Parallax_Image.jpg";

const Profile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null); // State to store user details
  const [loading, setLoading] = useState(true); // Loading state to handle the session check

  useEffect(() => {
    // Check if the session exists when the component is mounted
    const sessionUser = localStorage.getItem("user");
    if (!sessionUser) {
      // Redirect to login page if session is not found
      navigate("/", { replace: true });
    } else {
      setUser(JSON.parse(sessionUser));
    }
    setLoading(false); // Set loading to false once session check is done
  }, [navigate]);

  // Don't render the profile page while checking for session
  if (loading) {
    return null; // Return null to prevent rendering before session check is complete
  }

  const handleFeeds = () => {
    navigate("/feeds");
  };

  const userDetails = user || { // Use user details from session if available
    name: "John Doe",
    email: "johndoe@example.com",
    location: "New York, USA",
    bio: "Wanderlust traveler and adventure seeker",
    itineraries: [
      {
        title: "Exploring California",
        description: "A 5-day road trip covering San Francisco, LA, and Yosemite.",
      },
      {
        title: "Magical Paris",
        description: "A romantic getaway exploring the Eiffel Tower, Louvre, and more.",
      },
    ],
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="overflow-x-hidden min-h-screen bg-fixed bg-cover bg-center pb-5" style={{ backgroundImage: `url(${parallaximage})` }}>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-5 bg-[#38496a] shadow-md h-16 fixed top-0 w-full z-50">
        <img src={logo} alt="Roamio Logo" className="h-12 w-auto" />
        <div className="flex space-x-6">
          <a href="#" className="text-white hover:text-[#89A8B2] transition" onClick={handleFeeds}>Home</a>
          <a href="#" className="text-white hover:text-[#89A8B2] transition">Logout</a>
        </div>
      </nav>
      
      <div className="max-w-4xl mx-auto bg-[#ffffffee] p-8 rounded-2xl shadow-lg mt-20">
        <h1 className="text-3xl font-bold text-[#2E5A6B] mb-6">My Profile</h1>
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-32 h-32 bg-[#E5E1DA] rounded-full flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#2E5A6B]">No Photo</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#4A7C88] file:text-white hover:file:bg-[#2E5A6B]"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#2E5A6B] mb-4">Basic Details</h2>
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Location:</strong> {userDetails.location}</p>
          <p><strong>Bio:</strong> {userDetails.bio}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#2E5A6B] mb-4">My Itineraries</h2>
          {userDetails.itineraries.map((itinerary, index) => (
            <div
              key={index}
              className="mb-4 p-4 bg-[#E5E1DA] rounded-lg shadow"
            >
              <h3 className="text-xl font-bold text-[#2E5A6B]">
                {itinerary.title}
              </h3>
              <p>{itinerary.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
