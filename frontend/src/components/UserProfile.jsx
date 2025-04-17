import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import parallaximage from "../images/Parallax_Image.jpg";

const UserProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [showFollowersList, setShowFollowersList] = useState(false);
    const [showFollowingsList, setShowFollowingsList] = useState(false);
    const [followersWithPics, setFollowersWithPics] = useState([]);
    const [followingsWithPics, setFollowingsWithPics] = useState([]);


    const fetchProfilePic = async (username) => {
        try {
            const res = await fetch(`http://localhost:8080/users/${username}/profile-pic`);
            if (res.ok) {
                const data = await res.json();
                return data.profile_pic_url;
            }
        } catch (err) {
            console.error("Error fetching profile picture:", err);
        }
        return null;
    };

    const checkFollowStatus = async (follower, target) => {
        try {
            const res = await fetch("http://localhost:8080/users/follow/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    follower_id: follower,
                    target_id: target,
                    type: "user"
                })
            });
            if (res.ok) {
                const data = await res.json();
                setIsFollowing(data.isFollowing);
            }
        } catch (err) {
            console.error("Error checking follow status:", err);
        }
    };

    const handleFollowToggle = async () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const url = isFollowing
            ? "http://localhost:8080/users/unfollow"
            : "http://localhost:8080/users/follow";

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    follower_id: currentUser.Username,
                    target_id: user.Username,
                    type: "user"
                })
            });
            if (res.ok) {
                setIsFollowing(!isFollowing);

                // Refresh followers count
                const followersResponse = await fetch(`http://localhost:8080/users/followers/user/${user.Username}`);
                if (followersResponse.ok) {
                    const followersData = await followersResponse.json();
                    setFollowers(followersData);
                }
            }
        } catch (error) {
            console.error("Failed to toggle follow:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const allUsersRes = await fetch(`http://localhost:8080/users`);
            const users = await allUsersRes.json();
            const userData = users.find((u) => u.Username === username);
            if (!userData) return;
            setUser(userData);
      
            const pic = await fetchProfilePic(username);
            setProfileImage(pic);
      
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (currentUser?.Username === userData.Username) {
              setIsOwnProfile(true);
            } else {
              setIsOwnProfile(false);
              await checkFollowStatus(currentUser.Username, userData.Username);
            }
      
            const itinerariesRes = await fetch(`http://localhost:8080/itineraries/user/${userData.ID}`);
            if (itinerariesRes.ok) {
              const itinerariesData = await itinerariesRes.json();
              setItineraries(itinerariesData);
            }
      
            // Fetch followers
            const followersResponse = await fetch(`http://localhost:8080/users/followers/user/${userData.Username}`);
            if (followersResponse.ok) {
              const followersData = await followersResponse.json();
              setFollowers(followersData);
      
              const enrichedFollowers = await Promise.all(
                followersData.map(async (f) => ({
                  ...f,
                  profilePic: await fetchProfilePic(f.Username)
                }))
              );
              setFollowersWithPics(enrichedFollowers);
            }
      
            // Fetch followings
            const followingsResponse = await fetch(`http://localhost:8080/users/followings/${userData.Username}`);
            if (followingsResponse.ok) {
              const followingsData = await followingsResponse.json();
              setFollowings(followingsData);
      
              const enrichedFollowings = await Promise.all(
                followingsData.map(async (f) => ({
                  ...f,
                  profilePic: await fetchProfilePic(f.name)
                }))
              );
              setFollowingsWithPics(enrichedFollowings);
            }
      
          } catch (error) {
            console.error("Failed to fetch user profile:", error);
          } finally {
            setLoading(false);
          }
        };
      
        fetchData();
      }, [username]);

    const handleFeeds = () => navigate("/feeds");
    const handleMyProfile = () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser?.Username) {
            navigate(`/myprofile/${currentUser.Username}`);
        } else {
            console.error("No current user found");
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/");
    };

    if (loading) return <div className="text-center py-8">Loading user profile...</div>;
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

            {/* Profile Content */}
            <div className="max-w-4xl mx-auto bg-[#ffffffee] p-8 rounded-2xl shadow-lg mt-20">
                <h1 className="text-3xl font-bold text-[#2E5A6B] mb-6">{user.Username}'s Profile</h1>

                <div className="flex items-center space-x-8 mb-8">
                    {/* Profile Photo */}
                    <div className="w-32 h-32 bg-[#E5E1DA] rounded-full flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[#2E5A6B]">No Photo</span>
                        )}
                    </div>

                    {/* Follow/ Unfollow button */}
                    {!isOwnProfile && (
                        <button
                            onClick={handleFollowToggle}
                            className={`px-6 py-2 rounded-lg font-semibold transition ${isFollowing ? "bg-red-500 text-white" : "bg-[#4A7C88] text-white hover:bg-[#4a7c8876]"
                                }`}
                        >
                            {isFollowing ? "Unfollow -" : "Follow +"}
                        </button>
                    )}

                    {/* Followers & Following */}
                    <div className="relative flex items-start space-x-14 text-[#2E5A6B] font-medium">
                        {/* Followers */}
                        <div className="flex flex-col space-y-1 text-[#2E5A6B] font-medium cursor-pointer relative"
                            onClick={() => {
                            setShowFollowersList(!showFollowersList);
                            setShowFollowingsList(false);
                            }}
                        >
                            <p className="text-lg font-bold text-center">Followers</p>
                            <p className="text-center">{followers?.length || 0}</p>

                            {showFollowersList && (
  <div className="absolute top-16 left-0 bg-[#e5e1da88] rounded-lg shadow-lg p-4 z-40 w-64">
    <h3 className="font-bold text-[#2E5A6B] mb-2">Followers</h3>
    {followersWithPics.length === 0 ? (
      <p className="text-gray-600">No Followers</p>
    ) : (
      followersWithPics.map((f, idx) => (
        <div key={idx} className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            {f.profilePic ? (
              <img src={f.profilePic} alt={f.Username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>
          <span
            onClick={() => navigate(`/userprofile/${f.Username}`)}
            className="cursor-pointer"
          >
            {f.Username}
          </span>
        </div>
      ))
    )}
  </div>
)}
                        </div>
                        {/* Following */}
                        <div className="flex flex-col space-y-1 text-[#2E5A6B] font-medium cursor-pointer relative"
                            onClick={() => {
                            setShowFollowingsList(!showFollowingsList);
                            setShowFollowersList(false);
                            }}
                        >
                            <p className="text-lg font-bold text-center">Following</p>
                            <p className="text-center">{followings?.length || 0}</p>

                            {showFollowingsList && (
  <div className="absolute top-16 left-0 bg-[#e5e1da88] rounded-lg shadow-lg p-4 z-40 w-64">
    <h3 className="font-bold text-[#2E5A6B] mb-2">Following</h3>
    {followingsWithPics.length === 0 ? (
      <p className="text-gray-600">Not following anyone yet</p>
    ) : (
      followingsWithPics.map((f, idx) => (
        <div key={idx} className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            {f.profilePic ? (
              <img src={f.profilePic} alt={f.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>
          <span
            onClick={() => {
              if (f.type === "user") {
                navigate(`/userprofile/${f.name}`);
              } else if (f.type === "page") {
                navigate(`/state/${f.code}`);
              }
            }}
            className="cursor-pointer"
          >
            {f.name}
          </span>
        </div>
      ))
    )}
  </div>
)}
                        </div>
                    </div>

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
                    <h2 className="text-2xl font-semibold text-[#2E5A6B] mb-4">{user.Username}'s Itineraries</h2>
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

export default UserProfile;
