import React, { useEffect, useState } from "react";
import axios from "axios";
import Playbar from "./components/Playbar";
import Navbar from "./components/Navbar";
import MainBody from "./components/MainBody";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminRoute from "./components/AdminRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register";

const App = () => {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const render = "https://pulseplay-8e09.onrender.com"
  const localhost = "http://localhost:4000"

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get(`${render}/api/song/songs`);
        setSongs(res.data.songs);
        // console.log("Fetched songs:", res.data.songs);
      } catch (error) {
        console.error("Error fetching songs", error);
      }
    };
    fetchSongs();
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Home/Main Route */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <div className="flex">
                <div className="block sm:block">
                  <Playbar 
                    songs={songs} 
                    currentIndex={currentIndex} 
                    setCurrentIndex={setCurrentIndex} 
                  />
                </div>
              </div>
            </ProtectedRoute>
          } 
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="/register" element={<Register />}/>

        {/* You might want to add more routes like: */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <div className="flex">
                <div className="block sm:block">
                  <Playbar 
                    songs={songs} 
                    currentIndex={currentIndex} 
                    setCurrentIndex={setCurrentIndex} 
                  />
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
      </Routes>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;