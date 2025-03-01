import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import profilePic1 from "../images/team1.jpg";
import profilePic2 from "../images/team2.jpg";
import profilePic3 from "../images/team3.jpg";
import profilePic4 from "../images/team4.jpg";

const posts = [
  { id: 1, title: "Post 1", content: "This is the content of Post 1", profilePic: profilePic1, username: "SoniNirvisha" },
  { id: 2, title: "Post 2", content: "This is the content of Post 2", profilePic: profilePic2, username: "RiddhiMehta" },
  { id: 3, title: "Post 3", content: "This is the content of Post 3", profilePic: profilePic3, username: "Harsh" },
  { id: 4, title: "Post 4", content: "This is the content of Post 4", profilePic: profilePic4, username: "NeelM" },
];

const FullPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = posts.find((p) => p.id === parseInt(postId));

  const [comments, setComments] = useState([
    { id: 1, text: "Great post!", replies: [] },
    { id: 2, text: "Thanks for sharing!", replies: [] },
  ]);
  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, { id: comments.length + 1, text: newComment, replies: [] }]);
      setNewComment("");
    }
  };

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold text-red-600">Post not found!</h1>
        <button
          onClick={() => navigate("/feeds")}
          className="mt-4 px-6 py-2 bg-[#4A7C88] text-white font-semibold rounded-lg shadow-md hover:bg-[#38496a] transition"
        >
          Go Back to Feeds
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      <nav className="flex justify-between items-center p-5 bg-[#38496a] shadow-md h-16 fixed top-0 w-full z-50">
        <img src={logo} alt="Roamio Logo" className="h-12 w-auto" />
        <div className="flex space-x-6">
          <a href="#" className="text-white hover:text-[#89A8B2] transition">My Profile</a>
          <a href="#" className="text-white hover:text-[#89A8B2] transition">Logout</a>
        </div>
      </nav>

      <div className="flex flex-grow mt-16">
        <div className="w-1/4 p-10 bg-[#38496a] opacity-95 text-white">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <img src={post.profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
          <p className="text-lg font-semibold mt-2">{post.username}</p>
        </div>

        <div className="w-3/4 p-6 bg-[#F1F0E8]">
          <h1 className="text-2xl text-[#4A7C88] font-bold mb-4">{post.title}</h1>
          <p className="text-lg text-gray-600 mb-4">{post.content}</p>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-[#4A7C88]">Comments</h2>
            <div className="mt-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-white rounded-lg shadow-md mb-2">
                  <p className="text-gray-800">{comment.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <textarea
                className="w-full p-2 border rounded-lg"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button
                onClick={addComment}
                className="mt-2 px-6 py-2 bg-[#4A7C88] text-white font-semibold rounded-lg shadow-md hover:bg-[#38496a] transition"
              >
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
