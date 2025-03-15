/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom";
import logo from "../images/logo.png";
import profilePic1 from "../images/team1.jpg";
import profilePic2 from "../images/team2.jpg";
import profilePic3 from "../images/team3.jpg";
import profilePic4 from "../images/team4.jpg";
import defaultpic from "../images/default.jpg";

// const posts = [
//   { id: 1, title: "Post 1", content: "This is the content of Post 1", profilePic: profilePic1, username: "SoniNirvisha" },
//   { id: 2, title: "Post 2", content: "This is the content of Post 2", profilePic: profilePic2, username: "RiddhiMehta" },
//   { id: 3, title: "Post 3", content: "This is the content of Post 3", profilePic: profilePic3, username: "Harsh" },
//   { id: 4, title: "Post 4", content: "This is the content of Post 4", profilePic: profilePic4, username: "NeelM" },
// ];

const FullPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  // const post = posts.find((p) => p.id === parseInt(postId));
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  

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

  const [comments, setComments] = useState([
    { id: 1, text: "Great post!", replies: [] },
    { id: 2, text: "Thanks for sharing!", replies: [] },
  ]);
  const [newComment, setNewComment] = useState("");
  

  const addComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { 
        id: comments.length + 1, 
        text: newComment, 
        replies: [],
        username: JSON.parse(localStorage.getItem("currentUser")).Username
      }]);
      setNewComment("");
    }
  };
  // following related.
  const [isFollowing, setIsFollowing] = useState(false);
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  



  //Post related
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Check user session
        const sessionUser = localStorage.getItem("currentUser");
        if (!sessionUser) {
          navigate("/");
          return;
        }
        const parsedUser = JSON.parse(sessionUser);
        setUser(parsedUser);

        // Fetch post data
        const response = await fetch(
          `http://localhost:8080/itineraries/post/${postId}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.message);
      }
    };

    fetchPost();
  }, [postId, navigate]);

  const [isOwnPost, setIsOwnPost] = useState(false);
  // Add this useEffect after fetching the post
useEffect(() => {
  if (post && user) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const isOwner = currentUser.ID === post.UserID;
    setIsOwnPost(isOwner);
    
    if (!isOwner) {
      checkFollowStatus();
    }
  }
}, [post, user]);

const checkFollowStatus = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const response = await fetch("http://localhost:8080/users/follow/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        follower_id: currentUser.ID,
        target_id: post.UserID,
        type: "user"
      })
    });

    if (response.ok) {
      const data = await response.json();
      setIsFollowing(data.isFollowing);
    }
  } catch (error) {
    console.error("Error checking follow status:", error);
  }
};

const handleFollow = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const response = await fetch("http://localhost:8080/users/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        follower_id: currentUser.ID,
        target_id: post.UserID,
        type: "user"
      })
    });

    if (response.ok) {
      setIsFollowing(true);
    }
  } catch (error) {
    console.error("Error following user:", error);
  }
};

const handleUnfollow = async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const response = await fetch("http://localhost:8080/users/unfollow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        follower_id: currentUser.ID,
        target_id: post.UserID,
        type: "user"
      })
    });

    if (response.ok) {
      setIsFollowing(false);
    }
  } catch (error) {
    console.error("Error unfollowing user:", error);
  }
};

  if (!post) {
    return (
      <div className="text-center py-8">Loading post...</div>)
  }

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
        {/* Profile Section */}
        <div className="w-1/4 p-10 bg-[#38496a] opacity-95 text-white flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <img src={defaultpic} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
          <p className="text-lg font-semibold mt-2">{post.username}</p>
          {!isOwnPost && (
          <div className="mt-4">
            {isFollowing ? (
              <button
            onClick={handleUnfollow}
            className={"mt-3 px-6 py-2 rounded-lg font-semibold transition bg-red-500 text-white"}
          >
          Unfollow -
          </button>):(
      <button
        onClick={handleFollow}
        className="mt-3 px-6 py-2 rounded-lg font-semibold transition bg-[#4A7C88] text-white hover:bg-[#4a7c8876]"
      >
        Follow +
      </button>
    )}
    </div>
)}
        </div>

        {/* Post Content Section */}
        <div className="w-3/4 p-6 bg-[#F1F0E8]">
          <h1 className="text-2xl text-[#4A7C88] font-bold mb-4">{post.Title}</h1>
          <p className="text-base text-gray-600 mb-4">{post.Description}</p>
          <p className="text-sm text-gray-600 mb-4"> &nbsp; Number of Days: {post.NumDays} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Number of Nights: {post.NumNights}</p>
          <p className="text-sm text-gray-600 mb-4"> &nbsp; Budget: {post.Budget}</p>
          <p className="text-sm text-gray-600 mb-4"> &nbsp; Group Size: {post.Size}</p>
          <p className="text-sm text-gray-600 mb-4"> &nbsp; Highlights: {post.Highlights}</p>
          <p className="text-sm text-gray-600 mb-4"> &nbsp; Suggestions: {post.Suggestions}</p>

          {/* Comments Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-[#4A7C88]">Comments</h2>
            <div className="mt-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-white rounded-lg shadow-md mb-2">
                  <p className="text-gray-800">{comment.text}</p>
                </div>
              ))}
            </div>

            {/* Add Comment Section */}
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
