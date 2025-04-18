import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import profilePic from "../images/default.jpg";
import profilePic1 from "../images/team1.jpg";
import profilePic2 from "../images/team4.jpg";
import parallaximage from "../images/Parallax_Image.jpg";

const UserProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followersWithPics, setFollowersWithPics] = useState([]);
    const [followingsWithPics, setFollowingsWithPics] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [showFollowersList, setShowFollowersList] = useState(false);
    const [showFollowingsList, setShowFollowingsList] = useState(false);

    useEffect(() => {
        // Hardcoded user data
        const allUsers = [
            { Username: "john_doe", Fullname: "John Doe", Email: "john@example.com", Location: "New York, USA", bio: "Traveler and foodie." },
            { Username: "jane_doe", Fullname: "Jane Doe", Email: "jane@example.com", Location: "Los Angeles, USA" }
        ];
        const currentUser = allUsers[0];
        const foundUser = allUsers.find(u => u.Username === username);
        if (!foundUser) return;

        setUser(foundUser);
        setProfileImage(profilePic2);
        setIsOwnProfile(false);
        setIsFollowing(true);

        const allItineraries = [
            {
                ID: 1,
                Title: "A Weekend in NYC",
                Description: "Explore Times Square, Central Park, and Broadway!",
                NumDays: 3,
                NumNights: 2,
                Budget: "$500",
                Size: "2",
                Highlights: "Central Park, Broadway",
                Suggestions: "Try the street food"
            }
        ];

        setItineraries(allItineraries);

        const mockFollowers = [
            { Username: "jane_doe", profilePic: profilePic1 }
        ];
        setFollowersWithPics(mockFollowers);

        const mockFollowings = [
            { name: "travelpage", type: "page", code: "NY", profilePic: profilePic }
        ];
        setFollowingsWithPics(mockFollowings);

        setLoading(false);
    }, [username]);

    const handleFeeds = () => navigate("/feeds");
    const handleMyProfile = () => navigate(`/myprofile/`);
    const handleLogout = () => navigate("/");

    if (loading) return <div className="text-center py-8">Loading user profile...</div>;
    if (!user) return <div className="text-center py-8">User not found</div>;

    return (
        <div className="overflow-x-hidden min-h-screen bg-fixed bg-cover bg-center pb-5" style={{ backgroundImage: `url(${parallaximage})` }}>
            <nav className="flex justify-between items-center p-5 bg-[#38496a] shadow-md h-16 fixed top-0 w-full z-50">
                <img src={logo} alt="Roamio Logo" className="h-12 w-auto" />
                <div className="flex space-x-6">
                    <button className="text-white hover:text-[#89A8B2] transition" onClick={handleFeeds}>Feed</button>
                    <button className="text-white hover:text-[#89A8B2] transition" onClick={handleMyProfile}>My Profile</button>
                    <button className="text-white hover:text-[#89A8B2] transition" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto bg-[#ffffffee] p-8 rounded-2xl shadow-lg mt-20">
                <h1 className="text-3xl font-bold text-[#2E5A6B] mb-6">{user.Username}'s Profile</h1>

                <div className="flex items-center space-x-8 mb-8">
                    <div className="w-32 h-32 bg-[#E5E1DA] rounded-full flex items-center justify-center overflow-hidden">
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    </div>

                    {!isOwnProfile && (
                        <button
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={`px-6 py-2 rounded-lg font-semibold transition ${isFollowing ? "bg-red-500 text-white" : "bg-[#4A7C88] text-white"}`}
                        >
                            {isFollowing ? "Unfollow -" : "Follow +"}
                        </button>
                    )}

                    <div className="relative flex items-start space-x-14 text-[#2E5A6B] font-medium">
                        <div className="flex ml-36 flex-col space-y-1 cursor-pointer relative" onClick={() => { setShowFollowersList(!showFollowersList); setShowFollowingsList(false); }}>
                            <p className="text-lg font-bold text-center">Followers</p>
                            <p className="text-center">{followersWithPics.length}</p>
                            {showFollowersList && (
                                <div className="absolute top-16 left-0 bg-[#e5e1da88] rounded-lg shadow-lg p-4 z-40 w-64">
                                    <h3 className="font-bold text-[#2E5A6B] mb-2">Followers</h3>
                                    {followersWithPics.map((f, idx) => (
                                        <div key={idx} className="flex items-center space-x-3 mb-3">
                                            <img src={f.profilePic} alt={f.Username} className="w-8 h-8 rounded-full object-cover" />
                                            <span onClick={() => navigate(`/userprofile/${f.Username}`)} className="cursor-pointer">{f.Username}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col space-y-1 cursor-pointer relative" onClick={() => { setShowFollowingsList(!showFollowingsList); setShowFollowersList(false); }}>
                            <p className="text-lg font-bold text-center">Following</p>
                            <p className="text-center">{followingsWithPics.length}</p>
                            {showFollowingsList && (
                                <div className="absolute top-16 left-0 bg-[#e5e1da88] rounded-lg shadow-lg p-4 z-40 w-64">
                                    <h3 className="font-bold text-[#2E5A6B] mb-2">Following</h3>
                                    {followingsWithPics.map((f, idx) => (
                                        <div key={idx} className="flex items-center space-x-3 mb-3">
                                            <img src={f.profilePic} alt={f.name} className="w-8 h-8 rounded-full object-cover" />
                                            <span onClick={() => f.type === "page" ? navigate(`/state/${f.code}`) : navigate(`/userprofile/${f.name}`)} className="cursor-pointer">{f.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-[#2E5A6B] mb-4">Basic Details</h2>
                    <p><strong>Full Name:</strong> {user.Fullname}</p>
                    <p><strong>Email:</strong> {user.Email}</p>
                    <p><strong>Username:</strong> {user.Username}</p>
                    <p><strong>Location:</strong> {user.Location}</p>
                    {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-[#2E5A6B] mb-4">{user.Username}'s Itineraries</h2>
                    {itineraries.length > 0 ? (
                        itineraries.map((itinerary) => (
                            <div key={itinerary.ID} className="mb-4 p-4 bg-[#E5E1DA] rounded-lg shadow cursor-pointer" onClick={() => navigate(`/post/${itinerary.ID}`)}>
                                <h3 className="text-xl font-bold text-[#2E5A6B]">{itinerary.Title}</h3>
                                <p className="text-gray-700 mb-2">{itinerary.Description}</p>
                                <div className="flex justify-between text-sm text-[#4A7C88]">
                                    <span>{itinerary.NumDays} days • {itinerary.NumNights} nights</span>
                                    <span>Budget: {itinerary.Budget}</span>
                                    <span>Group Size: {itinerary.Size}</span>
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

export default UserProfile;