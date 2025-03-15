/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect  } from "react";
import { motion } from "framer-motion";
import parallaximage from "../images/Parallax_Image.jpg";
import logo from "../images/logo.png";
import { useParams, useNavigate } from "react-router-dom";


const PostForm = () => {
  const [user, setUser] = useState(null);
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
    numdays: 0,
    numnights: 0,
    size: 1,
    budget: '',
    highlights: '',
    suggestions: '',
    images: ''
  });
  // Hardcoded state ID as per requirements
  const stateID = 1;
  const images_url="WWW.dummy.com"

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.ID) {
      alert('User not logged in');
      return;
    }

    try {
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
          Budget: formData.budget,
          Highlights: formData.highlights,
          Suggestions: formData.suggestions,
          Images: images_url
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
            <input type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Itinerary Title" 
            className="w-full p-3 border rounded-lg shadow-sm"
            required 
            />

            <textarea 
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full p-3 border rounded-lg shadow-sm"
            required
            />

            <div className="flex space-x-4">
              <input 
              type="number" 
              name="numdays"
              value={formData.numdays}
              onChange={handleInputChange}
              min="1"
              placeholder="Number of Days" 
              className="w-1/2 p-3 border rounded-lg shadow-sm"
              required
              />

              <input 
              type="number" 
              name="numnights"
              value={formData.numnights}
              onChange={handleInputChange}
              min="0" 
              placeholder="Number of Nights" 
              className="w-1/2 p-3 border rounded-lg shadow-sm" 
              required
              />
            </div>

            <input 
            type="number"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            min="1"
            placeholder="Group Size" 
            className="w-full p-3 border rounded-lg shadow-sm" 
            required
            />

            <input 
            type="text"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            placeholder="Estimated Budget" 
            className="w-full p-3 border rounded-lg shadow-sm" 
            required
            />

            <textarea
            name="highlights"
            value={formData.highlights}
            onChange={handleInputChange}
            placeholder="Trip Highlights (e.g., must-see spots, experiences)" 
            className="w-full p-3 border rounded-lg shadow-sm" 
            />
            
            <textarea 
            name="suggestions"
            value={formData.suggestions}
            onChange={handleInputChange}
            placeholder="Stay Suggestions (e.g., hotels, hostels, Airbnbs)" 
            className="w-full p-3 border rounded-lg shadow-sm" 
            />
            
            <input 
            type="file" 
            multiple className="w-full p-3 border rounded-lg shadow-sm bg-white" 
            />

            <button type="submit" 
              className="w-full py-3 bg-[#38496a] text-white font-semibold rounded-lg shadow-md hover:bg-[#4A7C88] transition">
              Submit
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default PostForm;
