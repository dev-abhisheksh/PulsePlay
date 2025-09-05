import React, { useEffect, useState } from "react";
import axios from "axios";
import Playbar from "./components/Playbar";
import Navbar from "./components/Navbar";
import MainBody from "./components/MainBody";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

const router = createBrowserRouter([
  { path: "admin", element: <AdminDashboard /> },
  { path: "/home", element: <Playbar /> }
])

const App = () => {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/song/songs");
        setSongs(res.data.songs);
        // console.log("Fetched songs:", res.data.songs);
      } catch (error) {
        console.error("Error fetching songs", error);
      }
    };
    fetchSongs();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <div className="flex">
          <div className="block sm:block" >
            <ProtectedRoute>

              <Playbar songs={songs} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
            </ProtectedRoute>
          </div>
        </div>
      } />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
