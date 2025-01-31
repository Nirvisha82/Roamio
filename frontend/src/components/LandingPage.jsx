import React from "react";

const LandingPage = () => {
  return (
    <div className="bg-darkBlue min-h-screen text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-5 bg-deepBlue shadow-md">
        <h1 className="text-2xl font-bold text-lightBlue">Roamio</h1>
        <div>
          <button className="px-4 py-2 bg-lightBlue text-darkBlue rounded-md mr-3 hover:bg-orange transition">
            Login
          </button>
          <button className="px-4 py-2 bg-orange text-white rounded-md hover:bg-lightBlue transition">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center text-center h-[80vh] px-6">
        <h2 className="text-4xl md:text-6xl font-bold">Explore the World with Roamio</h2>
        <p className="text-lg mt-4 max-w-2xl text-lightBlue">
          Your one-stop solution for travel needs – discover budget itineraries, local tips, and tourist spot reviews!
        </p>
        <button className="mt-6 px-6 py-3 bg-orange text-white font-semibold rounded-lg shadow-md hover:bg-lightBlue transition">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
