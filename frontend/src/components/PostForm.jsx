/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import parallaximage from "../images/Parallax_Image.jpg";
import logo from "../images/logo.png";
import Select from "react-select";
import { State } from "country-state-city";
import { useParams, useNavigate } from "react-router-dom";
import AWS from "aws-sdk";

const awsAccessKey = process.env.REACT_APP_AWS_ACCESS_KEY;
const awsSecretKey = process.env.REACT_APP_AWS_SECRET_KEY;

AWS.config.update({
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretKey,
  region: "us-east-2",
});
const s3 = new AWS.S3();

const PostForm = () => {
  const [user, setUser] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    console.log('Session check:', storedUser);

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      navigate("/");
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]); // Added navigate to dependencies

  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
  };

  // Upload images to S3 and get URLs
  const uploadImagesToS3 = async () => {
    const uploadedImageUrls = await Promise.all(
      formData.images.map(async (file) => {
        const params = {
          Bucket: "roamio-my-profile",
          Key: `uploads-${user.Username}-${Date.now()}-${file.name}`,
          Body: file,
          ContentType: file.type,
        };
        const uploadResult = await s3.upload(params).promise();
        return uploadResult.Location; // URL of uploaded file
      })
    );

    // Join the image URLs into a single string with semicolons
    const imageUrlsString = uploadedImageUrls.join('; ');

    // Log image URLs string to the console
    //console.log("Uploaded Image URLs (semicolon separated):", imageUrlsString);
    
    return imageUrlsString; // Return the semicolon-separated string
  };


  const handleFeeds = () => {
    navigate("/feeds");
  };

  const handleMyProfile = () => {
    if (user?.Username) {
      navigate(`/myprofile/${user.Username}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    numdays: null,
    numnights: null,
    size: null,
    budget: '',
    highlights: '',
    suggestions: '',
    images: ''
  });

  // Hardcoded state ID as per requirements
  const stateID = 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.ID) {
      alert("User not logged in");
      return;
    }

    if (!user?.ID) {
      alert('User not logged in');
      return;
    }
    const formattedBudget = `$${formData.budget}`;

    try {
      const imageUrls = await uploadImagesToS3();
      const response = await fetch('http://localhost:8080/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: user.ID,
          StateId: stateID,
          Title: formData.title,
          Description: formData.description,
          NumDays: Number(formData.numdays),
          NumNights: Number(formData.numnights),
          Size: Number(formData.size),
          Budget: formattedBudget,
          Highlights: formData.highlights,
          Suggestions: formData.suggestions,
          Images: imageUrls,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create itinerary:', data);
      }

      const data = await response.json();
      alert('Itinerary created successfully!');
      navigate('/feeds');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error creating itinerary');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
                value={formData.title}
                onChange={handleInputChange}
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
                value={formData.description}
                onChange={handleInputChange}
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
                  value={formData.numdays}
                  onChange={handleInputChange}
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
                  value={formData.numnights}
                  onChange={handleInputChange}
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
                value={formData.size}
                onChange={handleInputChange}
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
                value={formData.budget}
                onChange={handleInputChange}
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
                value={formData.highlights}
                onChange={handleInputChange}
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
                value={formData.suggestions}
                onChange={handleInputChange}
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
              onChange={handleFileChange}
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
