/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import parallaximage from "../images/Parallax_Image.jpg";

const Profile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  const handleFeeds = () => {
    navigate("/feeds"); 
  };

  const handleLogout = () => {
    navigate("/"); 
  };

  const user = {
    Fullname: "John Doe",
    Email: "johndoe@example.com",
    Username: "johndoe123",
    Location: "New York, USA",
    bio: "Traveler | Photographer | Adventure Enthusiast"
  };

  const itineraries = [
    {
      ID: 1,
      Title: "Exploring Paris",
      Description: "A 5-day trip to explore the beauty of Paris.",
      NumDays: 5,
      NumNights: 4,
      Budget: "$2000",
      Size: "2",
      Highlights: "Eiffel Tower, Louvre Museum, Seine River Cruise",
      Suggestions: "Try the local pastries and book tickets in advance."
    },
    {
      ID: 2,
      Title: "Japan Adventure",
      Description: "A 10-day cultural and food adventure in Japan.",
      NumDays: 10,
      NumNights: 9,
      Budget: "$3000",
      Size: "5",
      Highlights: "Tokyo, Kyoto, Mount Fuji, Sushi Tasting",
      Suggestions: "Learn basic Japanese phrases for a better experience."
    }
  ];

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
        <button
            className="text-white hover:text-[#89A8B2] transition"
            onClick={handleFeeds}
          >
            Feed
          </button>
          <button
            className="text-white hover:text-[#89A8B2] transition"
            onClick={handleLogout}
          >
            Logout
          </button>
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
          <p><strong>Full Name:</strong> {user.Fullname}</p>
          <p><strong>Email:</strong> {user.Email}</p>
          <p><strong>Username:</strong> {user.Username}</p>
          <p><strong>Location:</strong> {user.Location}</p>
          {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#2E5A6B] mb-4">My Itineraries</h2>
          {itineraries.length > 0 ? (
            itineraries.map((itinerary) => (
              <div key={itinerary.ID} className="mb-4 p-4 bg-[#E5E1DA] rounded-lg shadow">
                <h3 className="text-xl font-bold text-[#2E5A6B]">{itinerary.Title}</h3>
                <p className="text-gray-700 mb-2">{itinerary.Description}</p>
                <div className="flex justify-between text-sm text-[#4A7C88]">
                  <span>{itinerary.NumDays} days • {itinerary.NumNights} nights</span>
                  <span>Budget: {itinerary.Budget}</span>
                  <span>Group Size: {itinerary.Size}</span>
                </div>
                {itinerary.Highlights && itinerary.Suggestions && (
                  <div className="mt-2 p-2 bg-white rounded">
                    <p className="font-medium text-[#2E5A6B]">Highlights:</p>
                    <p>{itinerary.Highlights}</p>
                    <p className="font-medium text-[#2E5A6B]">Suggestions:</p>
                    <p>{itinerary.Suggestions}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No itineraries created yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
