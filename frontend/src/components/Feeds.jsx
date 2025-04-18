import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { State } from "country-state-city";
import logo from "../images/logo.png";
import profilePic1 from "../images/team4.jpg";
import profilePic2 from "../images/team1.jpg";

const mockTrendingStates = [
  { state_code: "CA", state_name: "California", follower_count: 120 },
  { state_code: "NY", state_name: "New York", follower_count: 95 },
  { state_code: "TX", state_name: "Texas", follower_count: 80 },
];

const Feeds = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [trendingStates, setTrendingStates] = useState([]);

  useEffect(() => {
    setTrendingStates(mockTrendingStates);
  }, []);

  const [user, setUser] = useState({
    Username: "john_doe"
  });
  const [profilePics, setProfilePics] = useState({
    john_doe: profilePic1,
    jane_doe: profilePic2,
  });
  const [itineraries, setItineraries] = useState([
    { ID: 1, Title: "Trip to Love City Paris", Description: "Exploring the beaches", username: "john_doe" },
    { ID: 2, Title: "New York Adventure", Description: "City that never sleeps", username: "jane_doe" },
    { ID: 3, Title: "Texas Road Trip", Description: "Wide open roads", username: "john_doe" }
  ]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCreatePost = () => {
    navigate("/post");
  };

  const handleMyProfile = () => {
    if (user?.Username) {
      navigate(`/myprofile/`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const states = State.getStatesOfCountry("US").map((s) => ({ value: s.isoCode, label: s.name }));
  const handleSearch = () => {
    if (selectedState) {
      navigate(`/state/${selectedState.value}`);
    }
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
        <div className="w-1/4 p-8 bg-[#38496a] opacity-95 space-y-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6 bg-gradient-to-br from-[#89A8B2] to-[#4A7C88] rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4 text-white text-lg border-b border-white/20 pb-2">
              Trending States
            </h3>
            <div className="space-y-4">
              {trendingStates.map((state) => (
                <div
                  key={state.state_code}
                  className="flex items-center justify-between hover:bg-white/10 px-3 py-2 rounded-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/state/${state.state_code}`)}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">{state.emoji}</span>
                    <div>
                      <p className="font-medium">{state.state_name}</p>
                      <p className="text-xs text-white/80">
                        {state.follower_count} followers
                      </p>
                    </div>
                  </div>
                  <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Scrollable */}
        <div className="w-3/4 p-6 bg-[#F1F0E8] overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="flex items-center space-x-4 mb-6">
            <h1 className="text-xl text-[#4A7C88] font-bold">
              Search your destination
            </h1>
            <div className="w-48">
              <Select
                options={states}
                value={selectedState}
                onChange={setSelectedState}
                placeholder="Select state"
                isClearable
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#4A7C88] text-[#ffffff] font-semibold rounded-lg shadow-md hover:bg-[#38496a] transition"
              disabled={!selectedState}
            >
              Search
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={handleCreatePost}
              className="px-6 py-2 bg-[#4A7C88] text-[#ffffff] font-semibold rounded-lg shadow-md hover:bg-[#38496a] transition"
            >
              Create Post
            </button>
          </div>

          <h1 className="text-2xl text-[#4A7C88] font-bold mb-4">
            All Itineraries
          </h1>

          <div className="mt-8 ml-8 flex flex-col gap-6">
            {itineraries.length > 0 ? (
              itineraries.map((itinerary) => (
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
                  {itinerary.state && (
                    <span
                      className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded cursor-pointer hover:bg-blue-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/state/${itinerary.state}`);
                      }}
                    >
                      {itinerary.state}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">
                  No itineraries available
                </p>
              </div>
            )}
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
