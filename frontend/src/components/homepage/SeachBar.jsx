// SearchBar.jsx
import axios from 'axios'
import React, { useEffect, useRef, useState, useContext } from 'react'
import { FaSearch } from 'react-icons/fa'
import { IoFilterCircle, IoListCircle } from "react-icons/io5";
import { ApiContext } from '../../context/ApiContext';

const SearchBar = ({ onSongSelect, currentIndex, songs = [], isFilterGenreToggle, setIsFilterGenreToggle }) => {
    const [searchValue, setSearchValue] = useState('')
    const [results, setResults] = useState([])
    const boxRef = useRef(null)
    const currentSong = songs[currentIndex] || {};
    const [isFilterSelected, setIsFilterSelected] = useState(false)

    const pp = useContext(ApiContext)

    const GenreToggle = () => {
        setIsFilterGenreToggle((prev) => !prev);
        setIsFilterSelected((prev) => !prev);
    };


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
            className="relative h-[8vh] w-full bg-[#1A1824] flex items-center justify-center gap-3 px-3"
        >
            <input
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-[67%] w-[80%] rounded-full bg-[#393939] text-white font-bold focus:outline-none px-4 placeholder-gray-400"
            />
            <div onClick={GenreToggle} className=" rounded-full bg-[#393939] flex justify-center items-center">
                {isFilterSelected ? <IoFilterCircle size={40} className="text-green-400" /> : <IoFilterCircle size={40} className="text-white" />}
            </div>

            {results.length > 0 && (
                <div
                    className="
            absolute top-[10vh] left-[2.5%] z-30
            bg-[#373737] w-[95%] p-3 
            rounded-md text-white 
            max-h-[200px] overflow-y-auto 
            shadow-lg border-2 border-gray-700 
            flex flex-col gap-2
            animate-fadeIn
          "
                >
                    {results.map((song, index) => (
                        <h1
                            key={song._id}
                            onClick={() => onSongSelect(song)}
                            style={{ animationDelay: `${index * 50}ms` }}
                            className="
                cursor-pointer hover:bg-gray-700 
                px-2 py-1 
                flex items-center gap-3 
                border-[#FD830D] rounded-md
                animate-slideIn
                transition-colors duration-200
              "
                        >
                            <img
                                src={song.coverImage}
                                className="w-10 h-10 rounded-md object-cover border border-white"
                                alt={song.title}
                            />
                            {song.title} — {song.artist}
                        </h1>
                    ))}
                </div>
            )}

            <style>
                {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }


          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }

          .animate-slideIn {
            animation: slideIn 0.4s ease-out both;
          }
        `}
            </style>
        </div>
    )
}

export default SearchBar
