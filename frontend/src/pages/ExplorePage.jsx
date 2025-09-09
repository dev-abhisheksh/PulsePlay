// ExplorePage.jsx
import React, { useEffect, useState } from 'react'
import Navbar from '../components/homepage/Navbar'
import PlayerBottom from '../components/homepage/PlayerBottom'
import SearchBar from '../components/homepage/SeachBar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const ExplorePage = ({ songs, currentIndex, setCurrentIndex }) => {
  const [searchResults, setSearchResults] = useState([])
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const pp = "https://pulseplay-8e09.onrender.com"
  const localhost = "http://localhost:4000"

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${pp}/api/verify`, { withCredentials: true });
        setUser(res.data.user);
        console.log(res.data.user);
      } catch (error) {
        console.log(error);
        // Optional: redirect if not authenticated
        navigate("/login");
      }
    };
    fetchUser();
  }, []);

  const handleSongSelect = (song) => {
    const indexInSongs = songs.findIndex((s) => s._id === song._id)
    if (indexInSongs !== -1) {
      setCurrentIndex(indexInSongs)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <SearchBar onSongSelect={handleSongSelect} />

      <PlayerBottom
        songs={songs}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  )
}

export default ExplorePage
