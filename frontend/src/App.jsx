import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/homepage/Navbar";
import PlayerBottom from "./components/homepage/PlayerBottom";
import ExplorePage from "./pages/ExplorePage";
import PlaylistPage from "./pages/PlaylistPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute"
import AdminDashboard from "./pages/AdminDashboard"

const App = () => {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playToggle, setPlayToggle] = useState(false);

  const location = useLocation();
  const hideNav =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin");

  const hidePlayer =
    location.pathname === "/login" ||
    location.pathname === "/register";
  const pp = "https://pulseplay-8e09.onrender.com"
  const localhost = "http://localhost:4000";

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get(`${pp}/api/song/songs`);
        setSongs(res.data.songs);
      } catch (error) {
        console.error("Error fetching songs", error);
      }
    };
    fetchSongs();
  }, []);

  return (
    <div className="App flex flex-col h-screen">
      {/* Conditionally render Navbar */}
      {!hideNav && <Navbar />}

      {/* Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ExplorePage
                songs={songs}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playlist"
          element={
            <ProtectedRoute>
              <PlaylistPage
                songs={songs}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard songs={songs} />
            </AdminRoute>
          }
        />
      </Routes>

      {/* Conditionally render PlayerBottom */}
      {!hidePlayer && (
        <PlayerBottom
          songs={songs}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          playToggle={playToggle}
          setPlayToggle={setPlayToggle}
        />
      )}
    </div>
  );
};

export default App;
