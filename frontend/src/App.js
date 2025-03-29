import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import React from 'react';
import LandingPage from "./components/LandingPage";
import Feeds from "./components/Feeds";
import PostForm from "./components/PostForm";
import MyProfile from "./components/MyProfile";
import FullPost from "./components/FullPost";
import StatePage from "./components/StatePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feeds" element={<Feeds />} />
        <Route path="/post" element={<PostForm />} />
        <Route path="/post/:postId" element={<FullPost />} />
        <Route path="/myprofile/:username" element={<MyProfile />} />
        <Route path="/state/:stateCode" element={<StatePage />} />
      </Routes>
    </Router>
  );
}

export default App;