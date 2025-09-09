import React, { useEffect, useRef, useState } from 'react'
import {
    FaArrowAltCircleLeft,
    FaPlay,
    FaArrowAltCircleRight,
    FaPause,
} from "react-icons/fa";

const PlayerBottom = ({ songs, currentIndex, setCurrentIndex }) => {
    const [playToggle, setPlayToggle] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const audioRef = useRef(null)

    const currentSong = songs[currentIndex]

    const handlePlayToggle = () => {
        setPlayToggle(!playToggle)
    }

    const handleNext = () => {
        if (songs.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % songs.length)
            setPlayToggle(true) // auto play next
        }
    }

    const handlePrev = () => {
        if (songs.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length)
            setPlayToggle(true) // auto play prev
        }
    }

    useEffect(() => {
        if (!audioRef.current) return
        const audio = audioRef.current

        const setMeta = () => setDuration(audio.duration || 0)
        const updateTime = () => setCurrentTime(audio.currentTime)

        audio.addEventListener("loadedmetadata", setMeta)
        audio.addEventListener("timeupdate", updateTime)

        return () => {
            audio.removeEventListener("loadedmetadata", setMeta)
            audio.removeEventListener("timeupdate", updateTime)
        }
    }, [currentSong])

    useEffect(() => {
        if (!audioRef.current) return
        if (playToggle) {
            audioRef.current.play().catch((err) =>
                console.error("Play failed:", err)
            )
        } else {
            audioRef.current.pause()
        }
    }, [playToggle, currentSong])

    const progress = duration ? (currentTime / duration) * 100 : 0

    return (
        <div className="h-[15vh] w-full bg-black">
            <div className="h-full flex items-center gap-4 px-3">

                {/* Cover */}
                <div className="h-[80%] w-[100px] rounded-md border border-white overflow-hidden">
                    {currentSong && (
                        <img
                            className="h-full w-full object-cover"
                            src={currentSong.coverImage}
                            alt={currentSong.title || "Song cover"}
                        />
                    )}
                </div>

                {/* Song Info */}
                <div>
                    {currentSong && (
                        <>
                            <h1 className="text-white font-bold">{currentSong.title}</h1>
                            <p className="text-white text-[11px]">{currentSong.artist}</p>
                        </>
                    )}
                </div>

                {/* Controls */}
                <div>
                    <div>
                        <div className="flex gap-2 items-center">
                            <FaArrowAltCircleLeft
                                onClick={handlePrev}
                                size={30}
                                className="text-white cursor-pointer"
                            />
                            <div
                                onClick={handlePlayToggle}
                                className="h-12 w-12 border rounded-full flex justify-center items-center bg-[#FD830D]"
                            >
                                {playToggle ? (
                                    <FaPause size={20} className="text-white cursor-pointer" />
                                ) : (
                                    <FaPlay size={20} className="text-white cursor-pointer" />
                                )}
                            </div>
                            <FaArrowAltCircleRight
                                onClick={handleNext}
                                size={30}
                                className="text-white cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {/* <div
                    className="h-2 bg-white w-80 rounded-md cursor-pointer"
                    onClick={(e) => {
                        if (!audioRef.current) return
                        const bar = e.currentTarget
                        const clickX = e.nativeEvent.offsetX
                        const barWidth = bar.clientWidth

                        const newTime = (clickX / barWidth) * duration
                        audioRef.current.currentTime = newTime
                        setCurrentTime(newTime)
                    }}
                >
                    <div
                        className="h-2 bg-[#FD830D] rounded-md"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div> */}
            </div>

            {/* Hidden Audio */}
            {currentSong && (
                <audio ref={audioRef} src={currentSong.audioUrl} preload="metadata" />
            )}
        </div>
    )
}

export default PlayerBottom
