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
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePics, setProfilePics] = useState({});
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      navigate("/");
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  const states = State.getStatesOfCountry("US").map((s) => ({ value: s.isoCode, label: s.name }));

  const handleCreatePost = () => {
    navigate("/post");
  };

  const handleMyProfile = () => {
    if (user?.Username) {
      navigate(`/myprofile/${user.Username}`);
    }
  };

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetch("http://localhost:8080/itineraries");
        if (!response.ok) throw new Error('Failed to fetch itineraries');
        const data = await response.json();
        setItineraries(data);

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
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchItineraries();
  }, []);

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
        {/* Left Sidebar - Fixed */}
        <div className="w-1/4 p-10 bg-[#38496a] opacity-95 space-y-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6 bg-gradient-to-br from-[#89A8B2] to-[#4A7C88] rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4 text-white text-lg border-b border-white/20 pb-2">
              Trending States
            </h3>
            <div className="space-y-4">
              {[
                { name: 'California', followers: '12.4k' },
                { name: 'New York', followers: '8.7k' },
                { name: 'Texas', followers: '15.2k'},
                { name: 'Colorado', followers: '5.9k' },
                { name: 'Washington', followers: '20.1k'},
              ].map((user) => (
                <div 
                  key={user.name}
                  className="flex items-center justify-between hover:bg-white/10 px-3 py-2 rounded-lg transition-all cursor-pointer"
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">{user.emoji}</span>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-white/80">{user.followers} followers</p>
                    </div>
                  </div>
                  <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Scrollable */}
        <div className="w-3/4 p-6 bg-[#F1F0E8] overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="flex items-center space-x-6 mb-6">
            <h1 className="text-xl text-[#4A7C88] font-bold">
              Search your destination
            </h1>
            <div className="w-48">
              <Select 
                options={states} 
                value={selectedState} 
                onChange={setSelectedState} 
                placeholder="Select state" 
              />
            </div>
            <span className="text-gray-400">|</span>
            <button
              onClick={handleCreatePost}
              className="px-6 py-2 bg-[#4A7C88] text-[#ffffff] font-semibold rounded-lg shadow-md hover:bg-[#38496a] transition"
            >
              Create Post
            </button>
          </div>

          <h1 className="text-2xl text-[#4A7C88] font-bold mb-4">
            {selectedState ? selectedState.label : "All States"}
          </h1>

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