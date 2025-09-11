import React, { useState } from 'react';
import { MdPlaylistAddCheckCircle, MdPlaylistAddCircle } from 'react-icons/md';

const Grid = ({ songs, currentIndex, setCurrentIndex }) => {
  const [playlistState, setPlaylistState] = useState({});

  const handlePlayClick = (index) => {
    setCurrentIndex(index);
  };

  const handlePlaylistToggle = (songId) => {
    setPlaylistState((prev) => ({
      ...prev,
      [songId]: !prev[songId],
    }));
  };

  if (!songs || songs.length === 0) {
    return <p className="text-white mt-4">Loading songs...</p>;
  }

  return (
    <div
      className="flex flex-col items-center bg-[#1A1824] p-4 gap-4 overflow-y-auto"
      style={{ maxHeight: 'calc(9vh * 5.5 + 16px * 6.7)' }} // scroll after 5
    >
      {songs.map((song, index) => (
        <div
          key={song._id || index}
          onClick={() => handlePlayClick(index)}
          className={`w-[95%] flex items-center justify-between px-2 h-[9vh] cursor-pointer
            ${index === currentIndex ? 'bg-[#2a2738] rounded-md' : ''}`}
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
                {song.artist || "Unknown"}
              </p>
            </div>
          </div>

          {/* Right: Playlist icon */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handlePlaylistToggle(song._id || index);
            }}
            className="flex-shrink-0"
          >
            {playlistState[song._id || index] ? (
              <MdPlaylistAddCheckCircle size={28} className="text-green-400" />
            ) : (
              <MdPlaylistAddCircle size={28} className="text-white" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Grid;
