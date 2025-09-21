import React, { useState } from 'react'

const GenreFilter = ({ isFilterGenreToggle, selectedGenre, setSelectedGenre }) => {
    const genres = ["Phonk", "R&B", "Rock", "Pop"]

    const handleGenreClick = (genre) => {
        setSelectedGenre(prev => prev === genre ? null : genre)
    }

    return (
        <div
            className={`
        bg-[#1A1824] flex items-center justify-center gap-5
        transition-all duration-500 ease-in-out
        ${isFilterGenreToggle ? "max-h-20 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-5 overflow-hidden"}
      `}
        >
            {genres.map((genre) => (
                <button
                    key={genre}
                    onClick={() => handleGenreClick(genre)}
                    className={`
            rounded-md font-bold h-8 w-16 flex justify-center items-center
            ${selectedGenre === genre ? "bg-green-500 text-black" : "bg-[#393939] text-white"}
          `}
                >
                    {genre}
                </button>
            ))}
        </div>
    )
}


export default GenreFilter
