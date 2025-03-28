import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { State, City } from "country-state-city";
import logo from "../images/logo.png";
import profilePic1 from "../images/team1.jpg";
import profilePic2 from "../images/team2.jpg";
import profilePic3 from "../images/team3.jpg";
import profilePic4 from "../images/team4.jpg";

const Feeds = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null); // Store user session info
  const [profilePics, setProfilePics] = useState({}); // Store profile pics by username

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      navigate("/"); // Redirect to login if not logged in
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]); // Added navigate to dependencies

  const posts = [
    { id: 1, title: "Post 1", content: "This is the content of Post 1", username: "SoniNirvisha" },
    { id: 2, title: "Post 2", content: "This is the content of Post 2", username: "RiddhiMehta" },
    { id: 3, title: "Post 3", content: "This is the content of Post 3", username: "Harsh" },
    { id: 4, title: "Post 4", content: "This is the content of Post 4", username: "NeelM" },
  ];

  const states = State.getStatesOfCountry("US").map((s) => ({ value: s.isoCode, label: s.name }));
  const cities = selectedState ? City.getCitiesOfState("US", selectedState.value).map((c) => ({ value: c.name, label: c.name })) : [];
  const handleCreatePost = () => {
    navigate("/post");
  };

  const handleMyProfile = () => {
    if (user?.Username) {
      navigate(`/myprofile/${user.Username}`);
    }
  };

  const [itineraries, setItineraries] = useState([]);

  // Fetch itineraries
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetch("http://localhost:8080/itineraries");
        if (!response.ok) throw new Error('Failed to fetch itineraries');
        const data = await response.json();
        setItineraries(data);

        // Fetch profile pictures for each user
        const fetchProfilePics = async () => {
          const pics = {};
          for (const itinerary of data) {
            const username = itinerary.username;
            if (!pics[username]) {
              try {
                const userResponse = await fetch(`http://localhost:8080/users/${username}/profile-pic`);
                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  pics[username] = userData.profile_pic_url;
                }
              } catch (error) {
                console.error("Error fetching profile pic for", username, error);
              }
            }
          }
          setProfilePics(pics);
        };

        fetchProfilePics();
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchItineraries();
  }, []); // Empty dependency array ensures this only runs once on component mount

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <nav className="flex justify-between items-center p-5 bg-[#38496a] shadow-md h-16 fixed top-0 w-full z-50">
        <img src={logo} alt="Roamio Logo" className="h-12 w-auto" />
        <div className="flex space-x-6">
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
      </nav>

      <div className="flex flex-grow mt-16">
        <div className="w-1/4 p-10 bg-[#38496a] opacity-95">
          <h2 className="text-xl font-semibold mb-4 text-white">Filters</h2>
          <label className="block mb-2 text-white">State</label>
          <Select options={states} value={selectedState} onChange={setSelectedState} placeholder="Select a State" />
          <label className="block mt-4 mb-2 text-white">City</label>
          <Select options={cities} value={selectedCity} onChange={setSelectedCity} placeholder="Select a City" isDisabled={!selectedState} />
        </div>

        <div className="w-3/4 p-6 bg-[#F1F0E8]">
          <h1 className="text-2xl text-[#4A7C88] font-bold mb-4">
            {selectedCity
              ? `${selectedCity.label}, ${selectedState?.label || ""}`
              : selectedState
                ? selectedState.label
                : "Select a State & City"}
          </h1>
          <button
            onClick={handleCreatePost}
            className="mt-6 px-6 py-3 bg-[#4A7C88] text-[#ffffff] font-semibold rounded-lg shadow-md hover:bg-[#38496a] transition"
          >
            Create Post
          </button>

          <div className="mt-8 ml-8 flex flex-col gap-6">
            {itineraries.map((itinerary) => (
              <div
                key={itinerary.ID}
                onClick={() => navigate(`/post/${itinerary.ID}`)} 
                className="cursor-pointer w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 relative"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-black">{itinerary.Title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-sm text-gray-400">{itinerary.username}</span>
                    <img 
                      src={profilePics[itinerary.username] || profilePic1} 
                      alt="Profile" 
                      className="w-7 h-7 rounded-full object-cover" 
                    />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{itinerary.Description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-[#4A7C88] text-white w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:bg-[#38496a] transition"
        >
          <span className="text-2xl">&uarr;</span>
        </button>
      )}
    </div>
  );
};

export default Feeds;
