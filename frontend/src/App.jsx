import React, { useEffect, useState, useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/homepage/Navbar";
import PlayerBottom from "./components/homepage/PlayerBottom";
import ExplorePage from "./pages/ExplorePage";
import PlaylistPage from "./pages/PlaylistPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import { ToastContainer, toast } from "react-toastify";
import { AddToPlaylistFromExtendedPlayer } from "./context/AddToPlaylistFromExtendedPlayer";
import { ApiContext } from "./context/ApiContext";
import { fetchChangelog } from "./context/fetchChangelog";

const App = () => {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playToggle, setPlayToggle] = useState(false);
  const [playlistId, setPlaylistId] = useState(null);
  const [playlistState, setPlaylistState] = useState({});
  const [changelogs, setChangelogs] = useState([]);
  const [pp, setpp] = useState("https://pulseplay-backend-fc2j.onrender.com" /*"http://localhost:4000"*/)


  const location = useLocation();
  const hideNav =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/playlist");

  const hidePlayer =
    location.pathname === "/login" ||
    location.pathname === "/register"
    // location.pathname === "/admin";

  // const pp = "https://pulseplay-8e09.onrender.com"  /*"http://localhost:4000"*/




  // ✅ Fetch songs once
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

  // ✅ Enhanced playlist fetching with creation fallback
  useEffect(() => {
    const fetchOrCreatePlaylist = async () => {
      try {
        // console.log("Fetching user playlist...");
        const res = await axios.get(`${pp}/api/playlist`, {
          withCredentials: true,
        });

        // console.log("Playlist response:", res.data);

        if (res.data.playlists && res.data.playlists.length > 0) {
          const pl = res.data.playlists[0]; // use first playlist
          // console.log("Found existing playlist:", pl);
          setPlaylistId(pl._id);

          // Build state { songId: true }
          const state = {};
          if (pl.songs && pl.songs.length > 0) {
            pl.songs.forEach((song) => {
              state[song._id] = true;
            });
          }
          setPlaylistState(state);
          // console.log("Playlist state set:", state);
        } else {
          console.log("No playlist found, creating new one...");
          // Create a new playlist if none exists
          const createRes = await axios.post(
            `${pp}/api/playlist`,
            { name: "My Playlist", description: "Default playlist" },
            { withCredentials: true }
          );

          // console.log("Created new playlist:", createRes.data);
          setPlaylistId(createRes.data.playlist._id);
          setPlaylistState({}); // Empty state for new playlist
        }
      } catch (err) {
        console.error("Failed to fetch/create playlist:", err);
        // If it's an authentication error, don't show toast
        if (err.response?.status !== 401) {
          // toast.error("Failed to load playlist");
        }
      }
    };

    fetchOrCreatePlaylist();
  }, []);

  // ✅ Enhanced add song function
  const handleAddSong = async (songId) => {
    // console.log("Adding song:", songId, "to playlist:", playlistId);

    if (!playlistId) {
      toast.error("Please create a playlist first!", { autoClose: 800 });
      return;
    }

    try {
      const res = await axios.post(
        `${pp}/api/playlist/${playlistId}/add-song`,
        { songId },
        { withCredentials: true }
      );

      // console.log("Add song response:", res.data);

      // Update local state
      setPlaylistState((prev) => {
        const newState = { ...prev, [songId]: true };
        // console.log("Updated playlist state:", newState);
        return newState;
      });

      toast.success("Song added to playlist!", { autoClose: 800 });
    } catch (err) {
      console.error("Failed to add song:", err.response?.data || err.message);
      toast.error("Failed to add song to playlist", { autoClose: 800 });
    }
  };

  // ✅ Enhanced remove song function
  const handleRemoveSong = async (songId) => {
    // console.log("Removing song:", songId, "from playlist:", playlistId);

    if (!playlistId) {
      toast.error("No playlist found!", { autoClose: 800 });
      return;
    }

    try {
      const res = await axios.patch(
        `${pp}/api/playlist/${playlistId}/remove-song`,
        { songId },
        { withCredentials: true }
      );

      // console.log("Remove song response:", res.data);

      // Update local state
      setPlaylistState((prev) => {
        const newState = { ...prev, [songId]: false };
        // console.log("Updated playlist state after removal:", newState);
        return newState;
      });

      toast.info("Song removed from playlist", { autoClose: 800 });
    } catch (err) {
      console.error("Failed to remove song:", err.response?.data || err.message);
      toast.error("Failed to remove song from playlist", { autoClose: 800 });
    }
  };

  return (
    <ApiContext.Provider value={pp}>

      <fetchChangelog.Provider value={changelogs}>



        <div className="App flex flex-col h-screen bg-[#1A1824]">
          {/* Conditionally render Navbar */}
          {!hideNav && <Navbar />}

          <AddToPlaylistFromExtendedPlayer.Provider
            value={{ playlistId, playlistState, handleAddSong, handleRemoveSong }}
          >
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
                    <>
                      <PlaylistPage
                        songs={songs}
                        setSongs={setSongs}
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                      />
                      <ToastContainer position="top-center" />
                    </>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard songs={songs} setSongs={setSongs} />
                  </AdminRoute>
                }
              />
            </Routes>

            {/* Conditionally render PlayerBottom - MOVED INSIDE PROVIDER */}
            {!hidePlayer && (
              <PlayerBottom
                songs={songs}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                playToggle={playToggle}
                setPlayToggle={setPlayToggle}
              />
            )}
          </AddToPlaylistFromExtendedPlayer.Provider>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            pauseOnHover
            draggable
          />
        </div>
      </fetchChangelog.Provider>
    </ApiContext.Provider>
  );
};

export default App;