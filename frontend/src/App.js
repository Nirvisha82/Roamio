import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import React from 'react';
import LandingPage from "./components/LandingPage";
import Feeds from "./components/Feeds";
import PostForm from "./components/PostForm";
import MyProfile from "./components/MyProfile";
// import CreatePost from "./components/CreatePost";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feeds" element={<Feeds />} />
        <Route path="/post" element={<PostForm />} />
        <Route path="/myprofile" element={<MyProfile />} />
        {/* <Route path="/create-post" element={<CreatePost />} /> */}
      </Routes>
    </Router>
  );
}

export default App;