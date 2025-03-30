import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import profilePic from "../images/team1.jpg";
import Slider from "react-slick";
import postPic1 from "../images/post1.jpg";
import postPic2 from "../images/post2.jpg";

const FullPost = () => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    { ID: 1, Description: "Great post! Very informative." },
    { ID: 2, Description: "I love this itinerary, thanks for sharing!" },
  ]);

  const post = {
    username: "JohnDoe",
    Title: "Amazing Trip to Paris",
    Description: "Visited all the major attractions in Paris and had an unforgettable experience!",
    NumDays: 5,
    NumNights: 4,
    Budget: "$1500",
    Size: "4 people",
    Highlights: "Eiffel Tower, Louvre Museum, Seine River Cruise",
    Suggestions: "Book tickets in advance to avoid long queues.",
    Images: [postPic1, postPic2],
  };

  const handleFeeds = () => navigate("/feeds");
  const handleMyProfile = () => navigate(`/myprofile/`);
  const handleLogout = () => navigate("/");
  const toggleFollow = () => setIsFollowing(!isFollowing);
  
  const addComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, { ID: Date.now(), Description: newComment }]);
    setNewComment("");
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
        <div className="w-1/4 p-10 bg-[#38496a] text-white flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
          <p className="text-lg font-semibold mt-2">{post.username}</p>
          <button onClick={toggleFollow} className={`mt-3 px-6 py-2 rounded-lg font-semibold transition ${isFollowing ? "bg-red-500" : "bg-[#4A7C88] text-white"}`}>
            {isFollowing ? "Unfollow -" : "Follow +"}
          </button>
        </div>

        <div className="w-3/4 p-6 bg-[#F1F0E8]">
          <h1 className="text-2xl text-[#4A7C88] font-bold mb-4">{post.Title}</h1>
          <div className="flex">
            {post.Images.length > 0 && (
              <div className="w-1/2 flex justify-center">
                <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1} className="w-4/5">
                  {post.Images.map((image, index) => (
                    <div key={index}>
                      <img src={image} alt={`Post Image ${index}`} className="w-full h-auto rounded-lg mb-2" />
                    </div>
                  ))}
                </Slider>
              </div>
            )}

            <div className={`${post.Images.length > 0 ? "w-1/2" : "w-full"}`}>
              <p className="text-base text-gray-600 mb-4">{post.Description}</p>
              <p className="text-sm text-gray-600">Days: {post.NumDays}, Nights: {post.NumNights}</p>
              <p className="text-sm text-gray-600">Budget: {post.Budget}, Group Size: {post.Size}</p>
              <p className="text-sm text-gray-600">Highlights: {post.Highlights}</p>
              <p className="text-sm text-gray-600">Suggestions: {post.Suggestions}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-[#4A7C88]">Comments</h2>
            <div className="mt-4">
              {comments.map((comment) => (
                <div key={comment.ID} className="p-3 bg-white rounded-lg shadow-md mb-2">
                  <p className="text-gray-800">{comment.Description}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <textarea className="w-full p-2 border rounded-lg" placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)}></textarea>
              <button onClick={addComment} className="mt-2 px-6 py-2 bg-[#4A7C88] text-white font-semibold rounded-lg shadow-md hover:bg-[#38496a] transition">
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPost;
