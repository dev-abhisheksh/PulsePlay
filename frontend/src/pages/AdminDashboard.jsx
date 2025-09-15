import React, { useEffect, useState, useRef } from 'react';
import { FaAlignJustify, FaAlignRight, FaHome, FaSearch, FaMusic, FaDownload, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoAddCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = ({ songs, setSongs }) => {
  const [menuBarToggle, setMenuBarToggle] = useState(true);
  const [user, setUser] = useState(null);
  const [addSongToggle, setAddSongToggle] = useState(false);
  const titleRef = useRef();
  const artistRef = useRef();
  const genreRef = useRef();
  const coverRef = useRef();
  const audioRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState();
  const navigate = useNavigate();
  const pp = "https://pulseplay-8e09.onrender.com"  /*"http://localhost:4000"*/;
  

  const handleSongVisibility = async (songId, currentlyHidden) => {
    try {
      // Optimistically update the UI immediately
      setSongs(prev =>
        prev.map(song =>
          song._id === songId ? { ...song, hidden: !currentlyHidden } : song
        )
      );

      if (currentlyHidden) {
        await axios.patch(`${pp}/api/song/${songId}/unhide`, {}, { withCredentials: true });
        toast.success("Song is now visible");
      } else {
        await axios.patch(`${pp}/api/song/${songId}/hide`, {}, { withCredentials: true });
        toast.success("Song is hidden");
      }

      // Refetch all songs to stay in sync with server
      const res = await axios.get(`${pp}/api/song/songs`);
      setSongs(res.data.songs);
    } catch (error) {
      console.log(error);
      toast.error("Failed to change visibility");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`${pp}/api/verify`, { withCredentials: true });
      setUsername(res.data.user);
    };
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    await axios.get(`${pp}/api/logout`, { withCredentials: true });
    navigate("/login");
    toast.success("Logged out");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${pp}/api/all-users`, { withCredentials: true });
        setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handleAddSongToggle = () => {
    setAddSongToggle(true);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append("title", titleRef.current.value);
    formData.append("artist", artistRef.current.value);
    formData.append("genre", genreRef.current.value);
    formData.append("coverImage", coverRef.current.files[0]);
    formData.append("audio", audioRef.current.files[0]);

    try {
      const response = await axios.post(
        `${pp}/api/song/add`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Upload successful:", response.data);
      alert("Song uploaded successfully!");
      setAddSongToggle(false);

      // Refresh songs list
      const res = await axios.get(`${pp}/api/song/songs`);
      setSongs(res.data.songs);

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload song.");
    } finally {
      setUploading(false);
    }
  };

  const random = songs.length > 0 ? Math.floor(Math.random() * songs.length) : "null";

  return (
    <div className="w-screen bg-[#1A1824] flex flex-col pb-5">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4">
        <h1 className="text-white text-2xl font-bold">
          <div className='flex gap-2'>PulsePlay <div className='text-red-500'>Admin</div></div>
        </h1>
        <div
          onClick={() => setMenuBarToggle(!menuBarToggle)}
          className="relative w-6 h-6 cursor-pointer"
        >
          <FaAlignJustify
            size={24}
            className={`absolute top-0 left-0 text-white transition-opacity duration-500 ${menuBarToggle ? "opacity-100" : "opacity-0"}`}
          />
          <FaAlignRight
            size={24}
            className={`absolute top-0 left-0 text-white transition-opacity duration-500 ${menuBarToggle ? "opacity-0" : "opacity-100"}`}
          />
        </div>
      </div>

      {/* Backdrop Overlay */}
      {!menuBarToggle && (
        <div
          className="fixed inset-0 bg-opacity-40 z-30"
          onClick={() => setMenuBarToggle(true)}
        ></div>
      )}

      {/* Navbar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[70%] border-r-2 flex flex-col gap-10 border-white bg-black bg-opacity-40 transform transition-transform duration-500 ease-in-out z-40
        ${menuBarToggle ? "-translate-x-full" : "translate-x-0"}`}
      >
        <h2 className="pl-7 pt-5 text-white text-2xl font-bold">
          <div className='flex gap-2'>PulsePlay <div className='text-red-500'>Admin</div></div>
        </h2>
        <div className='flex flex-col justify-between h-screen pb-10 px-3'>
          <ul className="flex flex-col gap-7 p-4 text-white">
            <div className='flex items-center gap-6'>
              <FaHome size={25} className='text-white ' />
              <Link to="/">Player</Link>
            </div>
            <div className='flex items-center gap-6'>
              <FaSearch size={20} className='text-white' />
              <h1>Search</h1>
            </div>
            <div className='flex items-center gap-6'>
              <FaMusic size={20} className='text-white' />
              <Link to="/playlist">PlayLists</Link>
            </div>
            <div className='flex items-center gap-6'>
              <FaDownload size={20} className='text-white' />
              <h1>Download</h1>
            </div>
          </ul>

          <div className='px-3 flex justify-between items-center'>
            <h1 className='text-white text-2xl'>{username ? username.username : "user"}</h1>
            <button onClick={handleLogout} className='text-white text-sm border border-[#FD830D] px-2 py-1 rounded-md'>LogOut</button>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-7'>
        {/* Dashboard cards */}
        <div className='flex justify-around pt-8 px-2'>
          <div className='flex items-center flex-col pt-3 gap-2 border rounded-md h-22 w-25 bg-[#FD830D]'>
            <p className='text-sm text-white font-semibold'>Total Songs</p>
            <h1 className='text-3xl font-bold text-white'>{songs.length || <p className='text-sm'>Loading</p>}</h1>
          </div>
          <div className='flex items-center flex-col pt-3 gap-2 border rounded-md h-22 w-25 bg-[#FD830D]'>
            <p className='text-sm text-white font-semibold'>Total Users</p>
            <h1 className='text-3xl font-bold text-white'>{user ? user.length : <p className='text-sm'>Loading</p>}</h1>
          </div>
          <div className='flex items-center flex-col pt-3 gap-2 border rounded-md h-22 w-25 bg-[#FD830D]'>
            <p className='text-sm text-white font-semibold'></p>
            <h1 className='text-3xl font-bold text-white'></h1>
          </div>
        </div>

        {/* Add/Delete & Random */}
        <div className='flex justify-center gap-5'>
          <div className='h-55 w-50 rounded-md'>
            <div className='flex flex-col h-full w-full justify-between py-2 px-2 gap-2'>
              <div><h1 className='text-xl font-bold text-white'>Best Random 4u</h1></div>
              <div className='h-42 w-45 bg-white rounded-md'>
                <div className='w-full h-full overflow-hidden object-cover rounded-md border border-white'>
                  {songs.length > 0 && songs[random] ? (<img src={songs[random].coverImage} />) : "Loading"}
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-center gap-5'>
            <div className='border h-20 w-30 rounded-md border-white bg-white flex justify-center items-center'>
              <IoAddCircleOutline onClick={handleAddSongToggle} size={60} className='text-green-500' />
            </div>
            <div className='border h-20 w-30 rounded-md border-white bg-white flex justify-center items-center'>
              <MdDelete size={60} className='text-red-500' />
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {addSongToggle && (
          <div className='pl-5'>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setAddSongToggle(false)}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 w-85 pl-7 transition-all duration-75">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
                <button onClick={() => setAddSongToggle(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
                <h2 className="text-2xl font-bold mb-4 text-center">Upload Song</h2>
                <form className="flex flex-col gap-4">
                  <input ref={titleRef} type="text" name="title" placeholder="Song Title" className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                  <input ref={artistRef} type="text" name="artist" placeholder="Artist" className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                  <input ref={genreRef} type="text" name="genre" placeholder="Genre" className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <label className="flex flex-col overflow-hidden">
                    Cover Image:
                    <button className='border p-2 rounded-md bg-green-500 text-white font-bold'>
                      <input ref={coverRef} type="file" name="coverImage" accept="image/*" className="mt-1" />
                    </button>
                  </label>
                  <label className="flex flex-col overflow-hidden">
                    Audio File:
                    <button className='border p-2 rounded-md bg-green-500 text-white font-bold'>
                      <input ref={audioRef} type="file" name="audioFile" accept="audio/*" className="mt-1" required />
                    </button>
                  </label>
                  <button onClick={handleUpload} type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Song Management List */}
        <div className='flex justify-center'>
          <div className='w-[90%] h-auto bg-[#2A2738] flex flex-col items-center rounded-md gap-7 border border-white' >
            <h1 className='text-white font-bold text-2xl pt-3'>Song Management</h1>
            <div className='flex flex-col gap-3 pb-3'>
              {songs.map((song) => (
                <div key={song._id} className='flex justify-between gap-10 border border-white rounded items-center px-2 py-1 bg-[#444445]'>
                  <p className="text-white text-lg">{song.title}</p>
                  {song.hidden ? (
                    <FaEyeSlash className="text-red-400 cursor-pointer" onClick={() => handleSongVisibility(song._id, true)} />
                  ) : (
                    <FaEye className="text-green-400 cursor-pointer" onClick={() => handleSongVisibility(song._id, false)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
