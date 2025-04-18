/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import parallaximage from "../images/Parallax_Image.jpg";
import profilePic from "../images/default.jpg";
import profilePic1 from "../images/team4.jpg";
import profilePic2 from "../images/team1.jpg";

const Profile = () => {
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itineraries, setItineraries] = useState([]);
  const [followersWithPics, setFollowersWithPics] = useState([]);
  const [followingsWithPics, setFollowingsWithPics] = useState([]);
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingsList, setShowFollowingsList] = useState(false);

  useEffect(() => {
    // Simulate fetching data
    const simulatedUser = {
      Fullname: "John Doe",
      Email: "john.doe@example.com",
      Username: "john_doe",
      Location: "New York, USA",
      bio: "Traveler. Explorer. Photographer."
    };
    const simulatedItineraries = [
      {
        ID: 1,
        Title: "Trip to Italy",
        Description: "Exploring the best of Italy in 10 days.",
        NumDays: 10,
        NumNights: 9,
        Budget: "$2000",
        Size: 4,
        Highlights: "Rome, Venice, Florence",
        Suggestions: "Pack light, bring a good camera"
      }
    ];
    const simulatedFollowers = [
      { Username: "john_doe", profilePic: profilePic1 },
      { Username: "jane_doe", profilePic: profilePic2 },
    ];
    const simulatedFollowings = [
      { name: "john_doe", type: "user", profilePic: profilePic1 },
      { name: "jane_doe", type: "user", profilePic: profilePic2 },
      { name: "New York", type: "page", code: "NY", profilePic: profilePic },
    ];

    setUser(simulatedUser);
    setItineraries(simulatedItineraries);
    setFollowersWithPics(simulatedFollowers);
    setFollowingsWithPics(simulatedFollowings);
    setLoading(false);
  }, []);

  const handleFeeds = () => navigate("/feeds");
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleUnfollowUser = (username) => {
    setFollowingsWithPics((prev) => prev.filter((f) => f.name !== username));
  };

  if (loading) return <div className="text-center py-8">Loading profile...</div>;
  if (!user) return <div className="text-center py-8">User not found</div>;

  return (
    <div
      className="overflow-x-hidden min-h-screen bg-fixed bg-cover bg-center pb-5"
      style={{ backgroundImage: `url(${parallaximage})` }}
    >
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto bg-[#ffffffee] p-8 rounded-2xl shadow-lg mt-20">
        <h1 className="text-3xl font-bold text-[#2E5A6B] mb-6">My Profile</h1>

        <div className="flex items-center space-x-8 mb-8">
          {/* Profile Photo */}
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

          {/* Upload Button */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#4A7C88] file:text-white hover:file:bg-[#2E5A6B]"
          />

          {/* Followers & Followings */}
          <div className="relative flex items-start space-x-14 text-[#2E5A6B] font-medium">
            {/* Followers */}
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowFollowersList(!showFollowersList);
                setShowFollowingsList(false);
              }}
            >
              <p className="text-lg font-bold">Followers</p>
              <p className="text-center">{followersWithPics?.length || 0}</p>
              {showFollowersList && (
                <div className="absolute top-16 left-0 bg-[#e5e1da88] rounded-lg shadow-lg p-4 z-40 w-64">
                  <h3 className="font-bold text-[#2E5A6B] mb-2">Followers</h3>
                  {followersWithPics.length === 0 ? (
                    <p className="text-gray-600">No Followers</p>
                  ) : (
                    followersWithPics.map((f, idx) => (
                      <div key={idx} className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                          <img
                            src={f.profilePic}
                            alt={f.Username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span onClick={() => navigate(`/userprofile/${f.Username}`)}>{f.Username}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Followings */}
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowFollowingsList(!showFollowingsList);
                setShowFollowersList(false);
              }}
            >
              <p className="text-lg font-bold">Following</p>
              <p className="text-center">{followingsWithPics?.length || 0}</p>
              {showFollowingsList && (
                <div className="absolute top-16 left-25 bg-[#e5e1da88] rounded-lg shadow-lg p-4 z-40 w-64">
                  <h3 className="font-bold text-[#2E5A6B] mb-2">Following</h3>
                  {followingsWithPics.length === 0 ? (
                    <p className="text-gray-600">No User Followed</p>
                  ) : (
                    followingsWithPics.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between space-x-3 mb-3"
                      >
                        <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                          <img
                            src={f.profilePic}
                            alt={f.Username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span
                            onClick={() => {
                              if (f.type === "user") {
                                navigate(`/userprofile/${f.name}`);
                              } else if (f.type === "page") {
                                navigate(`/state/${f.code}`);
                              }
                            }}
                          >
                            {f.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleUnfollowUser(f.name)}
                          className="px-2 py-1 rounded-lg text-sm transition bg-red-500 text-white"
                        >
                          Unfollow
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#2E5A6B] mb-4">
            Basic Details
          </h2>
          <p>
            <strong>Full Name:</strong> {user.Fullname}
          </p>
          <p>
            <strong>Email:</strong> {user.Email}
          </p>
          <p>
            <strong>Username:</strong> {user.Username}
          </p>
          <p>
            <strong>Location:</strong> {user.Location}
          </p>
          {user.bio && (
            <p>
              <strong>Bio:</strong> {user.bio}
            </p>
          )}
        </div>

        {/* Itineraries */}
        <div>
          <h2 className="text-2xl font-semibold text-[#2E5A6B] mb-4">
            My Itineraries
          </h2>
          {itineraries.length > 0 ? (
            itineraries.map((itinerary) => (
              <div
                key={itinerary.ID}
                className="mb-4 p-4 bg-[#E5E1DA] rounded-lg shadow"
                style={{ cursor: 'pointer' }} onClick={() => navigate(`/post/${itinerary.ID}`)}
              >
                <h3 className="text-xl font-bold text-[#2E5A6B]">
                  {itinerary.Title}
                </h3>
                <p className="text-gray-700 mb-2">{itinerary.Description}</p>
                <div className="flex justify-between text-sm text-[#4A7C88]">
                  <span>
                    {itinerary.NumDays} days • {itinerary.NumNights} nights
                  </span>
                  <span>Budget: {itinerary.Budget}</span>
                  <span>Group Size: {itinerary.Size}</span>
                </div>
                <div className="mt-2 p-2 bg-white rounded">
                  <p className="font-medium text-[#2E5A6B]">Highlights:</p>
                  <p>{itinerary.Highlights}</p>
                  <p className="font-medium text-[#2E5A6B]">Suggestions:</p>
                  <p>{itinerary.Suggestions}</p>
                </div>
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
