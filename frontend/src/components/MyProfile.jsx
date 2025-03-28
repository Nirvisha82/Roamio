/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import parallaximage from "../images/Parallax_Image.jpg";
import AWS from "aws-sdk";

require('dotenv').config();

const awsAccessKey = process.env.REACT_APP_AWS_ACCESS_KEY;
const awsSecretKey = process.env.REACT_APP_AWS_SECRET_KEY;

AWS.config.update({
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretKey,
  region: "us-east-2",
});
const s3 = new AWS.S3();

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check session first
        const storedUser = localStorage.getItem("currentUser");
        console.log('Session check:', storedUser);

        if (!storedUser) {
          navigate("/");
          return;
        }
  
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
  
        // Fetch itineraries AFTER setting user
        const itinerariesResponse = await fetch(
          `http://localhost:8080/itineraries/user/${parsedUser.ID}` // Use parsedUser directly
        );
        
        if (!itinerariesResponse.ok) {
          throw new Error('Failed to fetch itineraries');
        }
        
        const itinerariesData = await itinerariesResponse.json();
        setItineraries(itinerariesData);
  
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
  
    };

    fetchData();
  }, [username, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const fileName = `${user.Username}-${Date.now()}-${file.name}`;
        const params = {
          Bucket: "roamio-my-profile", // Replace with your S3 bucket name
          Key: fileName,
          Body: file,
          ContentType: file.type,
        };
  
        // Upload file to S3
        const uploadResponse = await s3.upload(params).promise();
        console.log("File uploaded successfully", uploadResponse);
  
        // After successful upload, set the image URL
        const imageUrl = uploadResponse.Location; // S3 generated URL
        setProfileImage(imageUrl);
  
        // You can save the URL in user data, local storage, or back-end if necessary
        // For example: localStorage.setItem("profileImage", imageUrl);
  
      } catch (error) {
        console.error("Error uploading image to S3:", error);
      }
    }
  };  

  const handleFeeds = () => navigate("/feeds");
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  if (loading) return <div className="text-center py-8">Loading profile...</div>;
  if (!user) return <div className="text-center py-8">User not found</div>;

  return (
    <div className="overflow-x-hidden min-h-screen bg-fixed bg-cover bg-center pb-5" 
         style={{ backgroundImage: `url(${parallaximage})` }}>
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

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto bg-[#ffffffee] p-8 rounded-2xl shadow-lg mt-20">
        <h1 className="text-3xl font-bold text-[#2E5A6B] mb-6">My Profile</h1>
        
        {/* Profile Image Section */}
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

        {/* User Details Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#2E5A6B] mb-4">Basic Details</h2>
          <p><strong>Full Name:</strong> {user.Fullname}</p>
          <p><strong>Email:</strong> {user.Email}</p>
          <p><strong>Username:</strong> {user.Username}</p>
          <p><strong>Location:</strong> {user.Location}</p>
          {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
        </div>

        {/* Itineraries Section */}
        <div>
          <h2 className="text-2xl font-semibold text-[#2E5A6B] mb-4">My Itineraries</h2>
          {itineraries.length > 0 ? (
            itineraries.map((itinerary) => (
              <div key={itinerary.ID} className="mb-4 p-4 bg-[#E5E1DA] rounded-lg shadow" style={{ cursor: 'pointer' }} onClick={() => navigate(`/post/${itinerary.ID}`)}>
                <h3 className="text-xl font-bold text-[#2E5A6B]">{itinerary.Title}</h3>
                <p className="text-gray-700 mb-2">{itinerary.Description}</p>
                <div className="flex justify-between text-sm text-[#4A7C88]">
                  <span>{itinerary.NumDays} days • {itinerary.NumNights} nights</span>
                  <span>Budget: {itinerary.Budget}</span>
                  <span>Group Size: {itinerary.Size}</span>&nbsp;
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
