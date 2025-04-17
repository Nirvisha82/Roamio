/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import profilePic1 from "../images/default.jpg";
import Slider from "react-slick";

const FullPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnPost, setIsOwnPost] = useState(false);
  const [post, setPost] = useState(null);


  // Navigation handlers
  const handleFeeds = () => navigate("/feeds");
  const handleMyProfile = () => user?.Username && navigate(`/myprofile/${user.Username}`);
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  // following related.
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // Fetch post and comments
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const sessionUser = localStorage.getItem("currentUser");
        if (!sessionUser) {
          navigate("/");
          return;
        }

        const parsedUser = JSON.parse(sessionUser);
        setUser(parsedUser);

        // Fetch the post
        const postResponse = await fetch(`http://localhost:8080/itineraries/post/${postId}`);
        if (!postResponse.ok) throw new Error(`HTTP error! status: ${postResponse.status}`);
        const postData = await postResponse.json();
        setPost(postData);

        // Post creator's profile pic
        const profilePicResponse = await fetch(`http://localhost:8080/users/${postData.username}/profile-pic`);
        const profilePicData = await profilePicResponse.json();
        setProfilePicUrl(profilePicData.profile_pic_url);

        // Comments
        const commentsResponse = await fetch(`http://localhost:8080/comments/${postId}`);
        if (!commentsResponse.ok) throw new Error(`HTTP error! status: ${commentsResponse.status}`);
        const commentsData = await commentsResponse.json();

        // All users
        const usersResponse = await fetch("http://localhost:8080/users");
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const users = await usersResponse.json();

        // Build map
        const userMap = {};
        users.forEach((user) => {
          userMap[user.ID] = user;
        });

        // Enrich comments with user
        const commentsWithUser = commentsData.comments.map((comment) => ({
          ...comment,
          user: userMap[comment.UserId || comment.userId],
        }));

        // Fetch profile pic for each comment user
        const commentsWithPics = await Promise.all(
          commentsWithUser.map(async (comment) => {
            let profilePicUrl = null;
            if (comment.user?.Username) {
              try {
                const picRes = await fetch(`http://localhost:8080/users/${comment.user.Username}/profile-pic`);
                if (picRes.ok) {
                  const picData = await picRes.json();
                  profilePicUrl = picData.profile_pic_url;
                }
              } catch (e) {
                console.error(`Failed to fetch profile pic for ${comment.user.Username}`, e);
              }
            }
            return {
              ...comment,
              user: {
                ...comment.user,
                profile_pic_url: profilePicUrl,
              },
            };
          })
        );

        setComments(commentsWithPics);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    fetchPostAndComments();
  }, [postId, navigate]);

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      const commentData = {
        userId: currentUser.ID,
        postId: parseInt(postId),
        description: newComment
      };

      const response = await fetch("http://localhost:8080/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Re-fetch all comments to get full data including usernames and profile pics
      const updatedCommentsResponse = await fetch(`http://localhost:8080/comments/${postId}`);
      if (!updatedCommentsResponse.ok) {
        throw new Error(`Failed to fetch updated comments`);
      }
      const updatedCommentsData = await updatedCommentsResponse.json();

      // Fetch all users
      const usersResponse = await fetch("http://localhost:8080/users");
      const users = await usersResponse.json();
      const userMap = {};
      users.forEach((user) => {
        userMap[user.ID] = user;
      });

      // Enrich each comment with user info and profile pic
      const enrichedComments = await Promise.all(
        updatedCommentsData.comments.map(async (comment) => {
          const commentUser = userMap[comment.UserId || comment.userId];
          let profilePicUrl = null;
          if (commentUser?.Username) {
            try {
              const picRes = await fetch(`http://localhost:8080/users/${commentUser.Username}/profile-pic`);
              if (picRes.ok) {
                const picData = await picRes.json();
                profilePicUrl = picData.profile_pic_url;
              }
            } catch (e) {
              console.error(`Failed to fetch profile pic for ${commentUser.Username}`, e);
            }
          }

          return {
            ...comment,
            user: {
              ...commentUser,
              profile_pic_url: profilePicUrl
            }
          };
        })
      );

      setComments(enrichedComments);
      setNewComment(""); // Clear input field

    } catch (error) {
      console.error("Error posting comment:", error);
      setError(error.message);
    }
  };

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

  // Follow/Unfollow handlers
  const checkFollowStatus = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const response = await fetch("http://localhost:8080/users/follow/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          follower_id: currentUser.Username,
          target_id: post?.username,
          type: "user"
        })
      });
      if (response.ok) setIsFollowing((await response.json()).isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollow = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const response = await fetch("http://localhost:8080/users/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          follower_id: currentUser.Username,
          target_id: post.username,
          type: "user"
        })
      });
      if (response.ok) setIsFollowing(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const response = await fetch("http://localhost:8080/users/unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          follower_id: currentUser.Username,
          target_id: post.username,
          type: "user"
        })
      });
      if (response.ok) setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  useEffect(() => {
    if (post) checkFollowStatus();
  }, [post]);

  if (!post) {
    return (
      <div className="text-center py-8">Loading post...</div>)
  }
  const imagesArray = post?.Images ? post.Images.split(";") : [];

  return (
    <div className="relative flex flex-col min-h-screen">
      <nav className="flex justify-between items-center p-5 bg-[#38496a] shadow-md h-16 fixed top-0 w-full z-50">
        <img src={logo} alt="Roamio Logo" className="h-12 w-auto" />
        <div className="flex space-x-6">
          <button className="text-white hover:text-[#89A8B2] transition" onClick={handleFeeds}>
            Feed
          </button>
          <button className="text-white hover:text-[#89A8B2] transition" onClick={handleMyProfile}>
            My Profile
          </button>
          <button className="text-white hover:text-[#89A8B2] transition" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-grow mt-16">
        <div className="w-1/4 p-10 bg-[#38496a] opacity-95 text-white flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <img src={profilePicUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
          <p className="text-lg font-semibold mt-2">{post.username}</p>
          {!isOwnPost && (
            <div className="mt-4">
              {isFollowing ? (

                <button onClick={handleUnfollow}
                  className="mt-3 px-6 py-2 rounded-lg font-semibold transition bg-red-500 text-white">
                  Unfollow -
                </button>
              ) : (
                <button onClick={handleFollow}
                  className="mt-3 px-6 py-2 rounded-lg font-semibold transition bg-[#4A7C88] text-white hover:bg-[#4a7c8876]">
                  Follow +
                </button>
              )}
            </div>
          )}
        </div>

        <div className="w-3/4 p-6 bg-[#F1F0E8]">
          <h1 className="text-2xl text-[#4A7C88] font-bold mb-4">{post.Title}</h1>
          <div className="flex">
            {imagesArray.length > 0 && imagesArray[0] !== "" && (
              <div className="w-1/2 flex justify-center">
                <div className="w-4/5 mt-12">
                  <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
                    {imagesArray.map((image, index) => (
                      <div key={index}>
                        <img src={image} alt={`Post Image ${index}`} className="w-full h-auto rounded-lg mb-2" />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            )}

            <div className={`${imagesArray.length > 0 && imagesArray[0] !== "" ? "w-1/2" : "w-full"}`}>
              <p className="text-base text-gray-600 mb-4">{post.Description}</p>
              <p className="text-sm text-gray-600 mb-4">Number of Days: {post.NumDays}</p>
              <p className="text-sm text-gray-600 mb-4">Number of Nights: {post.NumNights}</p>
              <p className="text-sm text-gray-600 mb-4">Budget: {post.Budget}</p>
              <p className="text-sm text-gray-600 mb-4">Group Size: {post.Size}</p>
              <p className="text-sm text-gray-600 mb-4">Highlights: {post.Highlights}</p>
              <p className="text-sm text-gray-600 mb-4">Suggestions: {post.Suggestions}</p>
            </div>

          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-[#4A7C88]">Comments</h2>
            <div className="mt-4">
              {comments.map((comment) => (
                <div key={comment.ID} className="p-3 bg-white rounded-lg shadow-md mb-2 flex items-center space-x-4">
                  <img
                    src={comment.user?.profile_pic_url || profilePic1} // fallback image
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#4A7C88]">
                      {comment.user?.Username || "Unknown User"}
                    </p>
                    <p className="text-gray-800">{comment.Description}</p>
                  </div>
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