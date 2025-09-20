import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdPlaylistAddCheckCircle, MdPlaylistAddCircle } from "react-icons/md";

const Grid = ({ songs, currentIndex, setCurrentIndex, selectedGenre }) => {
  const [playlistState, setPlaylistState] = useState({});
  const [playlistId, setPlaylistId] = useState(null);

  const pp = "https://pulseplay-8e09.onrender.com"  /*"http://localhost:4000"*/;

  // Sort songs based on selected genre
  const sortedSongs = [...songs].sort((a, b) => {
    if (!selectedGenre) return 0; // no sorting, keep original order
    if (a.genre === selectedGenre && b.genre !== selectedGenre) return -1;
    if (a.genre !== selectedGenre && b.genre === selectedGenre) return 1;
    return 0;
  });

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(`${pp}/api/playlist`, {
          withCredentials: true,
        });
        if (res.data.playlists && res.data.playlists.length > 0) {
          const pl = res.data.playlists[0]; // only one playlist
          setPlaylistId(pl._id);
          const state = {};
          pl.songs.forEach((song) => {
            state[song._id] = true;
          });
          setPlaylistState(state);
        }
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
      }
    };
    fetchPlaylist();
  }, []);

  const handlePlayClick = (index, songId) => {
    // Find the original index of this song in the unsorted array
    const originalIndex = songs.findIndex(song => song._id === songId);
    setCurrentIndex(originalIndex);
  };

  const handleAddSong = async (songId) => {
    try {
      const res = await axios.post(
        `${pp}/api/playlist/${playlistId}/add-song`,
        { songId },
        { withCredentials: true }
      );
      setPlaylistState((prev) => ({ ...prev, [songId]: true }));
      console.log("Song added:", res.data.playlist);
    } catch (err) {
      console.error("Failed to add song:", err.response?.data || err.message);
    }
  };

  const handleRemoveSong = async (songId) => {
    try {
      const res = await axios.patch(
        `${pp}/api/playlist/${playlistId}/remove-song`,
        { songId },
        { withCredentials: true }
      );
      setPlaylistState((prev) => ({ ...prev, [songId]: false }));
      console.log("Song removed:", res.data.playlist);
    } catch (err) {
      console.error("Failed to remove song:", err.response?.data || err.message);
    }
  };

  if (!songs || songs.length === 0) {
    return <p className="text-white mt-4">Loading songs...</p>;
  }

  return (
    <div
      className="flex flex-col items-center bg-[#1A1824] p-4 gap-4 overflow-y-auto"
      style={{ maxHeight: "calc(9vh * 5.5 + 16px * 6.7)" }}
    >
      {sortedSongs.map((song, index) => {
        // Check if this song is currently playing by comparing with original array
        const originalIndex = songs.findIndex(s => s._id === song._id);
        const isCurrentSong = originalIndex === currentIndex;

        return (
          <div
            key={song._id || index}
            onClick={() => handlePlayClick(index, song._id)}
            className={`w-[95%] flex items-center justify-between px-2 h-[9vh] cursor-pointer
            ${isCurrentSong ? "bg-[#2a2738] rounded-md" : ""}`}
          >
            {/* Left: Cover + Text */}
            <div className="flex gap-5 items-center overflow-hidden">
              <div className="h-[55px] w-[55px] rounded-full border-3 border-white overflow-hidden flex-shrink-0">
                {song.coverImage ? (
                  <img
                    src={song.coverImage}
                    alt={song.title}
                    className="h-full w-full object-cover hover:scale-110 transition-transform duration-200 rounded-full"
                  />
                ) : (
                  <span className="text-white text-xs">No Image</span>
                )}
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <h1 className="font-semibold text-[15px] text-white truncate max-w-[200px]">
                  {song.title || "Unknown"}
                </h1>
                <p className="text-white text-[12px] truncate max-w-[200px]">
                  {song.artist || "Unknown"}-<span className="text-green-400 uppercase text-[10px]">{song.genre}</span>
                </p>
              </div>
            </div>

            {/* Right: Playlist toggle */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (playlistState[song._id]) {
                  handleRemoveSong(song._id);
                } else {
                  handleAddSong(song._id);
                }
              }}
              className="flex-shrink-0"
            >
              {playlistState[song._id] ? (
                <MdPlaylistAddCheckCircle size={28} className="text-green-400" />
              ) : (
                <MdPlaylistAddCircle size={28} className="text-white" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Grid;