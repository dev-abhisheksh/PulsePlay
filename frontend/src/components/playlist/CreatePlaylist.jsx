import React, { useState, useEffect } from "react";
import axios from "axios";

const CreatePlaylist = ({ refreshPlaylists }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [user, setUser] = useState(null);
  const pp = "https://pulseplay-8e09.onrender.com"
    const localhost = "http://localhost:4000"

  const toggleModal = () => setModalOpen(!modalOpen);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${pp}/api/verify`, { withCredentials: true });
        setUser(res.data.user);
      } catch {
        console.error("User not authenticated");
      }
    };
    fetchUser();
  }, []);

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) return alert("Please enter a playlist name");

    try {
      const res = await axios.post(
        `${pp}/api/playlist/create`,
        { name: playlistName },
        { withCredentials: true }
      );
      console.log("Playlist created:", res.data.playlist);
      setPlaylistName("");
      setModalOpen(false);
      if (refreshPlaylists) refreshPlaylists();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to create playlist");
    }
  };

  if (!user) return <p className="text-white mt-4">Loading user...</p>;

  return (
    <div className="bg-[#1A1824] w-full flex justify-center py-4 gap-4">
      {/* Create & Delete Buttons */}
      <div
        onClick={toggleModal}
        className="text-white font-bold border-2 px-6 py-3 rounded-lg bg-violet-500 cursor-pointer hover:bg-violet-600 transition text-center"
      >
        Create Playlist
      </div>

      <div
        onClick={() => alert("Delete playlist clicked")}
        className="text-white font-bold border-2 px-6 py-3 rounded-lg bg-red-500 cursor-pointer hover:bg-red-600 transition text-center"
      >
        Delete Playlist
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1E1B2E] text-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Playlist</h2>
              <button onClick={toggleModal} className="text-gray-400 hover:text-gray-200">
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Playlist Name</label>
              <input
                type="text"
                placeholder="Enter playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#2A2738] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={toggleModal}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 font-semibold transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePlaylist;
