import React, { useEffect, useState, useRef, useContext } from 'react';
import { FaUserEdit, FaAlignJustify, FaAlignRight, FaHome, FaSearch, FaMusic, FaDownload, FaEye, FaEyeSlash, } from "react-icons/fa";
import { TiEdit } from "react-icons/ti";
import { Link } from 'react-router-dom';
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineSettingsSuggest, MdEditNotifications, MdOutlineNoteAdd } from "react-icons/md";
import { AiOutlineUserDelete, AiFillEdit } from "react-icons/ai";
import { FaNoteSticky } from "react-icons/fa6";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ApiContext } from '../context/ApiContext';
// import { ChangeLogContext } from '../context/fetchChangelog';


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
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [currentEditSong, setCurrentEditSong] = useState(null);
  const [editSongModal, setEditSongModal] = useState(false)
  const [isUserEditToggleOpen, setIsUserEditToggleOpen] = useState(false)
  const [isSongEditToggleOpen, setIsSongEditToggleOpen] = useState(false)
  const [allUsers, setAllUsers] = useState()
  const [changelogs, setChangelogs] = useState()
  const [role, setRole] = useState("user")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [toggleCreateChangelog, setToggleCreateChangelog] = useState(false)
  const [toggleUpdateChangelog, setToggleUpdateChangelog] = useState(false)
  const [updateTitleValue, setUpdateTitleValue] = useState("")
  const [updateDescValue, setUpdateDescValue] = useState("")

  const GENRES = [
    // 🎵 Global / Core
    "Pop",
    "Rock",
    "Hip-Hop",
    "Rap",
    "R&B",
    "Jazz",
    "Blues",
    "Classical",
    "Electronic",
    "EDM",
    "House",
    "Techno",
    "Trance",
    "Dubstep",
    "Lo-fi",
    "Phonk",
    "Ambient",
    "Instrumental",

    // 😔 Mood / Vibe
    "Sad",
    "Chill",
    "Romantic",
    "Workout",
    "Party",
    "Feel Good",
    "Sleep",
    "Motivational",

    // 🇮🇳 Indian
    "Bollywood",
    "Indian Classical",
    "Carnatic",
    "Hindustani",
    "Punjabi",
    "Desi Hip-Hop",
    "Indie Indian",
    "Bhajan",
    "Qawwali",
    "Sufi",
    "Garba",
    "Bhangra",

    // 🎌 Anime / Japanese
    "Anime",
    "Anime OST",
    "J-Pop",
    "J-Rock",
    "Vocaloid",
    "City Pop",

    // 🌍 Regional / World
    "K-Pop",
    "Latin",
    "Reggae",
    "Afrobeats",
    "Folk",
    "Country",
    "Metal",
    "Heavy Metal",
    "Alternative",
    "Indie",

    // 🎮 / Media
    "Game OST",
    "Movie OST",
    "Web Series OST",
    "Background Score",

    // 🧪 Experimental / Niche
    "Synthwave",
    "Retrowave",
    "Drill",
    "Trap",
    "Experimental"
  ];



  const pp = useContext(ApiContext)


  const fetchChangelogs = async () => {
    try {
      const res = await axios.get(`${pp}/api/get`, { withCredentials: true });
      setChangelogs(res.data);
      setUpdateTitleValue(res.data[0].title)
      setUpdateDescValue(res.data[0].description)
    } catch (err) {
      toast.error("Failed to fetch changelogs");
    }
  };

  // ✅ Create
  const createChangelog = async (title, description) => {
    try {
      const res = await axios.post(
        `${pp}/api/create`,
        { title, description },
        { withCredentials: true }
      );
      setChangelogs([res.data, ...(changelogs || [])]);
      toast.success("Changelog created!");
    } catch (err) {
      toast.error("Failed to create changelog");
      console.log(err)
    }
  };

  // ✅ Update
  const updateChangelog = async (title, description) => {
    const selectedId = changelogs[0]
    try {
      const res = await axios.patch(
        `${pp}/api/update/${selectedId._id}`, // use the single changelog's ID
        { title, description },
        { withCredentials: true }
      );
      setChangelogs(res.data);
      toast.success("Changelog updated!");
    } catch (err) {
      toast.error("Failed to update changelog");
      console.log(err)
    }
  };


  // ✅ Delete
  const deleteChangelog = async () => {
    const id = changelogs[0]._id;
    try {
      await axios.delete(`${pp}/api/delete/${id}`, { withCredentials: true });
      setChangelogs(changelogs.filter((log) => log._id !== id));
      toast.info("Changelog deleted");
    } catch (err) {
      toast.error("Failed to delete changelog");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${pp}/api/all-users`, { withCredentials: true })
      setAllUsers(res.data)
      console.lo(res.data)
    } catch (error) {

    }
  }

  const deleteUser = async () => {
    try {
      const res = await axios.delete(`${pp}/api/delete-user`, { data: { username }, withCredentials: true })
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to delete role");
    }
  }

  const updateRole = async () => {
    try {
      const res = await axios.patch(`${pp}/api/role-update`, { username, role }, { withCredentials: true })
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to update role");
    }
  }

  // Open modal and select song
  const openEditModal = (song) => {
    setCurrentEditSong(song);
    setEditSongModal(true);
  };



  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!currentEditSong) return;

    const formData = new FormData();
    if (currentEditSong.title) formData.append("title", currentEditSong.title);
    if (currentEditSong.artist) formData.append("artist", currentEditSong.artist);
    if (currentEditSong.genre) formData.append("genre", currentEditSong.genre);
    if (coverRef.current.files[0]) formData.append("coverImage", coverRef.current.files[0]);
    if (audioRef.current.files[0]) formData.append("audio", audioRef.current.files[0]);


    try {
      await axios.patch(`${pp}/api/song/${currentEditSong._id}/edit-song`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Song updated successfully!");
      setEditSongModal(false);
      setCurrentEditSong(null);

      console.log(currentEditSong)

      const res = await axios.get(`${pp}/api/song/songs`);
      setSongs(res.data.songs);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update song");
    }
  };



  const handleSongVisibility = async (songId, currentlyHidden) => {
    try {
      // optimistic update
      setSongs(prev =>
        prev.map(song =>
          song._id === songId
            ? { ...song, hidden: !currentlyHidden }
            : song
        )
      );

      if (currentlyHidden) {
        await axios.patch(`${pp}/api/song/${songId}/unhide`, {}, { withCredentials: true });
        toast.success("Song is now visible");
      } else {
        await axios.patch(`${pp}/api/song/${songId}/hide`, {}, { withCredentials: true });
        toast.success("Song is hidden");
      }

      // ✅ NO refetch from public endpoint
    } catch (error) {
      toast.error("Failed to change visibility");

      // rollback
      setSongs(prev =>
        prev.map(song =>
          song._id === songId
            ? { ...song, hidden: currentlyHidden }
            : song
        )
      );
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
    const fetchUsersCount = async () => {
      try {
        const res = await axios.get(`${pp}/api/all-users`, { withCredentials: true });
        setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsersCount();
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

  const visibleSongs = songs.filter(song => !song.hidden);
  const random = visibleSongs.length > 0 ? Math.floor(Math.random() * visibleSongs.length) : null;



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
              <Link to="/">Home</Link>
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
          <div className='h-50 w-50 rounded-md'>
            <div className='flex flex-col h-full w-full justify-between py-2 px-2 gap-2'>
              {/* <div><h1 className='text-xl font-bold text-white'>Best Random 4u</h1></div> */}
              <div className='h-42 w-45 bg-white rounded-md'>
                <div className='w-full h-full overflow-hidden object-cover rounded-md border border-white'>
                  {songs.length > 0 && songs[random] ? (<img src={songs[random].coverImage} />) : "Loading"}
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col py-2 gap-2'>
            <div className='border h-20 w-30 rounded-md border-white bg-[#2A2738] flex justify-center items-center'>
              <div className='p-[1px] rounded-full bg-white cursor-pointer'>
                <IoAddCircleOutline onClick={handleAddSongToggle} size={60} className='text-green-500' />
              </div>
            </div>

            <div className='border h-20 w-30 rounded-md border-white bg-[#2A2738] flex justify-center items-center'>
              <div className='p-1 rounded-md bg-white'>
                <FaNoteSticky
                  size={50}
                  className='text-red-500 cursor-pointer'

                />
              </div>
            </div>


          </div>
        </div>

        {editSongModal && currentEditSong && (
          <div className="fixed inset-0 flex justify-center items-center z-40">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setEditSongModal(false)}
            ></div>

            <div className="relative bg-white rounded-md p-6 w-96 z-50">
              <h1 className="text-xl font-bold mb-4">Edit Song</h1>

              <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">

                {/* TITLE */}
                <div className="flex flex-col">
                  <label>Title</label>
                  <input
                    type="text"
                    value={currentEditSong.title || ""}
                    onChange={(e) =>
                      setCurrentEditSong({ ...currentEditSong, title: e.target.value })
                    }
                    className="border rounded px-2 py-1"
                    required
                  />
                </div>

                {/* ARTIST */}
                <div className="flex flex-col">
                  <label>Artist</label>
                  <input
                    type="text"
                    value={currentEditSong.artist}
                    onChange={(e) =>
                      setCurrentEditSong({ ...currentEditSong, artist: e.target.value })
                    }
                    className="border rounded px-2 py-1"
                    required
                  />
                </div>

                {/* GENRE */}
                <div className="flex flex-col">
                  <label>Genre</label>
                  <select
                    value={currentEditSong.genre || ""}
                    onChange={(e) =>
                      setCurrentEditSong({ ...currentEditSong, genre: e.target.value })
                    }
                    className="border rounded px-2 py-1"
                    required
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* COVER */}
                <div className="flex flex-col">
                  <label>Cover Image</label>
                  <input ref={coverRef} type="file" accept="image/*" />
                </div>

                {/* AUDIO */}
                <div className="flex flex-col">
                  <label>Audio File</label>
                  <input ref={audioRef} type="file" accept="audio/*" />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        )}



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
                  <select ref={genreRef} name="genre" className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>

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



        <div className='flex justify-center'>
          <div className='flex justify-between w-[90%] gap-5'>
            <div onClick={() => setIsSongEditToggleOpen(!isSongEditToggleOpen)} className='w-[50%] h-[10vh] border bg-blue-400 rounded-md flex justify-center items-center gap-3 text-white font-bold text-2xl'><MdEditNotifications size={30} /> Song </div>
            <div onClick={() => setIsUserEditToggleOpen(!isUserEditToggleOpen)} className='w-[50%] h-[10vh] border bg-blue-400 rounded-md flex justify-center items-center gap-3 text-white font-bold text-2xl'><FaUserEdit size={30} /> User </div>
          </div>
        </div>


        {isSongEditToggleOpen && (
          <div className='flex justify-center'>
            <div className='w-[90%] h-auto bg-[#2A2738] flex flex-col items-center rounded-md gap-7 border border-white' >
              <h1 className='text-white font-bold text-2xl pt-3'>Song Management</h1>
              <div className='flex flex-col gap-3 pb-3'>
                {songs.map((song) => (
                  <div
                    key={song._id}
                    className="flex justify-between gap-10 border border-white rounded items-center px-2 py-1 bg-[#444445]"
                  >
                    <p className="text-white text-lg">{song.title}</p>

                    <div className="flex gap-3">
                      {song.hidden ? (
                        <FaEyeSlash
                          className="text-red-400 cursor-pointer"
                          onClick={() => handleSongVisibility(song._id, true)}
                        />
                      ) : (
                        <FaEye
                          className="text-green-400 cursor-pointer"
                          onClick={() => handleSongVisibility(song._id, false)}
                        />
                      )}

                      {/* Edit Button */}
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => openEditModal(song)}
                      >
                        <AiFillEdit />
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        )}






        {isUserEditToggleOpen && (
          <div className="flex justify-center items-center gap-5">
            <div className="flex flex-col justify-center items-center w-[90%] max-w-md gap-5">

              <div className="w-full flex justify-center items-center ">
                <div className="w-[95%] max-w-md bg-[#393939] shadow-lg rounded-xl p-6">
                  {/* Header */}
                  <div className="bg-blue-400 text-white font-semibold text-center py-2 rounded-md mb-6">
                    <h1>Update Role</h1>
                  </div>

                  {/* Form */}
                  <div className="flex flex-col gap-4">
                    <input
                      // value={username}
                      type="text"
                      placeholder="Enter username"
                      className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <select
                      value={role} onChange={(e) => setRole(e.target.value)}
                      className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                    <button onClick={updateRole} className="bg-green-500 text-white py-2 rounded-lg hover:bg-purple-600 transition">
                      Update
                    </button>
                  </div>
                </div>
              </div>




              <div className="w-full flex justify-center items-center ">
                <div className="w-[95%] max-w-md bg-[#393939] shadow-lg rounded-xl p-6">
                  {/* Header */}
                  <div className="bg-blue-400 text-white font-semibold text-center py-2 rounded-md mb-6">
                    <h1 >Delete User</h1>
                  </div>

                  {/* Form */}
                  <div className="flex gap-4">
                    <input
                      // value={username}
                      type="text"
                      placeholder="Enter username"
                      className="border w-[80%] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      onChange={(e) => setUsername(e.target.value)}
                    />

                    <button onClick={deleteUser} className="bg-red-500 text-white py-2 rounded-lg hover:bg-purple-600 transition">
                      <AiOutlineUserDelete size={20} className='w-10' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='flex justify-center'>
          <div className='w-[90%] bg-[#393939] rounded-md flex flex-col justify-center py-2 items-center gap-3'>
            <div className='flex flex-col gap-5 pb-4 w-[90%]'>
              <h1 className='text-white font-bold text-[20px]'>ChangeLog Management</h1>



              <div className='flex justify-center gap-3 w-full  '>
                <button onClick={() => setToggleCreateChangelog(!toggleCreateChangelog)} className='border px- py-1 px-2 font-bold text-white rounded-md bg-green-400'>Create</button>
                <button onClick={() => setToggleUpdateChangelog(!toggleUpdateChangelog)} className='border px- py-1 px-2 font-bold text-white rounded-md bg-orange-400'>Update</button>
                <button onClick={deleteChangelog} className='border px- py-1 px-2 font-bold text-white rounded-md bg-red-400'>Delete</button>
                <button onClick={fetchChangelogs} className='border px- py-1 px-2 font-bold text-white rounded-md bg-yellow-400'>Fetch</button>
              </div>



              <div className="bg-gray-100 p-4 rounded-lg shadow-md max-h-96 overflow-y-auto w-full">
                {changelogs && changelogs.length > 0 ? (
                  changelogs.map((log) => (
                    <div
                      key={log._id}
                      className="bg-white p-4 rounded-md mb-3 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <h1 className="text-orange-500 font-semibold text-lg">{log.title}</h1>
                      <p className="text-gray-600 mt-1 pl-3" >{log.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-700 font-medium text-center">No changelogs available</p>
                )}
              </div>



              {toggleUpdateChangelog && (
                <div className='bg-[#393939 flex flex-col gap-2 w-full border-t-2 border-orange-500 pt-3'>
                  <h1 className='text-white font-bold '>Update ChangeLog</h1>
                  <div className='flex flex-col gap-1'>
                    <input
                      value={updateTitleValue}
                      type="text"
                      className='outline-0 border-black bg-[#575656] h-8 rounded-md text-white font-bold px-3 '
                      onChange={(e) => setUpdateTitleValue(e.target.value)}
                      placeholder='Title'
                    />

                    <input
                      value={updateDescValue}
                      type="text"
                      className='outline-0 border-black bg-[#575656] h-8 rounded-md text-white font-bold px-3 '
                      onChange={(e) => setUpdateDescValue(e.target.value)}
                      placeholder='Description'
                    />

                  </div>
                  <button onClick={() => updateChangelog(updateTitleValue, updateDescValue)} className='text-white bg-green-400 rounded-md font-bold'>Proceed</button>

                </div>
              )}


              {toggleCreateChangelog && (
                <div className='bg-[#393939 flex flex-col gap-2 w-full border-t-2 border-orange-500 pt-3'>
                  <h1 className='text-white font-bold '>Create ChangeLog</h1>
                  <div className='flex flex-col gap-1'>
                    <input

                      type="text"
                      className='outline-0 border-black bg-[#575656] h-8 rounded-md text-white font-bold px-3 '
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder='Title'
                    />

                    <input

                      type="text"
                      className='outline-0 border-black bg-[#575656] h-8 rounded-md text-white font-bold px-3 '
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder='Description'
                    />

                  </div>
                  <button onClick={() => createChangelog(title, description)} className='text-white bg-green-400 rounded-md font-bold'>Create</button>

                </div>
              )}

            </div>
          </div>
        </div>


        <div className="w-full flex justify-center items-center py-5">
          <div className="w-[90%] max-w-3xl bg-[#393939] rounded-xl shadow-lg flex flex-col items-center py-5 gap-5">

            {/* Header: Title + Search Icon */}
            <div className='flex items-center gap-3 w-full justify-between px-5 pb-2 border-b border-gray-700'>
              <h1 className="text-2xl text-white font-bold">Fetch All Users</h1>
              <button onClick={fetchUsers} className="text-white p-2 bg-orange-500 rounded-md hover:bg-gray-700 transition-colors border">
                <FaSearch size={22} />
              </button>
            </div>

            {/* Data Container */}
            <div className="flex flex-col gap-2 w-full px-5 max-h-96 overflow-y-auto">

              {allUsers && allUsers.length > 0 ? (
                allUsers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white text-black px-3 py-2 rounded-md hover:bg-gray-600 transition-all flex justify-between items-center"
                  >
                    <p className='font-bold'>{user.username}</p>
                    <p className={`text-sm ${user.role === "admin" ? "text-red-400 font-bold" : "text-green-500 font-bold"}`}>
                      {user.role}
                    </p>
                  </div>
                ))
              ) : (
                ""
              )}

            </div>
          </div>
        </div>


        <div className='h-10 w-full'>

        </div>


      </div>
    </div>
  );
};

export default AdminDashboard;
