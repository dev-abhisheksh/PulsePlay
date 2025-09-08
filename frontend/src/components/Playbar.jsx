import React, { useEffect, useState, useRef } from 'react'
import { FaArrowAltCircleLeft, FaPlay, FaArrowAltCircleRight, FaPause, FaAlignJustify, FaAlignRight, FaHome, FaSearch, FaMusic, FaDownload } from "react-icons/fa";
import { MdPlaylistAddCheckCircle, MdPlaylistAddCircle, MdLoop, MdOutlineShuffle, MdAdminPanelSettings } from "react-icons/md";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Playbar = ({ songs, currentIndex, setCurrentIndex }) => {

  const [playToggle, setPlayToggle] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [menuBarToggle, setMenuBarToggle] = useState(true)
  const [addToPlaylist, setAddToPlaylist] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const pp = "https://pulseplay-8e09.onrender.com"
  const localhost = "http://localhost:4000"



  const handleLogout = async () => {
    await axios.get(`${pp}/api/logout`, { withCredentials: true })
    navigate("/login");
    toast.success("Logged out")
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${pp}/api/verify`, { withCredentials: true })
        setUser(res.data.user)
        console.log(res.data.user)
      } catch (error) {

      }
    }
    fetchUser()
  }, [])

  const audioRef = useRef(null)

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00"
    const minute = Math.floor(time / 60)
    const second = Math.floor(time % 60)
    return `${minute}:${second < 10 ? "0" : ""}${second}`
  }
  const handlePlaylistToggle = () => { setAddToPlaylist(() => !addToPlaylist) }
  const handlePlayToggle = () => { setPlayToggle(() => !playToggle) }

  const handleNext = () => {
    if (songs.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % songs.length)
    }
  }

  const handlePrev = () => {
    if (songs.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length)
    }
  }

  const currentSong = songs[currentIndex]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration)
      }
    }
  }, [currentSong])

  useEffect(() => {
    if (!audioRef.current) return
    if (playToggle) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [playToggle, currentSong])

  useEffect(() => {
    if (!audioRef.current) return
    const audio = audioRef.current

    const updateTime = () => setCurrentTime(audio.currentTime)

    audio.addEventListener("timeupdate", updateTime)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
    }
  }, [currentSong])

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
   <div className='w-screen h-screen bg-[#1A1824] flex justify-center overflow-hidden'>
  <div className='flex justify-between flex-col pt-5 pb-10 h-full px-3'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-white text-2xl font-bold'>PulsePlay</h1>
          </div>
          <div
            onClick={() => setMenuBarToggle(!menuBarToggle)}
            className="relative w-6 h-6 cursor-pointer"
          >
            <FaAlignJustify
              size={24}
              className={`absolute top-0 left-0 text-white transition-opacity duration-500 ${menuBarToggle ? "opacity-100" : "opacity-0"
                }`}
            />
            <FaAlignRight
              size={24}
              className={`absolute top-0 left-0 text-white transition-opacity duration-500 ${menuBarToggle ? "opacity-0" : "opacity-100"
                }`}
            />
          </div>

        </div>

        {/* Backdrop Overlay (only visible when navbar is open) */}
        {!menuBarToggle && (
          <div
            className="fixed inset-0 bg-opacity-40 z-30"
            onClick={() => setMenuBarToggle(true)}
          ></div>
        )}




        {/* Navbar Panel */}
        <div
          className={`fixed top-0 left-0 h-full w-[75%] border-r-2 flex flex-col gap-10 border-white bg-black bg-opacity-40 transform transition-transform duration-500 ease-in-out z-40
    ${menuBarToggle ? "-translate-x-full" : "translate-x-0"}`}
        >
          <h2 className="pl-7 pt-5  text-white text-2xl font-bold">PulsePlay</h2>
          <div className='flex flex-col justify-between h-screen pb-10 px-3'>
            <ul className="flex flex-col gap-7 p-4 text-white">
              <div className='flex items-center gap-6'>
                <FaHome size={25} className='text-white ' />
                <h1>Home</h1>
              </div>
              <div className='flex items-center gap-6'>
                <FaSearch size={20} className='text-white' />
                <h1>Search</h1>
              </div>
              <div className='flex items-center gap-6'>
                <FaMusic size={20} className='text-white' />
                <h1>PlayList</h1>
              </div>
              <div className='flex items-center gap-6'>
                <FaDownload size={20} className='text-white' />
                <h1>Download</h1>
              </div>
              <div className='flex items-center gap-6'>
                <MdAdminPanelSettings size={27} className='text-white' />
                <Link to="admin">
                  Admin
                </Link>

              </div>
            </ul>

            <div className='px-3 flex justify-between items-center'>
              <h1 className='text-white text-2xl'>{user ? (user.username) : "user"}</h1>
              <button onClick={handleLogout} className='text-white text-sm border border-[#FD830D] px-2 py-1 rounded-md'>LogOut</button>
            </div>
          </div>
        </div>


        <div className='flex justify-between gap-4'>
          <div className='border bg-white h-[38vh] w-[70vw] rounded-md'>
            {currentSong && currentSong.coverImage ?
              (<img
                className="h-full w-full object-cover p-1 rounded-md"
                src={currentSong.coverImage}
                alt={currentSong.title}
              />) : (<span>Loading</span>)}
          </div>
          <div className='flex items-center flex-col gap-7 justify-center'>
            <MdLoop size={30} className='text-white' />
            <MdOutlineShuffle size={30} className='text-white' />
          </div>
        </div>





        <div className='flex flex-col gap-8'>
          <div className='flex flex-col gap-2'>
            <div onClick={handlePlaylistToggle} className='flex justify-between items-center'>
              <h1 className='text-2xl font-bold text-white'>{currentSong ? currentSong.title : "Loading"}</h1>
              {addToPlaylist ? (<MdPlaylistAddCircle size={28} className='text-white' />) : (<MdPlaylistAddCheckCircle size={28} className='text-white' />)}
            </div>
            <h2 className='font-semi text-white text-sm'>{currentSong ? currentSong.artist : "Loading"}</h2>
          </div>
          <div>
            <div className='h-2 bg-white w-full max-w-80 rounded-md'>
              <div
                className="h-2 bg-white w-80 rounded-md cursor-pointer"
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
                  className="h-2 bg-[#FD830D] rounded-md"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className='flex justify-between px-3 py-1'>
              <p className="text-white font-bold">{formatTime(currentTime)}</p>
              <p className="text-white font-bold">{formatTime(duration)}</p>

            </div>
          </div>
        </div>





        <div className='flex justify-center gap-20'>
          <div className='flex gap-15 items-center'>
            <FaArrowAltCircleLeft onClick={handlePrev} size={40} className='text-white cursor-pointer' />
            <div onClick={handlePlayToggle}
              className='h-20 w-20 border rounded-full flex justify-center items-center bg-[#FD830D]'>
              {playToggle ? (<FaPause size={40} className='text-white cursor-pointer' />) : (<FaPlay size={40} className='text-white cursor-pointer' />)}
            </div>
            <FaArrowAltCircleRight onClick={handleNext} size={40} className='text-white cursor-pointer' />
          </div>
        </div>
        {currentSong && (
          <audio
            ref={audioRef}
            src={currentSong.audioUrl}
            preload="metadata"
          />
        )}
      </div>
    </div>
  )
}

export default Playbar