import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

const Grid = ({ songs, currentIndex, setCurrentIndex }) => {

    const handlePlayClick = (index) => {
        setCurrentIndex(index); // Updates PlayerBottom
    };

    if (!songs || songs.length === 0) return <p className="text-white mt-4">Loading songs...</p>;

    return (
        <div 
            className="flex flex-col items-center bg-[#1A1824] p-4 gap-4 overflow-y-auto"
            style={{ maxHeight: 'calc(9vh * 5.5 + 16px * 6.7)' }} // Scroll after ~5 songs
        >
            {songs.map((song, index) => (
                <div
                    key={index}
                    onClick={() => handlePlayClick(index)}
                    className={`w-[95%] flex gap-4 h-[9vh] items-center justify-between px-2 cursor-pointer
                        ${index === currentIndex ? 'bg-[#2a2738] rounded-md' : ''}`} // Highlight current
                >
                    <div className="flex gap-5">
                        {/* Cover Image */}
                        <div className="h-[55px] w-[55px] bg-red-500 rounded-full border-3 border-white overflow-hidden">
                            {song.coverImage ? (
                                <img
                                    src={song.coverImage}
                                    alt={song.title}
                                    className="h-full w-full object-cover hover:scale-110 transition-transform duration-200 rounded-full"
                                />
                            ) : "No Image"}
                        </div>

                        {/* Song Info */}
                        <div className="flex flex-col justify-center h-[95%]">
                            <h1 className="font-semibold text-[15px] text-white truncate">{song.title || "Unknown"}</h1>
                            <p className="text-white text-[12px] truncate">{song.artist || "Unknown"}</p>
                        </div>
                    </div>

                    {/* Optional Play/Pause Icon */}
                    <div className="flex items-center">
                        {index === currentIndex ? (
                            <FaPause className="text-white" />
                        ) : (
                            <FaPlay className="text-white ml-1" />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Grid;
