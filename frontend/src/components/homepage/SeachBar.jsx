// SearchBar.jsx
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

const SearchBar = ({ onSongSelect, currentIndex, songs = [] }) => {
    const [searchValue, setSearchValue] = useState('')
    const [results, setResults] = useState([])
    const boxRef = useRef(null)
    const currentSong = songs[currentIndex] || {};
  const pp = "https://pulseplay-8e09.onrender.com"  /*"http://localhost:4000"*/;

    useEffect(() => {
        if (!searchValue.trim()) {
            setResults([])
            return
        }

        const fetchSongs = async () => {
            try {
                const res = await axios.get(
                    `${pp}/api/song/search?title=${searchValue}`,
                    { withCredentials: true }
                )
                setResults(res.data.songs || [])
            } catch (err) {
                console.error('Error fetching songs:', err)
            }
        }

        fetchSongs()
    }, [searchValue])

    // click outside hides box
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setResults([])
                setSearchValue("")
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div
            ref={boxRef}
            className="relative h-[10vh] w-full bg-[#1A1824] flex items-center justify-center gap-3 px-3"
        >
            <input
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-[67%] w-[80%] rounded-full bg-[#393939] text-white font-bold focus:outline-none px-4 placeholder-gray-400"
            />
            <div className="h-[70%] w-[13%] rounded-full bg-[#393939] flex justify-center items-center">
                <FaSearch size={23} className="text-white" />
            </div>

            {results.length > 0 && (
                <div className="absolute top-[10vh] left-[2.%] bg-[#1A1824] w-[95%] p-3 rounded-md text-white max-h-[200px] overflow-y-auto shadow-lg border-2 border-white flex flex-col gap-2" >
                    {results.map((song) => (
                        <h1
                            key={song._id}
                            onClick={() => onSongSelect(song)}  // 👈 HERE
                            className="cursor-pointer hover:bg-gray-700 px-2 py-1 flex items-center gap-3 border-1 border-[#FD830D] rounded-md "
                        >
                            <img src={song.coverImage} className="w-10 h-10 rounded-md object-cover border border-white"/>
                            {song.title} — {song.artist}
                        </h1>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchBar
