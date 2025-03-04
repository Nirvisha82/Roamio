import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    days: "",
    budget: "",
    highlights: "",
    staySuggestions: "",
    images: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Your travel itinerary has been created!");
    navigate("/"); // Redirect back to the feeds page
  };

  return (
    <div
      className="fixed top-0 right-0 w-1/2 h-full bg-[#F1F0E8] shadow-2xl p-6 overflow-y-auto animate-slideIn"
    >
      <h1 className="text-2xl font-bold mb-6 text-[#38496a]">
        Create Your Travel Itinerary
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Itinerary Title"
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-3 border rounded"
          rows="4"
          onChange={handleChange}
        ></textarea>
        <input
          type="number"
          name="days"
          placeholder="Number of Days"
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />
        <input
          type="text"
          name="budget"
          placeholder="Estimated Budget"
          className="w-full p-3 border rounded"
          onChange={handleChange}
        />
        <textarea
          name="highlights"
          placeholder="Trip Highlights (e.g., must-see spots, experiences)"
          className="w-full p-3 border rounded"
          rows="3"
          onChange={handleChange}
        ></textarea>
        <textarea
          name="staySuggestions"
          placeholder="Stay Suggestions (e.g., hotels, hostels, Airbnbs)"
          className="w-full p-3 border rounded"
          rows="3"
          onChange={handleChange}
        ></textarea>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="w-full p-3 border rounded bg-white"
          onChange={handleChange}
        />
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-6 py-2 bg-[#38496a] text-white rounded hover:bg-[#2E5A6B] transition"
          >
            Submit
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

/* Add this animation in your global CSS */
/* 
@keyframes slideIn {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}
*/

// Let me know if you want any changes! 🚀
