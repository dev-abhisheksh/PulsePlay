import React, { useEffect, useState, useRef } from 'react'
import { FaAlignJustify, FaAlignRight, FaHome, FaSearch, FaMusic, FaDownload } from "react-icons/fa";
import { BsFillMusicPlayerFill } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { IoAddCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

const AdminDashboard = () => {
  const [menuBarToggle, setMenuBarToggle] = useState(true)
  const [activePage, setActivePage] = useState()
  const [songs, setSongs] = useState([])
  const [addSongToggle, setAddSongToggle] = useState(false)
  const titleRef = useRef();
  const artistRef = useRef();
  const genreRef = useRef();
  const coverRef = useRef();
  const audioRef = useRef();
  const [uploading, setUploading] = useState(false)


  const handleAddSongToggle = () => {
    setAddSongToggle(true)
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true)

    const formData = new FormData();
    formData.append("title", titleRef.current.value);
    formData.append("artist", artistRef.current.value);
    formData.append("genre", genreRef.current.value);
    formData.append("coverImage", coverRef.current.files[0]);
    formData.append("audio", audioRef.current.files[0]);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/song/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Upload successful:", response.data);
      alert("Song uploaded successfully!");
      setAddSongToggle(false);

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload song.");
    } finally {
      setUploading(false)
    }
  };



  useEffect(() => {
    const dataForAdmin = async () => {
      try {
        const songData = await axios.get("http://localhost:4000/api/song/songs")
        setSongs(songData.data.songs)
        // console.log(songData.data.songs)
      } catch (error) {
        console.error("Error", error)
      }
    }
    dataForAdmin()
  }, [])


  const random = songs.length > 0 ? Math.floor(Math.random() * songs.length) : "null"
  // console.log(random)

  return (
    <div className="w-screen h-screen bg-[#1A1824] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4">
        <h1 className="text-white text-2xl font-bold">PulsePlay Admin</h1>
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

      {/* Backdrop Overlay */}
      {!menuBarToggle && (
        <div
          className="fixed inset-0  bg-opacity-40 z-30"
          onClick={() => setMenuBarToggle(true)}
        ></div>
      )}

      {/* Navbar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[70%] border-r-2 flex flex-col gap-10 border-white bg-black bg-opacity-40 transform transition-transform duration-500 ease-in-out z-40
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
              <BsFillMusicPlayerFill size={27} className='text-white' />
              <Link to="/">
                Player
              </Link>
            </div>
          </ul>

          <div className='px-3 flex justify-between items-center'>
            <h1 className='text-white text-2xl'>User</h1>
            <button className='text-white text-sm border border-[#FD830D] px-2 py-1 rounded-md'>LogOut</button>
          </div>
        </div>



      </div>



      <div className='flex flex-col gap-7'>
        <div className=' flex justify-around pt-8 px-2'>
          <div className='flex items-center flex-col pt-3 gap-2 border  rounded-md h-22 w-25 bg-[#FD830D]'>
            <p className='text-sm text-white font-semibold'>Total Songs</p>
            <h1 className='text-3xl font-bold text-white'>{songs.length ? songs.length : (<p className='text-sm'>Loading</p>)}</h1>
          </div>
          <div className='flex items-center flex-col pt-3 gap-2 border  rounded-md h-22 w-25 bg-[#FD830D]'>
            <p className='text-sm text-white font-semibold'>Total Songs</p>
            <h1 className='text-3xl font-bold text-white'>153</h1>
          </div>
          <div className='flex items-center flex-col pt-3 gap-2 border  rounded-md h-22 w-25 bg-[#FD830D]'>
            <p className='text-sm text-white font-semibold'>Total Songs</p>
            <h1 className='text-3xl font-bold text-white'>153</h1>
          </div>
        </div>



        <div className='flex justify-center gap-5 '>
          <div className=' h-55 w-50 rounded-md  '>
            <div className=' flex flex-col  h-full w-full justify-between py-2 px-2 gap-2'>
              <div><h1 className='text-xl font-bold text-white'>Most Played</h1></div>
              <div className='h-42 w-45 bg-white rounded-md'>
                <div className='w-full h-full overflow-hidden object-cover rounded-md border border-white'>
                  {songs.length > 0 && songs[random] ? (<img src={songs[random].coverImage} />) : "Loading"}
                </div>
              </div>
            </div>
          </div>



          <div className='flex flex-col justify-center gap-5'>
            <div className='border h-20 w-30 rounded-md border-white bg-[#aaaaaa] flex justify-center items-center'>
              <IoAddCircleOutline onClick={handleAddSongToggle} size={60} className='text-white' />
            </div>
            <div className='border h-20 w-30 rounded-md border-white bg-[#aaaaaa] flex justify-center items-center'>
              <MdDelete size={60} className='text-white' />
            </div>
          </div>
        </div>

        {addSongToggle && (
          <div className=' pl-5'>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setAddSongToggle(false)} // close when clicking outside
            ></div>

            {/* Form Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 w-85 pl-7 transition-all duration-75">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
                {/* Close Button */}
                <button
                  onClick={() => setAddSongToggle(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center">Upload Song</h2>
                <form className="flex flex-col gap-4">
                  <input ref={titleRef}
                    type="text"
                    name="title"
                    placeholder="Song Title"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input ref={artistRef}
                    type="text"
                    name="artist"
                    placeholder="Artist"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input ref={genreRef}
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <label className="flex flex-col overflow-hidden">
                    Cover Image:
                    <button className='border p-2 rounded-md bg-green-500 text-white font-bold'>
                      <input ref={coverRef}
                        type="file"
                        name="coverImage"
                        accept="image/*"
                        className="mt-1"
                      />
                    </button>

                  </label>
                  <label className="flex flex-col overflow-hidden">
                    Audio File:
                    <button className='border p-2 rounded-md bg-green-500 text-white font-bold'>
                      <input ref={audioRef}
                        type="file"
                        name="audioFile"
                        accept="audio/*"
                        className="mt-1"
                        required
                      />
                    </button>
                  </label>
                  <button onClick={handleUpload}
                    type="submit"
                    className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}


        <div className='flex justify-center pt-'>
          <div className='h-20 w-85 bg-pink-300 rounded-md'>
          </div>
        </div>
        <div className='flex justify-center pt-'>
          <div className='h-20 w-85 bg-pink-300 rounded-md'>
          </div>
        </div>
      </div>






    </div>
  )
}

export default AdminDashboard
