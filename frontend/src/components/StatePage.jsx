import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../images/logo.png";
import profilePic from "../images/team4.jpg";
import profilePic1 from "../images/team1.jpg";
import { State } from "country-state-city";

const mockUser = {
    Username: "john_doe"
};

const mockTrendingStates = [
    { state_code: "CA", state_name: "California", follower_count: 120 },
    { state_code: "NY", state_name: "New York", follower_count: 95 },
    { state_code: "TX", state_name: "Texas", follower_count: 80 },
];

const mockItineraries = [
    {
        ID: 1,
        Title: "A Weekend in NYC",
        Description: "Explore Times Square, Central Park, and Broadway!",
        username: "john_doe"
    },
    {
        ID: 2,
        Title: "Upstate New York Escape",
        Description: "Relaxing getaway in the Catskills with hikes and waterfalls.",
        username: "jane_doe"
    },
];


const StatePage = () => {
    const navigate = useNavigate();
    const { stateCode } = useParams();
    const [stateName, setStateName] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [profilePics, setProfilePics] = useState({});
    const [itineraries, setItineraries] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [trendingStates, setTrendingStates] = useState([]);

    useEffect(() => {
        // Simulate logged-in user
        setUser(mockUser);

        // Simulate following status
        setIsFollowing(false);

        // Simulate trending states
        setTrendingStates(mockTrendingStates);

        // Scroll behavior
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const states = State.getStatesOfCountry("US");
        const state = states.find((s) => s.isoCode === stateCode);
        if (state) {
            setStateName(state.name);
        } else {
            navigate("/feeds");
        }

        // Simulate fetching itineraries
        setItineraries(mockItineraries);

        // Simulate profile pics
        setProfilePics({
            john_doe: profilePic,
            jane_doe: profilePic1
        });
    }, [stateCode, navigate]);

    const handleFollowState = () => setIsFollowing(true);
    const handleUnfollowState = () => setIsFollowing(false);

    const handleCreatePost = () => navigate("/post");
    const handleFeeds = () => navigate("/feeds");
    const handleMyProfile = () => navigate(`/myprofile/`);
    const handleLogout = () => {
        setUser(null);
        navigate("/");
    };

    return (
        <div className="relative flex flex-col min-h-screen">
            <nav className="flex justify-between items-center p-5 bg-[#38496a] shadow-md h-16 fixed top-0 w-full z-50">
                <img src={logo} alt="Roamio Logo" className="h-12 w-auto" />
                <div className="flex space-x-6">
                    <button className="text-white hover:text-[#89A8B2]" onClick={handleFeeds}>
                        Feed
                    </button>
                    <button className="text-white hover:text-[#89A8B2]" onClick={handleMyProfile}>
                        My Profile
                    </button>
                    <button className="text-white hover:text-[#89A8B2]" onClick={handleLogout}>
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

                <div className="w-3/4 p-6 bg-[#F1F0E8] overflow-y-auto h-[calc(100vh-4rem)]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl text-[#4A7C88] font-bold">
                                {stateName} Itineraries
                            </h1>
                            {isFollowing ? (
                                <button
                                    onClick={handleUnfollowState}
                                    className="px-4 py-1 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition text-sm"
                                >
                                    Unfollow
                                </button>
                            ) : (
                                <button
                                    onClick={handleFollowState}
                                    className="px-4 py-1 bg-[#4A7C88] text-white font-semibold rounded-lg shadow-md hover:bg-[#38496a] transition text-sm"
                                >
                                    Follow
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleCreatePost}
                            className="px-6 py-2 bg-[#4A7C88] text-white font-semibold rounded-lg shadow-md hover:bg-[#38496a] transition"
                        >
                            Create Post
                        </button>
                    </div>

                    {itineraries.length > 0 ? (
                        <div className="mt-8 ml-8 flex flex-col gap-6">
                            {itineraries.map((itinerary) => (
                                <div
                                    key={itinerary.ID}
                                    onClick={() => navigate(`/post/${itinerary.ID}`)}
                                    className="cursor-pointer w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
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
