import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../images/logo.png";
import profilePic1 from "../images/team1.jpg";
import { State } from "country-state-city";
import config from "../config"; // Adjust path if needed

const StatePage = () => {
  const navigate = useNavigate();
  const { stateCode } = useParams();
  const [stateName, setStateName] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePics, setProfilePics] = useState({});
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [trendingStates,setTrendingStates] = useState([]);


  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      checkFollowingStatus(parsedUser.Username, stateCode);
    } else {
      navigate("/");
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate, stateCode]);

  useEffect(() => {
    const states = State.getStatesOfCountry("US");
    const state = states.find(s => s.isoCode === stateCode);
    if (state) {
      setStateName(state.name);
    } else {
      navigate("/feeds");
    }
  }, [stateCode, navigate]);

  useEffect(() => {
    const fetchStateItineraries = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:8080/itineraries/state/${stateCode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch itineraries');
        }
        
        const data = await response.json();
        const fetchedItineraries = data.itineraries || [];
        setItineraries(fetchedItineraries);

        if (fetchedItineraries.length > 0) {
          const pics = {};
          for (const itinerary of fetchedItineraries) {
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
        }
      } catch (error) {
        console.error("Error fetching itineraries:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStateItineraries();
  }, [user, stateCode]);

    useEffect(()=>{
      const fetchTrendingStates=async()=>{
        try {
          const response = await fetch(`http://localhost:8080/itineraries/top-states?k=${config.TRENDING_STATES_LIMIT}`);
          if (!response.ok) throw new Error('Failed to fetch itineraries');
          const data = await response.json();
          setTrendingStates(data);
        } catch (error) {
          console.error("Error fetching itineraries:", error);
        }
      }
      fetchTrendingStates();
    },[]);
    

  const checkFollowingStatus = async (username, stateCode) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const response = await fetch("http://localhost:8080/users/follow/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          follower_id: currentUser.Username,
          target_id: stateCode,
          type: "page"
        })
      });
      if (response.ok) setIsFollowing((await response.json()).isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollowState = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const response = await fetch("http://localhost:8080/users/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          follower_id: currentUser.Username,
          target_id: stateCode,
          type: "page"
        })
      });
      if (response.ok) setIsFollowing(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollowState = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const response = await fetch("http://localhost:8080/users/unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          follower_id: currentUser.Username,
          target_id: stateCode,
          type: "page"
        })
      });
      if (response.ok) setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleCreatePost = () => {
    navigate("/post");
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

  return (
    <div className="relative flex flex-col min-h-screen">
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
        <div className="w-1/4 p-10 bg-[#38496a] opacity-95 space-y-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
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
                      <p className="text-xs text-white/80">{state.follower_count} followers</p>
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

        <div className="w-3/4 p-6 bg-[#F1F0E8] overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl text-[#4A7C88] font-bold">
                {stateName} Itineraries
              </h1>
              {isFollowing ? (
                <button
                  onClick={handleUnfollowState}
                  disabled={followLoading}
                  className="px-4 py-1 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition text-sm disabled:opacity-50"
                >
                  {followLoading ? 'Processing...' : 'Unfollow'}
                </button>
              ) : (
                <button
                  onClick={handleFollowState}
                  disabled={followLoading}
                  className="px-4 py-1 bg-[#4A7C88] text-white font-semibold rounded-lg shadow-md hover:bg-[#38496a] transition text-sm disabled:opacity-50"
                >
                  {followLoading ? 'Processing...' : 'Follow'}
                </button>
              )}
            </div>
            <button
              onClick={handleCreatePost}
              className="px-6 py-2 bg-[#4A7C88] text-[#ffffff] font-semibold rounded-lg shadow-md hover:bg-[#38496a] transition"
            >
              Create Post
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Loading itineraries...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 text-lg">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-[#4A7C88] text-white rounded-lg hover:bg-[#38496a] transition"
              >
                Try Again
              </button>
            </div>
          ) : itineraries.length > 0 ? (
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
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">
                No itineraries found for {stateName}! Want to post one?
              </p>
            </div>
          )}
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

export default StatePage;