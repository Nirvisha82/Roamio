import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../images/logo.png";
import profilePic1 from "../images/team2.jpg";

const StatePage = () => {
    const navigate = useNavigate();
    const { stateCode } = useParams();
    const [stateName, setStateName] = useState("Unknown State");
    const [isScrolled, setIsScrolled] = useState(false);
    const [profilePics, setProfilePics] = useState({});
    const [itineraries, setItineraries] = useState([]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const states = {
            CA: "California",
            NY: "New York",
            TX: "Texas",
            CO: "Colorado",
            WA: "Washington",
        };
        setStateName(states[stateCode] || "Unknown State");

        const hardcodedItineraries = [
            { ID: 1, Title: "NYC Adventure", Description: "Best places in NYC", username: "aliceMiller" },
        ];
        setItineraries(hardcodedItineraries);
        setProfilePics({ aliceMiller: profilePic1 });
    }, [stateCode]);

    const handleCreatePost = () => navigate("/post");
    const handleFeeds = () => navigate("/feeds");
    const handleMyProfile = () => navigate(`/myprofile/`);
    const handleLogout = () => navigate("/");

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
                <div className="w-1/4 p-8 bg-[#38496a] opacity-95 space-y-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                    <div className="p-6 bg-gradient-to-br from-[#89A8B2] to-[#4A7C88] rounded-xl shadow-lg">
                        <h3 className="font-semibold mb-4 text-white text-lg border-b border-white/20 pb-2">
                            Trending States
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'California', code: 'CA', followers: '12.4k' },
                                { name: 'New York', code: 'NY', followers: '8.7k' },
                                { name: 'Texas', code: 'TX', followers: '15.2k' },
                                { name: 'Colorado', code: 'CO', followers: '5.9k' },
                                { name: 'Washington', code: 'WA', followers: '20.1k' },
                            ].map((state) => (
                                <div
                                    key={state.code}
                                    className={`flex items-center justify-between hover:bg-white/10 px-3 py-2 rounded-lg transition-all cursor-pointer ${state.code === stateCode ? 'bg-white/10' : ''}`}
                                    onClick={() => navigate(`/state/${state.code}`)}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-3 text-xl">{state.emoji}</span>
                                        <div>
                                            <p className="font-medium">{state.name}</p>
                                            <p className="text-xs text-white/80">{state.followers} followers</p>
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
                        <h1 className="text-3xl text-[#4A7C88] font-bold">{stateName} Itineraries</h1>
                        <button onClick={handleCreatePost} 
                          className="px-6 py-2 bg-[#4A7C88] text-[#ffffff] font-semibold rounded-lg shadow-md hover:bg-[#38496a] transition">
                            Create Post</button>
                    </div>

                    {itineraries.length > 0 ? (
                        <div className="mt-8 ml-8 flex flex-col gap-6">
                            {itineraries.map((itinerary) => (
                                <div key={itinerary.ID} className="cursor-pointer w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-black">{itinerary.Title}</h3>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-sm text-gray-400">{itinerary.username}</span>
                                            <img src={profilePics[itinerary.username]} alt="Profile" className="w-7 h-7 rounded-full" />
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600">{itinerary.Description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-lg">No itineraries found for {stateName}!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatePage;
