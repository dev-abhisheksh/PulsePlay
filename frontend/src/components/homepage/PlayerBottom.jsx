import React, { useEffect, useRef, useState } from 'react';
import { FaArrowAltCircleLeft, FaPlay, FaArrowAltCircleRight, FaPause } from "react-icons/fa";
import { MdPlaylistAddCheckCircle, MdPlaylistAddCircle, MdLoop, MdOutlineShuffle } from "react-icons/md";

const PlayerBottom = ({ songs = [], currentIndex = 0, setCurrentIndex, playToggle, setPlayToggle }) => {
    // const [playToggle, setPlayToggle] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [addToPlaylist, setAddToPlaylist] = useState(true);
    const [playerExpanded, setPlayerExpanded] = useState(false);
    const audioRef = useRef(null);

    const currentSong = songs[currentIndex] || {};

    const handlePlayToggle = () => setPlayToggle(!playToggle);

    const handleNext = () => {
        if (songs.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % songs.length);
            setPlayToggle(true);
        }
    };

    const handlePrev = () => {
        if (songs.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
            setPlayToggle(true);
        }
    };

    const handlePlaylistToggle = () => setAddToPlaylist(!addToPlaylist);

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minute = Math.floor(time / 60);
        const second = Math.floor(time % 60);
        return `${minute}:${second < 10 ? "0" : ""}${second}`;
    };

    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;

        const setMeta = () => setDuration(audio.duration || 0);
        const updateTime = () => setCurrentTime(audio.currentTime);

        audio.addEventListener("loadedmetadata", setMeta);
        audio.addEventListener("timeupdate", updateTime);

        return () => {
            audio.removeEventListener("loadedmetadata", setMeta);
            audio.removeEventListener("timeupdate", updateTime);
        };
    }, [currentSong]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (playToggle) {
            audioRef.current.play().catch((err) => console.error("Play failed:", err));
        } else {
            audioRef.current.pause();
        }
    }, [playToggle, currentSong]);

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className='bg-[#1A1824] relative'>
            {/* Expanded Player */}
            <div
                className={`
                    absolute bottom-0 left-0 right-0 bg-[#1A1824] z-10
                    transition-all duration-500 ease-in-out
                    ${playerExpanded ? 'translate-y-0 opacity-100 visible' : 'translate-y-full opacity-0 invisible'}
                `}
                style={{ height: playerExpanded ? '85vh' : '0vh' }}
            >
                <div className='flex justify-between flex-col pt-5 pb-10 h-full px-3'>
                    {/* Close Button */}
                    <div className='flex justify-center mb-2'>
                        <div
                            onClick={() => setPlayerExpanded(false)}
                            className='w-10 h-1 bg-gray-400 rounded-full cursor-pointer hover:bg-gray-300 transition-colors'
                        />
                    </div>

                    <div className='flex justify-between gap-4'>
                        <div className='border bg-white h-[30vh] w-[50vw] rounded-md overflow-hidden'>
                            {currentSong.coverImage ? (
                                <img
                                    className="h-full w-full object-cover p-1 rounded-md transition-transform duration-300 hover:scale-105"
                                    src={currentSong.coverImage}
                                    alt={currentSong.title}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-gray-500">Loading</span>
                                </div>
                            )}
                        </div>
                        <div className='flex items-center flex-col gap-7 justify-center'>
                            <MdLoop
                                size={30}
                                className='text-white hover:text-[#FD830D] cursor-pointer transition-colors duration-200'
                            />
                            <MdOutlineShuffle
                                size={30}
                                className='text-white hover:text-[#FD830D] cursor-pointer transition-colors duration-200'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-3'>
                        <div className='flex flex-col gap-2'>
                            <div onClick={handlePlaylistToggle} className='flex justify-between items-center'>
                                <h1 className='text-2xl font-bold text-white truncate pr-2'>
                                    {currentSong.title || "Loading"}
                                </h1>
                                <div className="transition-transform duration-200 hover:scale-110">
                                    {addToPlaylist ? (
                                        <MdPlaylistAddCircle size={28} className='text-white cursor-pointer' />
                                    ) : (
                                        <MdPlaylistAddCheckCircle size={28} className='text-[#FD830D] cursor-pointer' />
                                    )}
                                </div>
                            </div>
                            <h2 className='font-semi text-gray-300 text-sm'>
                                {currentSong.artist || "Loading"}
                            </h2>
                        </div>

                        <div>
                            <div className='h-2 bg-gray-600 w-full max-w-80 rounded-md overflow-hidden'>
                                <div
                                    className="h-2 bg-gray-600 w-80 rounded-md cursor-pointer relative"
                                    onClick={(e) => {
                                        if (!audioRef.current) return;
                                        const bar = e.currentTarget;
                                        const clickX = e.nativeEvent.offsetX;
                                        const barWidth = bar.clientWidth;
                                        const newTime = (clickX / barWidth) * duration;
                                        audioRef.current.currentTime = newTime;
                                        setCurrentTime(newTime);
                                    }}
                                >
                                    <div
                                        className="h-2 bg-[#FD830D] rounded-md transition-all duration-100 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                            <div className='flex justify-between px-3 py-1'>
                                <p className="text-white font-bold text-sm">{formatTime(currentTime)}</p>
                                <p className="text-white font-bold text-sm">{formatTime(duration)}</p>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-center gap-20'>
                        <div className='flex gap-15 items-center'>
                            <FaArrowAltCircleLeft
                                onClick={handlePrev}
                                size={40}
                                className='text-white cursor-pointer hover:text-[#FD830D] transition-all duration-200 hover:scale-110 active:scale-95'
                            />
                            <div
                                onClick={handlePlayToggle}
                                className='h-20 w-20 border rounded-full flex justify-center items-center bg-[#FD830D] cursor-pointer hover:bg-[#e6750b] transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg'
                            >
                                {playToggle ? (
                                    <FaPause size={40} className='text-white' />
                                ) : (
                                    <FaPlay size={40} className='text-white ml-1' />
                                )}
                            </div>
                            <FaArrowAltCircleRight
                                onClick={handleNext}
                                size={40}
                                className='text-white cursor-pointer hover:text-[#FD830D] transition-all duration-200 hover:scale-110 active:scale-95'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Compact Player */}
            <div className={`h-[15vh] w-full bg-black transition-all duration-500 ease-in-out`}>
                <div className="h-full flex items-center gap-4 px-3">
                    <div
                        onClick={() => setPlayerExpanded(!playerExpanded)}
                        className="h-[80%] w-[100px] rounded-md border border-white overflow-hidden cursor-pointer hover:border-[#FD830D] transition-all duration-300 hover:scale-105"
                    >
                        {currentSong.coverImage && (
                            <img
                                className="h-full w-full object-cover transition-transform duration-300"
                                src={currentSong.coverImage}
                                alt={currentSong.title || "Song cover"}
                            />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h1 className="text-white font-bold truncate">{currentSong.title || "Loading"}</h1>
                        <p className="text-gray-300 text-[11px] truncate">{currentSong.artist || "Loading"}</p>
                    </div>

                    <div className="flex gap-2 items-center">
                        <FaArrowAltCircleLeft
                            onClick={handlePrev}
                            size={30}
                            className="text-white cursor-pointer hover:text-[#FD830D] transition-all duration-200 hover:scale-110 active:scale-95"
                        />
                        <div
                            onClick={handlePlayToggle}
                            className="h-12 w-12 border rounded-full flex justify-center items-center bg-[#FD830D] cursor-pointer hover:bg-[#e6750b] transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                            {playToggle ? (
                                <FaPause size={20} className="text-white" />
                            ) : (
                                <FaPlay size={20} className="text-white ml-0.5" />
                            )}
                        </div>
                        <FaArrowAltCircleRight
                            onClick={handleNext}
                            size={30}
                            className="text-white cursor-pointer hover:text-[#FD830D] transition-all duration-200 hover:scale-110 active:scale-95"
                        />
                    </div>
                </div>
            </div>

            {/* Hidden Audio */}
            {currentSong.audioUrl && (
                <audio ref={audioRef} src={currentSong.audioUrl} preload="metadata" />
            )}
        </div>
    );
};

export default PlayerBottom;
